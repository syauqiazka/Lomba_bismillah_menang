import { describe, it, expect, vi, beforeEach } from "vitest";
import { recordAidTransaction } from "@/lib/aid-transaction";
import { Prisma } from "@prisma/client";

// Mock dependensi trust
vi.mock("@/lib/trust", () => ({
  isTrustedVolunteer: vi.fn(),
}));

import { isTrustedVolunteer } from "@/lib/trust";

describe("Domain & Database Transaction: Pencatatan Bantuan & Konkurensi (aid-transaction.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus menolak input yang tidak lengkap atau tidak valid", async () => {
    // ClientId kosong
    const res1 = await recordAidTransaction({
      clientId: "",
      reportId: "rep-1",
      userId: "user-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 10,
    });
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.code).toBe("INVALID_INPUT");
    }

    // Qty <= 0
    const res2 = await recordAidTransaction({
      clientId: "client-uuid-1",
      reportId: "rep-1",
      userId: "user-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 0,
    });
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect(res2.code).toBe("INVALID_INPUT");
    }

    // Qty desimal
    const res3 = await recordAidTransaction({
      clientId: "client-uuid-1",
      reportId: "rep-1",
      userId: "user-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 5.5,
    });
    expect(res3.success).toBe(false);
    if (!res3.success) {
      expect(res3.code).toBe("INVALID_INPUT");
    }
  });

  it("harus idempoten: mengembalikan catatan bantuan yang telah ada jika clientId sudah terdaftar", async () => {
    const existingAid = {
      id: "aid-existing-1",
      clientId: "client-uuid-100",
      reportId: "rep-1",
      userId: "user-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 20,
      status: "CONFIRMED" as const,
      rejectionNote: null,
      organizationId: null,
      submittedOfflineAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(existingAid),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-100",
        reportId: "rep-1",
        userId: "user-1",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 20,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.isDuplicate).toBe(true);
      expect(result.aid.id).toBe("aid-existing-1");
      expect(result.message).toContain("idempoten");
    }
  });

  it("harus menolak pencatatan bantuan pada laporan bertipe PEMANTAUAN", async () => {
    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      report: {
        findUnique: vi.fn().mockResolvedValue({
          id: "rep-pantau",
          type: "PEMANTAUAN",
          status: "VERIFIED",
        }),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-200",
        reportId: "rep-pantau",
        userId: "user-1",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 10,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("INVALID_REPORT_TYPE");
      expect(result.error).toContain("PEMANTAUAN");
    }
  });

  it("harus menolak pencatatan bantuan pada laporan yang belum VERIFIED", async () => {
    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      report: {
        findUnique: vi.fn().mockResolvedValue({
          id: "rep-pending",
          type: "KEBUTUHAN",
          status: "PENDING",
        }),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-300",
        reportId: "rep-pending",
        userId: "user-1",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 10,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("REPORT_NOT_VERIFIED");
    }
  });

  it("harus menolak bila kategori atau satuan tidak terdaftar pada kebutuhan laporan", async () => {
    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
      report: {
        findUnique: vi.fn().mockResolvedValue({
          id: "rep-verified",
          type: "KEBUTUHAN",
          status: "VERIFIED",
        }),
      },
      need: {
        findMany: vi.fn().mockResolvedValue([
          { itemCategory: "MAKANAN", unit: "kotak", qty: 100 },
        ]),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    // Mencoba kirim 'karung' padahal yang dibutuhkan 'kotak'
    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-400",
        reportId: "rep-verified",
        userId: "user-1",
        itemCategory: "MAKANAN",
        unit: "karung",
        qty: 10,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NEED_NOT_FOUND");
    }
  });

  it("harus menolak bila jumlah bantuan yang dicatat melebihi sisa kebutuhan riil (alokasi lebih)", async () => {
    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([
          { itemCategory: "MAKANAN", unit: "kotak", qty: 80 },
        ]),
      },
      report: {
        findUnique: vi.fn().mockResolvedValue({
          id: "rep-verified",
          type: "KEBUTUHAN",
          status: "VERIFIED",
        }),
      },
      need: {
        findMany: vi.fn().mockResolvedValue([
          { itemCategory: "MAKANAN", unit: "kotak", qty: 100 },
        ]),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    // Kebutuhan 100, sudah terkonfirmasi 80, sisa 20. Mencoba kirim 25.
    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-500",
        reportId: "rep-verified",
        userId: "user-1",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 25,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("LIMIT_EXCEEDED");
      expect(result.error).toContain("melebihi sisa kebutuhan");
    }
  });

  it("harus menetapkan status CONFIRMED langsung jika relawan terpercaya", async () => {
    (isTrustedVolunteer as any).mockResolvedValue(true);

    const createdRecord = {
      id: "aid-new-1",
      clientId: "client-uuid-600",
      reportId: "rep-verified",
      userId: "user-trusted",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 20,
      status: "CONFIRMED",
      rejectionNote: null,
      organizationId: null,
      submittedOfflineAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([
          { itemCategory: "MAKANAN", unit: "kotak", qty: 50 },
        ]),
        create: vi.fn().mockResolvedValue(createdRecord),
      },
      report: {
        findUnique: vi.fn().mockResolvedValue({
          id: "rep-verified",
          type: "KEBUTUHAN",
          status: "VERIFIED",
        }),
      },
      need: {
        findMany: vi.fn().mockResolvedValue([
          { itemCategory: "MAKANAN", unit: "kotak", qty: 100 },
        ]),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-600",
        reportId: "rep-verified",
        userId: "user-trusted",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 20,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.aid.status).toBe("CONFIRMED");
      expect(result.message).toContain("Relawan Terpercaya");
    }
  });

  it("harus menetapkan status PENDING jika relawan baru (belum terpercaya)", async () => {
    (isTrustedVolunteer as any).mockResolvedValue(false);

    const createdRecord = {
      id: "aid-new-2",
      clientId: "client-uuid-700",
      reportId: "rep-verified",
      userId: "user-new",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 10,
      status: "PENDING",
      rejectionNote: null,
      organizationId: null,
      submittedOfflineAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTx = {
      aid: {
        findUnique: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(createdRecord),
      },
      report: {
        findUnique: vi.fn().mockResolvedValue({
          id: "rep-verified",
          type: "KEBUTUHAN",
          status: "VERIFIED",
        }),
      },
      need: {
        findMany: vi.fn().mockResolvedValue([
          { itemCategory: "MAKANAN", unit: "kotak", qty: 100 },
        ]),
      },
    };

    const mockPrisma = {
      $transaction: vi.fn().mockImplementation(async (cb: (tx: any) => Promise<any>) => {
        return cb(mockTx);
      }),
    };

    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-700",
        reportId: "rep-verified",
        userId: "user-new",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 10,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.aid.status).toBe("PENDING");
      expect(result.message).toContain("Relawan Baru");
    }
  });

  it("harus menangani benturan konkurensi P2034 dengan kode CONCURRENCY_ERROR", async () => {
    const errorP2034 = new Prisma.PrismaClientKnownRequestError(
      "Transaction failed due to a write conflict or deadlock",
      {
        code: "P2034",
        clientVersion: "6.4.1",
      }
    );

    const mockPrisma = {
      $transaction: vi.fn().mockRejectedValue(errorP2034),
    };

    const result = await recordAidTransaction(
      {
        clientId: "client-uuid-800",
        reportId: "rep-1",
        userId: "user-1",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 10,
      },
      mockPrisma as any
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("CONCURRENCY_ERROR");
      expect(result.error).toContain("benturan");
    }
  });
});
