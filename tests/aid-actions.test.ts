import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock session
vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

// Mock recordAidTransaction
vi.mock("@/lib/aid-transaction", () => ({
  recordAidTransaction: vi.fn(),
}));

import { getSession } from "@/lib/session";
import { recordAidTransaction } from "@/lib/aid-transaction";
import { submitAidAction } from "@/app/actions/aid-actions";

describe("Server Action: Penyaluran Bantuan (aid-actions.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus menolak pengguna yang belum terautentikasi dengan UNAUTHORIZED", async () => {
    (getSession as any).mockResolvedValue(null);

    const res = await submitAidAction({
      reportId: "rep-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 10,
      clientId: "client-aid-1",
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("UNAUTHORIZED");
      expect(res.message).toContain("wajib masuk");
    }
  });

  it("harus mengembalikan VALIDATION_ERROR jika kuantitas bantuan melebihi kuota", async () => {
    (getSession as any).mockResolvedValue({
      userId: "user-relawan-1",
      name: "Dewi",
      email: "dewi@trasec.id",
      role: "RELAWAN",
    });

    (recordAidTransaction as any).mockResolvedValue({
      success: false,
      code: "LIMIT_EXCEEDED",
      error: "Jumlah bantuan melebihi sisa kebutuhan.",
    });

    const res = await submitAidAction({
      reportId: "rep-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 9999,
      clientId: "client-aid-2",
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("VALIDATION_ERROR");
      expect(res.message).toContain("melebihi");
    }
  });

  it("harus berhasil mencatat bantuan saat data dan kuota valid", async () => {
    (getSession as any).mockResolvedValue({
      userId: "user-relawan-1",
      name: "Dewi",
      email: "dewi@trasec.id",
      role: "RELAWAN",
    });

    (recordAidTransaction as any).mockResolvedValue({
      success: true,
      aid: {
        id: "aid-123",
        status: "CONFIRMED",
      },
      isDuplicate: false,
      message: "Bantuan berhasil dicatat dan terkonfirmasi.",
    });

    const res = await submitAidAction({
      reportId: "rep-1",
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 25,
      clientId: "client-aid-3",
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.id).toBe("aid-123");
      expect(res.data.status).toBe("CONFIRMED");
      expect(res.data.message).toContain("berhasil");
    }
  });
});
