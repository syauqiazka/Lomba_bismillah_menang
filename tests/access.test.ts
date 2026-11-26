import { describe, it, expect } from "vitest";
import {
  evaluateRouteAccess,
  assertEntityAccessOr404,
  canEditReport,
  canVerify,
  canAdmin,
  EntityNotFoundError,
} from "@/lib/access";
import { SessionData } from "@/lib/session-options";

describe("Security & Authorization: RBAC & IDOR Protection (access.ts)", () => {
  const relawanSession: SessionData = {
    userId: "user-relawan-1",
    name: "Dewi",
    email: "dewi@trasec.id",
    role: "RELAWAN",
    isVerifiedVolunteer: true,
  };

  const verifikatorSession: SessionData = {
    userId: "user-verifikator-1",
    name: "Budi",
    email: "budi@trasec.id",
    role: "VERIFIKATOR",
    isVerifiedVolunteer: true,
  };

  const adminSession: SessionData = {
    userId: "user-admin-1",
    name: "Admin",
    email: "admin@trasec.id",
    role: "ADMIN",
    isVerifiedVolunteer: true,
  };

  describe("evaluateRouteAccess (Evaluasi Rute & Redirect / 403)", () => {
    it("harus mengarahkan pengguna anonim ke login saat mengakses /lapor", () => {
      const res = evaluateRouteAccess("/lapor", null);
      expect(res.allowed).toBe(false);
      expect(res.redirectUrl).toBe("/login?next=%2Flapor");
    });

    it("harus mengizinkan seluruh pengguna terautentikasi mengakses /lapor", () => {
      expect(evaluateRouteAccess("/lapor", relawanSession).allowed).toBe(true);
      expect(evaluateRouteAccess("/lapor", verifikatorSession).allowed).toBe(true);
      expect(evaluateRouteAccess("/lapor", adminSession).allowed).toBe(true);
    });

    it("harus mengarahkan pengguna anonim ke login saat mengakses /verifikasi", () => {
      const res = evaluateRouteAccess("/verifikasi", null);
      expect(res.allowed).toBe(false);
      expect(res.redirectUrl).toBe("/login?next=%2Fverifikasi");
    });

    it("harus menolak RELAWAN dengan status 403 saat mencoba mengakses /verifikasi", () => {
      const res = evaluateRouteAccess("/verifikasi", relawanSession);
      expect(res.allowed).toBe(false);
      expect(res.isForbidden).toBe(true);
    });

    it("harus mengizinkan VERIFIKATOR dan ADMIN mengakses /verifikasi", () => {
      expect(evaluateRouteAccess("/verifikasi", verifikatorSession).allowed).toBe(true);
      expect(evaluateRouteAccess("/verifikasi", adminSession).allowed).toBe(true);
    });

    it("harus mengarahkan pengguna anonim ke login saat mengakses /admin", () => {
      const res = evaluateRouteAccess("/admin", null);
      expect(res.allowed).toBe(false);
      expect(res.redirectUrl).toBe("/login?next=%2Fadmin");
    });

    it("harus menolak pengguna non-ADMIN (RELAWAN dan VERIFIKATOR) dari rute /admin dengan 403", () => {
      expect(evaluateRouteAccess("/admin", relawanSession).isForbidden).toBe(true);
      expect(evaluateRouteAccess("/admin", verifikatorSession).isForbidden).toBe(true);
    });

    it("harus mengizinkan ADMIN mengakses /admin", () => {
      expect(evaluateRouteAccess("/admin", adminSession).allowed).toBe(true);
    });

    it("harus mengizinkan publik (anonim maupun login) membuka rute publik", () => {
      expect(evaluateRouteAccess("/", null).allowed).toBe(true);
      expect(evaluateRouteAccess("/darurat", null).allowed).toBe(true);
      expect(evaluateRouteAccess("/laporan/rep-1", null).allowed).toBe(true);
    });

    it("harus mengarahkan anonim ke login saat mengakses /antrean, /kebutuhan, dan /distribusi", () => {
      expect(evaluateRouteAccess("/antrean", null).redirectUrl).toBe("/login?next=%2Fantrean");
      expect(evaluateRouteAccess("/kebutuhan", null).redirectUrl).toBe("/login?next=%2Fkebutuhan");
      expect(evaluateRouteAccess("/distribusi", null).redirectUrl).toBe("/login?next=%2Fdistribusi");
    });

    it("harus membatasi /distribusi hanya untuk VERIFIKATOR atau ADMIN", () => {
      expect(evaluateRouteAccess("/distribusi", relawanSession).isForbidden).toBe(true);
      expect(evaluateRouteAccess("/distribusi", verifikatorSession).allowed).toBe(true);
      expect(evaluateRouteAccess("/distribusi", adminSession).allowed).toBe(true);
    });
  });

  describe("assertEntityAccessOr404 (Proteksi IDOR & 404 vs 403)", () => {
    it("harus melempar EntityNotFoundError (404) jika entitas null", () => {
      expect(() => assertEntityAccessOr404(null, adminSession)).toThrow(EntityNotFoundError);
    });

    it("harus mengizinkan siapa saja melihat entitas berstatus VERIFIED", () => {
      const publicReport = { id: "rep-pub", status: "VERIFIED", reporterId: "user-x" };
      expect(assertEntityAccessOr404(publicReport, null)).toEqual(publicReport);
    });

    it("harus melempar 404 (bukan 403) jika pengunjung anonim mencoba mengakses laporan PENDING", () => {
      const pendingReport = { id: "rep-pend", status: "PENDING", reporterId: "user-relawan-1" };
      expect(() => assertEntityAccessOr404(pendingReport, null)).toThrow(EntityNotFoundError);
    });

    it("harus melempar 404 jika relawan lain mencoba mengakses laporan PENDING milik orang lain (Anti-IDOR)", () => {
      const pendingReport = { id: "rep-pend", status: "PENDING", reporterId: "user-relawan-99" };
      expect(() => assertEntityAccessOr404(pendingReport, relawanSession)).toThrow(EntityNotFoundError);
    });

    it("harus mengizinkan pelapor asli melihat laporan miliknya yang berstatus PENDING atau NEEDS_REVISION", () => {
      const ownReport = { id: "rep-pend", status: "PENDING", reporterId: "user-relawan-1" };
      expect(assertEntityAccessOr404(ownReport, relawanSession)).toEqual(ownReport);
    });

    it("harus mengizinkan VERIFIKATOR dan ADMIN memeriksa laporan yang belum berstatus publik", () => {
      const privateReport = { id: "rep-priv", status: "PENDING", reporterId: "user-other" };
      expect(assertEntityAccessOr404(privateReport, verifikatorSession)).toEqual(privateReport);
      expect(assertEntityAccessOr404(privateReport, adminSession)).toEqual(privateReport);
    });
  });

  describe("canEditReport (Hak Edit Laporan)", () => {
    it("hanya pelapor asli yang boleh mengedit laporan berstatus NEEDS_REVISION", () => {
      const reportRevision = { reporterId: "user-relawan-1", status: "NEEDS_REVISION" };
      expect(canEditReport(reportRevision, relawanSession)).toBe(true);

      const otherUser: SessionData = { userId: "user-other", role: "RELAWAN" };
      expect(canEditReport(reportRevision, otherUser)).toBe(false);
    });

    it("dilarang mengedit laporan jika statusnya bukan NEEDS_REVISION", () => {
      const verifiedReport = { reporterId: "user-relawan-1", status: "VERIFIED" };
      expect(canEditReport(verifiedReport, relawanSession)).toBe(false);

      const rejectedReport = { reporterId: "user-relawan-1", status: "REJECTED_FINAL" };
      expect(canEditReport(rejectedReport, relawanSession)).toBe(false);
    });
  });

  describe("canVerify & canAdmin Helpers", () => {
    it("canVerify hanya mengembalikan true untuk VERIFIKATOR dan ADMIN", () => {
      expect(canVerify(null)).toBe(false);
      expect(canVerify(relawanSession)).toBe(false);
      expect(canVerify(verifikatorSession)).toBe(true);
      expect(canVerify(adminSession)).toBe(true);
    });

    it("canAdmin hanya mengembalikan true untuk ADMIN", () => {
      expect(canAdmin(null)).toBe(false);
      expect(canAdmin(relawanSession)).toBe(false);
      expect(canAdmin(verifikatorSession)).toBe(false);
      expect(canAdmin(adminSession)).toBe(true);
    });
  });
});

