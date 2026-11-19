import { describe, it, expect, vi, beforeEach } from "vitest";
import { extract5W1HFromNotesAction, aiExtractionSchema } from "@/app/actions/ai-actions";

const { mockSession } = vi.hoisted(() => ({
  mockSession: {
    userId: "user-relawan-1",
    role: "RELAWAN",
    name: "Relawan Lapangan",
    isTrustedVolunteer: true,
  },
}));

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(async () => mockSession),
}));

describe("extract5W1HFromNotesAction (AI Field Helper)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus menolak permintaan jika pengguna belum terautentikasi", async () => {
    const { getSession } = await import("@/lib/session");
    vi.mocked(getSession).mockResolvedValueOnce({} as never);

    const res = await extract5W1HFromNotesAction("Banjir bandang cianjur meluap di posko darurat");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("UNAUTHORIZED");
    }
  });

  it("harus menolak jika teks catatan lapangan terlalu pendek (< 15 karakter)", async () => {
    const res = await extract5W1HFromNotesAction("Banjir bandang");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("VALIDATION_ERROR");
    }
  });

  it("harus mengekstrak catatan bertema bencana ke format 5W+1H terstruktur", async () => {
    const rawNotes = `Banjir bandang luapan sungai cianjur merendam 45 rumah warga.
Dibutuhkan segera tenda darurat 30 lembar, sembako makanan 100 paket, dan tenaga evakuasi 10 orang relawan.
Akses jalan tertutup lumpur dan jalur utama hanya bisa dilalui truk posko.`;

    const res = await extract5W1HFromNotesAction(rawNotes);
    expect(res.ok).toBe(true);
    if (res.ok) {
      const parsed = aiExtractionSchema.safeParse(res.data);
      expect(parsed.success).toBe(true);
      expect(res.data.category).toBe("BENCANA");
      expect(res.data.type).toBe("KEBUTUHAN");
      expect(res.data.what.length).toBeGreaterThanOrEqual(10);
      expect(res.data.who.length).toBeGreaterThanOrEqual(5);
      expect(res.data.whereDescription.length).toBeGreaterThanOrEqual(5);
      expect(res.data.why.length).toBeGreaterThanOrEqual(10);
      expect(res.data.how.length).toBeGreaterThanOrEqual(10);
      expect(res.data.suggestedNeeds.length).toBeGreaterThan(0);
    }
  });

  it("harus mengklasifikasikan isu lansia dan kerentanan secara tepat", async () => {
    const rawNotes = `Pendampingan rutin panti lansia kakek nenek di kecamatan cugenang membutuhkan stok popok dan obat-obatan.`;

    const res = await extract5W1HFromNotesAction(rawNotes);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.category).toBe("LANSIA");
      expect(res.data.urgency).toBe("TERENCANA");
    }
  });

  it("harus mendeteksi tipe pemantauan jika catatan hanya observasi lingkungan", async () => {
    const rawNotes = `Laporan pantauan tumpukan sampah liar dan sedimentasi limbah di bantaran sungai desa sukamaju. Status waspada lingkungan.`;

    const res = await extract5W1HFromNotesAction(rawNotes);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.type).toBe("PEMANTAUAN");
      expect(res.data.category).toBe("LINGKUNGAN");
      expect(res.data.suggestedNeeds.length).toBe(0);
    }
  });
});

