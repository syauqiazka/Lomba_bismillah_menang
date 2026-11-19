import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock iron-session
const { mockSession } = vi.hoisted(() => {
  return {
    mockSession: {
      userId: undefined as string | undefined,
      name: undefined as string | undefined,
      email: undefined as string | undefined,
      role: undefined as string | undefined,
      isVerifiedVolunteer: false,
      save: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock("@/lib/session", () => ({
  getSession: vi.fn().mockResolvedValue(mockSession),
  destroySession: vi.fn().mockResolvedValue(undefined),
}));

import { loginAction, registerAction, logoutAction } from "@/app/actions/auth-actions";

describe("Server Actions: Autentikasi & Sesi (auth-actions.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loginAction", () => {
    it("menolak jika format email tidak valid", async () => {
      const res = await loginAction({
        email: "salah-format",
        password: "Password123!",
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe("VALIDATION_ERROR");
        expect(res.message).toContain("email");
      }
    });

    it("menolak kredensial yang tidak cocok dengan pesan netral", async () => {
      const res = await loginAction({
        email: "unknown@trasec.id",
        password: "SalahPassword123!",
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe("UNAUTHORIZED");
        expect(res.message).toBe("Email atau kata sandi tidak cocok.");
      }
    });

    it("berhasil masuk dengan akun demo Admin", async () => {
      const res = await loginAction({
        email: "admin@trasec.id",
        password: "AdminTrasec2026!",
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.user.role).toBe("ADMIN");
        expect(res.data.user.email).toBe("admin@trasec.id");
        expect(mockSession.save).toHaveBeenCalled();
      }
    });

    it("berhasil masuk dengan akun demo Verifikator Komunitas", async () => {
      const res = await loginAction({
        email: "verifikator.komunitas@trasec.id",
        password: "Verifikator2026!",
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.user.role).toBe("VERIFIKATOR");
      }
    });
  });

  describe("registerAction", () => {
    it("menolak pendaftaran jika kata sandi tidak memenuhi kompleksitas", async () => {
      const res = await registerAction({
        name: "Relawan Baru",
        email: "relawan.baru@trasec.id",
        password: "hanyahurufkecil",
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe("VALIDATION_ERROR");
      }
    });

    it("berhasil mendaftarkan relawan baru dengan peran RELAWAN", async () => {
      const res = await registerAction({
        name: "Budi Pratama",
        email: "budi.pratama@gmail.com",
        phone: "081234567890",
        password: "PasswordKuat2026!",
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.user.name).toBe("Budi Pratama");
        expect(res.data.user.role).toBe("RELAWAN");
        expect(res.data.user.isVerifiedVolunteer).toBe(false);
      }
    });
  });

  describe("logoutAction", () => {
    it("mengakhiri sesi pengguna", async () => {
      const res = await logoutAction();
      expect(res.ok).toBe(true);
    });
  });
});
