import { describe, it, expect } from "vitest";
import {
  report5W1HSchema,
  needItemSchema,
  aidItemSchema,
  verificationNoteSchema,
  createReportSchema,
} from "@/lib/validators";

describe("Domain Logic: Skema Validasi Zod (validators.ts)", () => {
  it("skema 5W+1H wajib memvalidasi seluruh 6 unsur substantif", () => {
    const validData = {
      title: "Banjir Luapan Sungai Citarum",
      type: "KEBUTUHAN",
      category: "BENCANA",
      urgency: "DARURAT",
      regionId: "region-1",
      what: "Banjir setinggi 1,5 meter merendam pemukiman warga.",
      who: "Kelompok warga RT 01-05 RW 03 terdampak genangan air.",
      whereDescription: "Titik kumpul posko aman di Masjid Jami Al-Ikhlas.",
      when: new Date().toISOString(),
      why: "Hujan deras berdurasi 6 jam menyebabkan tanggul jebol.",
      how: "Akses perahu karet dari jalan raya utama Desa Dayeuhkolot.",
    };

    const parseResult = report5W1HSchema.safeParse(validData);
    expect(parseResult.success).toBe(true);

    // Hilangkan salah satu unsur (misal: 'how')
    const invalidData = { ...validData, how: "" };
    const invalidResult = report5W1HSchema.safeParse(invalidData);
    expect(invalidResult.success).toBe(false);
  });

  it("skema kebutuhan (Need) wajib menyertakan itemCategory, unit, qty, dan kind", () => {
    const validNeed = {
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 150,
      kind: "BARANG",
    };

    const result = needItemSchema.safeParse(validNeed);
    expect(result.success).toBe(true);

    const invalidNeed = {
      itemCategory: "MAKANAN",
      unit: "", // Satuan kosong
      qty: -5,  // Kuantitas negatif
      kind: "BARANG",
    };
    const invalidResult = needItemSchema.safeParse(invalidNeed);
    expect(invalidResult.success).toBe(false);
  });

  it("skema bantuan (Aid) wajib memvalidasi kuantitas positif dan satuan", () => {
    const validAid = {
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 50,
    };
    expect(aidItemSchema.safeParse(validAid).success).toBe(true);

    const zeroAid = {
      itemCategory: "MAKANAN",
      unit: "kotak",
      qty: 0,
    };
    expect(aidItemSchema.safeParse(zeroAid).success).toBe(false);
  });

  it("skema alasan verifikasi (note) wajib memiliki panjang minimal 10 karakter", () => {
    expect(verificationNoteSchema.safeParse({ note: "Deskripsi 5W1H sudah lengkap dan valid." }).success).toBe(true);
    expect(verificationNoteSchema.safeParse({ note: "Pendek" }).success).toBe(false);
  });

  describe("createReportSchema (Aturan Komposit KEBUTUHAN vs PEMANTAUAN)", () => {
    const basePayload = {
      clientId: "client-test-1",
      title: "Laporan Gempa Susulan",
      category: "BENCANA" as const,
      urgency: "DARURAT" as const,
      regionId: "reg-1",
      latitude: -6.8,
      longitude: 107.1,
      what: "Gempa susulan berkekuatan M 4.2 menyebabkan warga mengungsi.",
      who: "85 KK warga RW 04",
      whereDescription: "Lapangan Balai Desa Cibulakan",
      when: new Date().toISOString(),
      why: "Tenda dan selimut sangat mendesak karena hujan.",
      how: "Jalur darat dapat dilalui mobil logistik.",
      hasPhotoEvidence: true,
    };

    it("tipe KEBUTUHAN wajib memiliki minimal 1 item kebutuhan", () => {
      // Tanpa item kebutuhan -> gagal
      const invalidNeeds = createReportSchema.safeParse({
        ...basePayload,
        type: "KEBUTUHAN" as const,
        needs: [],
      });
      expect(invalidNeeds.success).toBe(false);

      // Dengan item kebutuhan -> sukses
      const validNeeds = createReportSchema.safeParse({
        ...basePayload,
        type: "KEBUTUHAN" as const,
        needs: [{ itemCategory: "HUNIAN", unit: "unit", qty: 20, kind: "BARANG" as const }],
      });
      expect(validNeeds.success).toBe(true);
    });

    it("tipe PEMANTAUAN dilarang memiliki item kebutuhan logistik", () => {
      // Tanpa item kebutuhan -> sukses
      const validPantau = createReportSchema.safeParse({
        ...basePayload,
        type: "PEMANTAUAN" as const,
        needs: [],
      });
      expect(validPantau.success).toBe(true);

      // Dengan item kebutuhan -> gagal
      const invalidPantau = createReportSchema.safeParse({
        ...basePayload,
        type: "PEMANTAUAN" as const,
        needs: [{ itemCategory: "MAKANAN", unit: "paket", qty: 10, kind: "BARANG" as const }],
      });
      expect(invalidPantau.success).toBe(false);
    });
  });
});

