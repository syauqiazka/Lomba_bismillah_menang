import { describe, it, expect, vi, beforeEach } from "vitest";
import { authenticateUser, registerVolunteer } from "@/lib/auth";
import bcrypt from "bcrypt";

describe("Authentication & Credential Management (auth.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authenticateUser (Login)", () => {
    it("harus menolak format email yang tidak valid", async () => {
      const res = await authenticateUser({
        email: "bukan-email",
        password: "Password123!",
      });

      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toBe("Data login tidak valid.");
        expect(res.fieldErrors?.email).toBeDefined();
      }
    });

    it("harus mengembalikan pesan kesalahan generik jika email tidak ditemukan", async () => {
      const mockPrisma = {
        user: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      };

      const res = await authenticateUser(
        {
          email: "tidak-ada@trasec.id",
          password: "Password123!",
        },
        mockPrisma as any
      );

      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toBe("Email atau kata sandi tidak cocok.");
      }
    });

    it("harus mengembalikan pesan kesalahan generik jika kata sandi salah", async () => {
      const hashedPassword = await bcrypt.hash("PasswordBenar123!", 10);
      const mockPrisma = {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: "user-1",
            name: "Dewi",
            email: "dewi@trasec.id",
            role: "RELAWAN",
            password: hashedPassword,
            isVerifiedVolunteer: true,
          }),
        },
      };

      const res = await authenticateUser(
        {
          email: "dewi@trasec.id",
          password: "PasswordSalah999!",
        },
        mockPrisma as any
      );

      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toBe("Email atau kata sandi tidak cocok.");
      }
    });

    it("harus berhasil otentikasi saat email dan kata sandi cocok", async () => {
      const hashedPassword = await bcrypt.hash("PasswordBenar123!", 10);
      const mockPrisma = {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: "user-1",
            name: "Dewi",
            email: "dewi@trasec.id",
            role: "RELAWAN",
            password: hashedPassword,
            isVerifiedVolunteer: true,
          }),
        },
      };

      const res = await authenticateUser(
        {
          email: "dewi@trasec.id",
          password: "PasswordBenar123!",
        },
        mockPrisma as any
      );

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.user.userId).toBe("user-1");
        expect(res.user.email).toBe("dewi@trasec.id");
        expect(res.user.role).toBe("RELAWAN");
      }
    });
  });

  describe("registerVolunteer (Registrasi Akun Baru)", () => {
    it("harus menolak kata sandi yang lemah (tanpa huruf besar atau angka)", async () => {
      const res = await registerVolunteer({
        name: "Ahmad Rizki",
        email: "ahmad@trasec.id",
        password: "lemahsekali",
      });

      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.fieldErrors?.password).toBeDefined();
      }
    });

    it("harus menolak jika email sudah terdaftar sebelumnya", async () => {
      const mockPrisma = {
        user: {
          findUnique: vi.fn().mockResolvedValue({ id: "user-existing" }),
        },
      };

      const res = await registerVolunteer(
        {
          name: "Ahmad Rizki",
          email: "sudahada@trasec.id",
          password: "PasswordKuat123!",
        },
        mockPrisma as any
      );

      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toContain("sudah terdaftar");
      }
    });

    it("harus berhasil membuat relawan baru dengan role RELAWAN dan belum terverifikasi", async () => {
      const createdUser = {
        id: "user-new-123",
        name: "Ahmad Rizki",
        email: "ahmad@trasec.id",
        role: "RELAWAN" as const,
        isVerifiedVolunteer: false,
      };

      const mockPrisma = {
        user: {
          findUnique: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue(createdUser),
        },
      };

      const res = await registerVolunteer(
        {
          name: "Ahmad Rizki",
          email: "ahmad@trasec.id",
          phone: "081234567890",
          password: "PasswordKuat123!",
        },
        mockPrisma as any
      );

      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.user.userId).toBe("user-new-123");
        expect(res.user.role).toBe("RELAWAN");
        expect(res.user.isVerifiedVolunteer).toBe(false);
      }
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });
});

