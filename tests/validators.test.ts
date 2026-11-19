import { describe, it, expect } from "vitest";
import {
  report5W1HSchema,
  needItemSchema,
  aidItemSchema,
  verificationNoteSchema,
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
});

