import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock session
vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    report: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock trust helper
vi.mock("@/lib/trust", () => ({
  isTrustedVolunteer: vi.fn(),
}));

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { isTrustedVolunteer } from "@/lib/trust";
import { createReportAction } from "@/app/actions/report-actions";

describe("Server Action: Pengajuan Laporan 5W+1H (report-actions.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    clientId: "uuid-rep-101",
    title: "Kebutuhan Tenda Pengungsian Longsor",
    type: "KEBUTUHAN" as const,
    category: "BENCANA" as const,
    urgency: "DARURAT" as const,
    regionId: "reg-cianjur",
    latitude: -6.82,
    longitude: 107.13,
    what: "Longsor menutup akses utama dan merusak 20 rumah warga.",
    who: "40 KK warga Kampung Nagrak",
    whereDescription: "Lapangan samping mushola Kampung Nagrak",
    when: new Date().toISOString(),
    why: "Warga kedinginan dan membutuhkan tenda serta selimut tebal.",
    how: "Dapat dilalui kendaraan roda dua dan mobil pickup.",
    hasPhotoEvidence: true,
    needs: [
      {
        itemCategory: "HUNIAN",
        unit: "unit",
        qty: 25,
        kind: "BARANG" as const,
      },
    ],
  };

  it("harus menolak pengguna anonim (tanpa sesi) dengan UNAUTHORIZED", async () => {
    (getSession as any).mockResolvedValue(null);

    const res = await createReportAction(validPayload);

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("UNAUTHORIZED");
      expect(res.message).toContain("wajib masuk");
    }
  });

  it("harus menolak jika judul laporan kurang dari 5 karakter (VALIDATION_ERROR)", async () => {
    (getSession as any).mockResolvedValue({
      userId: "user-1",
      name: "Dewi",
      email: "dewi@trasec.id",
      role: "RELAWAN",
    });

    const res = await createReportAction({
      ...validPayload,
      title: "Gmp", // < 5 chars
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("VALIDATION_ERROR");
      expect(res.fieldErrors?.title).toBeDefined();
    }
  });

  it("harus menolak jika tipe KEBUTUHAN tidak memiliki item logistik", async () => {
    (getSession as any).mockResolvedValue({
      userId: "user-1",
      name: "Dewi",
      email: "dewi@trasec.id",
      role: "RELAWAN",
    });

    const res = await createReportAction({
      ...validPayload,
      needs: [], // Empty needs on KEBUTUHAN type
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("VALIDATION_ERROR");
      expect(res.fieldErrors?.needs).toBeDefined();
    }
  });

  it("harus berhasil mengajukan laporan dalam mode mock/demonstrasi saat database berupa sample", async () => {
    (getSession as any).mockResolvedValue({
      userId: "user-1",
      name: "Dewi",
      email: "dewi@trasec.id",
      role: "RELAWAN",
    });

    const res = await createReportAction(validPayload);

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.id).toBeDefined();
      expect(res.data.message).toContain("berhasil");
    }
  });

  it("harus mengeksekusi transaksi prisma saat terhubung ke basis data langsung", async () => {
    (getSession as any).mockResolvedValue({
      userId: "user-1",
      name: "Dewi",
      email: "dewi@trasec.id",
      role: "RELAWAN",
    });

    (prisma.report.findUnique as any).mockResolvedValue(null);
    (isTrustedVolunteer as any).mockResolvedValue(true);
    (prisma.user.findUnique as any).mockResolvedValue({ phone: "08123456789" });
    (prisma.report.count as any).mockResolvedValue(2);

    const mockCreated = { id: "rep-db-1" };
    const mockTx = {
      report: {
        create: vi.fn().mockResolvedValue(mockCreated),
      },
    };
    (prisma.$transaction as any).mockImplementation(async (cb: (tx: any) => Promise<any>) => {
      return cb(mockTx);
    });

    const origDb = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "postgresql://user:pass@ep-live.neon.tech/neondb";

    try {
      const res = await createReportAction(validPayload);
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.data.id).toBe("rep-db-1");
      }
      expect(prisma.$transaction).toHaveBeenCalled();
    } finally {
      process.env.DATABASE_URL = origDb;
    }
  });
});
