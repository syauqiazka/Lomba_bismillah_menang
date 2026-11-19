import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { updateUserRoleAction, verifyOrganizationAction } from "@/app/actions/admin-actions";
import * as sessionModule from "@/lib/session";

describe("Admin Actions (/admin)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Otorisasi Peran ADMIN", () => {
    it("menolak pengubahan peran jika pengguna bukan ADMIN", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-relawan",
        name: "Relawan",
        email: "relawan@trasec.id",
        role: "RELAWAN",
      } as any);

      const res = await updateUserRoleAction({
        userId: "usr-target",
        role: "VERIFIKATOR",
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe("FORBIDDEN");
        expect(res.message).toContain("Hanya ADMIN");
      }
    });

    it("menolak verifikasi lembaga jika pengguna adalah VERIFIKATOR biasa", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-verif",
        name: "Verifikator",
        email: "verifikator@trasec.id",
        role: "VERIFIKATOR",
      } as any);

      const res = await verifyOrganizationAction({
        organizationId: "org-1",
        isVerified: true,
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Operasi Administrator yang Sah", () => {
    it("mengizinkan ADMIN memperbarui peran pengguna", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-admin-1",
        name: "Admin Utama",
        email: "admin@trasec.id",
        role: "ADMIN",
      } as any);

      const res = await updateUserRoleAction({
        userId: "usr-relawan-1",
        role: "VERIFIKATOR",
        isVerifiedVolunteer: true,
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.message).toContain("berhasil");
      }
    });

    it("mengizinkan ADMIN memverifikasi lembaga resmi", async () => {
      vi.spyOn(sessionModule, "getSession").mockResolvedValue({
        userId: "usr-admin-1",
        name: "Admin Utama",
        email: "admin@trasec.id",
        role: "ADMIN",
      } as any);

      const res = await verifyOrganizationAction({
        organizationId: "org-pmi",
        isVerified: true,
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.message).toContain("Lembaga berhasil diverifikasi");
      }
    });
  });
});

