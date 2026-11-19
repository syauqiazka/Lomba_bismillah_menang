import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { reviewReportAction, reviewAidAction } from "@/app/actions/verification-actions";
import * as sessionModule from "@/lib/session";
import { prisma } from "@/lib/prisma";

describe("Server Actions: Antrean Verifikasi (verification-actions.ts)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Otorisasi & Hak Akses", () => {
    it("menolak akses jika pengguna belum login", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue(null as any);

      const result = await reviewReportAction({
        reportId: "rep-123",
        decision: "APPROVE",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("Akses ditolak");
      }
    });

    it("menolak akses jika peran pengguna adalah RELAWAN", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-relawan",
        name: "Relawan Biasa",
        email: "relawan@trasec.id",
        role: "RELAWAN",
        isVerifiedVolunteer: true,
      } as any);

      const result = await reviewReportAction({
        reportId: "rep-123",
        decision: "APPROVE",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("Akses ditolak");
      }
    });
  });

  describe("reviewReportAction (Tinjauan Laporan)", () => {
    it("menolak jika verifikator berusaha memverifikasi laporannya sendiri", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-relawan-baru", // Pembuat laporan di fallback data
        name: "Ahmad Rizki",
        email: "ahmad.relawan@trasec.id",
        role: "VERIFIKATOR",
        isVerifiedVolunteer: true,
      } as any);

      const result = await reviewReportAction({
        reportId: "rep-jayapura-pending-005",
        decision: "APPROVE",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("tidak boleh memverifikasi laporannya sendiri");
      }
    });

    it("menolak jika keputusan REJECT tidak disertai alasan minimal 10 karakter", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif-1",
        name: "Verifikator Budi",
        email: "verifikator@trasec.id",
        role: "VERIFIKATOR",
        isVerifiedVolunteer: true,
      } as any);

      const result = await reviewReportAction({
        reportId: "rep-jayapura-pending-005",
        decision: "REJECT",
        note: "Pendek",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("minimal 10 karakter");
      }
    });

    it("menyetujui laporan tingkat COMMUNITY secara bertahap (1 persetujuan -> 2 persetujuan)", async () => {
      // Sesi Verifikator Komunitas 1
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif-1",
        name: "Verifikator Komunitas 1",
        email: "budi@trasec.id",
        role: "VERIFIKATOR",
        isVerifiedVolunteer: true,
      } as any);

      // Verifikasi laporan baru (count 0 -> 1)
      const res1 = await reviewReportAction({
        reportId: "rep-jayapura-pending-005",
        decision: "APPROVE",
      });

      expect(res1.ok).toBe(true);
      if (res1.ok) {
        expect(res1.data.result.nextStatus).toBe("PENDING");
        expect(res1.data.result.verificationCount).toBe(1);
      }

      // Verifikasi laporan yang sudah memiliki 1 persetujuan (count 1 -> 2 -> VERIFIED COMMUNITY)
      const res2 = await reviewReportAction({
        reportId: "rep-cianjur-pending-community",
        decision: "APPROVE",
      });

      expect(res2.ok).toBe(true);
      if (res2.ok) {
        expect(res2.data.result.nextStatus).toBe("VERIFIED");
        expect(res2.data.result.verificationLevel).toBe("COMMUNITY");
        expect(res2.data.result.verificationCount).toBe(2);
      }
    });

    it("menyetujui laporan tingkat OFFICIAL langsung memvalidasi laporan menjadi VERIFIED", async () => {
      // Sesi Verifikator dari Lembaga Resmi (PMI)
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif-pmi",
        name: "Siti Rahma (PMI)",
        email: "pmi.verifikator@trasec.id",
        role: "VERIFIKATOR",
        isVerifiedVolunteer: true,
      } as any);

      const res = await reviewReportAction({
        reportId: "rep-jayapura-pending-005",
        decision: "APPROVE",
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.result.nextStatus).toBe("VERIFIED");
        expect(res.data.result.verificationLevel).toBe("OFFICIAL");
      }
    });

    it("mengirim permintaan revisi (NEEDS_REVISION) jika revisi belum melampaui batas", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif-1",
        name: "Verifikator Budi",
        email: "budi@trasec.id",
        role: "VERIFIKATOR",
        isVerifiedVolunteer: true,
      } as any);

      const res = await reviewReportAction({
        reportId: "rep-jayapura-pending-005",
        decision: "REJECT",
        note: "Mohon lampirkan estimasi jumlah siswa dan kondisi ruang kelas darurat.",
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.result.nextStatus).toBe("NEEDS_REVISION");
        expect(res.data.result.note).toContain("Mohon lampirkan estimasi");
      }
    });
  });

  describe("reviewAidAction (Tinjauan Bantuan Relawan)", () => {
    it("menolak jika role bukan verifikator/admin", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-relawan",
        name: "Relawan",
        email: "relawan@trasec.id",
        role: "RELAWAN",
      } as any);

      const result = await reviewAidAction({
        aidId: "aid-123",
        decision: "CONFIRM",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("Akses ditolak");
      }
    });

    it("mengonfirmasi catatan bantuan oleh verifikator", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif-1",
        name: "Verifikator Budi",
        email: "budi@trasec.id",
        role: "VERIFIKATOR",
      } as any);

      const result = await reviewAidAction({
        aidId: "aid-pending-jyp-1",
        decision: "CONFIRM",
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.nextStatus).toBe("CONFIRMED");
      }
    });

    it("menolak catatan bantuan dengan catatan alasan wajib", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif-1",
        name: "Verifikator Budi",
        email: "budi@trasec.id",
        role: "VERIFIKATOR",
      } as any);

      // Gagal jika catatan kurang dari 10 karakter
      const shortResult = await reviewAidAction({
        aidId: "aid-pending-jyp-1",
        decision: "REJECT",
        note: "Ditolak",
      });
      expect(shortResult.ok).toBe(false);

      // Sukses jika catatan substantif
      const validResult = await reviewAidAction({
        aidId: "aid-pending-jyp-1",
        decision: "REJECT",
        note: "Penyaluran ini dibatalkan karena donatur menyalurkan mandiri ke posko lain.",
      });
      expect(validResult.ok).toBe(true);
      if (validResult.ok) {
        expect(validResult.data.nextStatus).toBe("REJECTED");
      }
    });
  });

  describe("Eksekusi Mutasi Database Riil (Mock Prisma)", () => {
    it("menjalankan mutasi transaksi Prisma saat database aktif", async () => {
      const originalDb = process.env.DATABASE_URL;
      process.env.DATABASE_URL = "postgresql://postgres:secret@production-db:5432/trasec";

      try {
        vi.spyOn(sessionModule, "getSession").mockResolvedValue({
          userId: "usr-verif-live",
          name: "Verifikator Live",
          email: "live@trasec.id",
          role: "VERIFIKATOR",
        } as any);

        const mockReport = {
          id: "rep-live-1",
          status: "PENDING",
          revisionCount: 0,
          verificationCount: 0,
          reporterId: "usr-other-reporter",
          verifications: [],
        };

        vi.spyOn(prisma.report, "findUnique").mockResolvedValue(mockReport as any);
        vi.spyOn(prisma.organizationMember, "findFirst").mockResolvedValue(null as any);

        const mockTx = {
          verification: { create: vi.fn().mockResolvedValue({ id: "verif-created" }) },
          report: { update: vi.fn().mockResolvedValue({ id: "rep-live-1" }) },
        };

        vi.spyOn(prisma, "$transaction").mockImplementation(async (callback: any) => {
          return callback(mockTx);
        });

        const res = await reviewReportAction({
          reportId: "rep-live-1",
          decision: "APPROVE",
          note: "Laporan terverifikasi akurat oleh koordinator lapangan.",
        });

        expect(res.ok).toBe(true);
        expect(mockTx.verification.create).toHaveBeenCalled();
        expect(mockTx.report.update).toHaveBeenCalled();
      } finally {
        process.env.DATABASE_URL = originalDb;
      }
    });
  });
});
