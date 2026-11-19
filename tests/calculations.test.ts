import { describe, it, expect } from "vitest";
import {
  calculateDeficitPerItem,
  calculateOverallDeficitStatus,
  validateAidLimit,
  type NeedItem,
  type ConfirmedAidItem,
} from "@/lib/calculations";

describe("Domain Logic: Kalkulasi Selisih & Satuan (calculations.ts)", () => {
  it("harus menghitung selisih secara akurat per pasangan unik (itemCategory, unit)", () => {
    const needs: NeedItem[] = [
      { itemCategory: "MAKANAN", unit: "kotak", qty: 100 },
      { itemCategory: "MAKANAN", unit: "karung", qty: 50 },
      { itemCategory: "MEDIS", unit: "paket", qty: 20 },
    ];

    const confirmedAids: ConfirmedAidItem[] = [
      { itemCategory: "MAKANAN", unit: "kotak", qty: 60 },
      { itemCategory: "MAKANAN", unit: "karung", qty: 50 },
      { itemCategory: "MEDIS", unit: "paket", qty: 5 },
    ];

    const result = calculateDeficitPerItem(needs, confirmedAids);

    expect(result).toHaveLength(3);

    const makananKotak = result.find(
      (r) => r.itemCategory === "MAKANAN" && r.unit === "kotak"
    );
    expect(makananKotak).toBeDefined();
    expect(makananKotak?.totalNeed).toBe(100);
    expect(makananKotak?.totalConfirmedAid).toBe(60);
    expect(makananKotak?.deficit).toBe(40);
    expect(makananKotak?.percentageFulfilled).toBe(60);

    const makananKarung = result.find(
      (r) => r.itemCategory === "MAKANAN" && r.unit === "karung"
    );
    expect(makananKarung).toBeDefined();
    expect(makananKarung?.totalNeed).toBe(50);
    expect(makananKarung?.totalConfirmedAid).toBe(50);
    expect(makananKarung?.deficit).toBe(0);
    expect(makananKarung?.percentageFulfilled).toBe(100);

    const medisPaket = result.find(
      (r) => r.itemCategory === "MEDIS" && r.unit === "paket"
    );
    expect(medisPaket).toBeDefined();
    expect(medisPaket?.totalNeed).toBe(20);
    expect(medisPaket?.totalConfirmedAid).toBe(5);
    expect(medisPaket?.deficit).toBe(15);
    expect(medisPaket?.percentageFulfilled).toBe(25);
  });

  it("dilarang mencampur satuan yang berbeda meskipun dalam kategori yang sama", () => {
    // 100 dus mi dan 50 karung beras tidak boleh digabung menjadi 150
    const needs: NeedItem[] = [
      { itemCategory: "MAKANAN", unit: "dus", qty: 100 },
      { itemCategory: "MAKANAN", unit: "karung", qty: 50 },
    ];

    const result = calculateDeficitPerItem(needs, []);
    expect(result).toHaveLength(2);
    expect(result.find((r) => r.unit === "dus")?.totalNeed).toBe(100);
    expect(result.find((r) => r.unit === "karung")?.totalNeed).toBe(50);
  });

  it("selisih tidak boleh menghasilkan angka negatif jika bantuan melebihi kebutuhan", () => {
    const needs: NeedItem[] = [
      { itemCategory: "HUNIAN", unit: "tenda", qty: 10 },
    ];
    const confirmedAids: ConfirmedAidItem[] = [
      { itemCategory: "HUNIAN", unit: "tenda", qty: 15 },
    ];

    const result = calculateDeficitPerItem(needs, confirmedAids);
    expect(result[0]?.deficit).toBe(0);
    expect(result[0]?.percentageFulfilled).toBe(100);
  });

  it("harus menentukan status agregat tingkat kekurangan secara benar", () => {
    // Tidak ada kebutuhan
    expect(calculateOverallDeficitStatus([])).toBe("BELUM_ADA_DATA");

    // Rata-rata selisih > 50% -> KEKURANGAN_BESAR
    const bigDeficit: NeedItem[] = [
      { itemCategory: "MAKANAN", unit: "paket", qty: 100 },
    ];
    const bigDeficitAid: ConfirmedAidItem[] = [
      { itemCategory: "MAKANAN", unit: "paket", qty: 20 },
    ]; // 20% terpenuhi, selisih 80%
    expect(calculateOverallDeficitStatus(calculateDeficitPerItem(bigDeficit, bigDeficitAid))).toBe("KEKURANGAN_BESAR");

    // Selisih 10% - 50% -> KEKURANGAN_SEDANG
    const mediumDeficitAid: ConfirmedAidItem[] = [
      { itemCategory: "MAKANAN", unit: "paket", qty: 70 },
    ]; // 70% terpenuhi, selisih 30%
    expect(calculateOverallDeficitStatus(calculateDeficitPerItem(bigDeficit, mediumDeficitAid))).toBe("KEKURANGAN_SEDANG");

    // Selisih < 10% -> HAMPIR_TERPENUHI
    const almostFullAid: ConfirmedAidItem[] = [
      { itemCategory: "MAKANAN", unit: "paket", qty: 95 },
    ]; // 95% terpenuhi, selisih 5%
    expect(calculateOverallDeficitStatus(calculateDeficitPerItem(bigDeficit, almostFullAid))).toBe("HAMPIR_TERPENUHI");
  });

  it("harus memvalidasi batas atas bantuan yang sedang dicatat", () => {
    const totalNeed = 100;
    const currentConfirmed = 70;

    // Tambah 25 -> total 95 <= 100 -> valid
    const validCheck = validateAidLimit({
      totalNeed,
      currentConfirmed,
      incomingQty: 25,
    });
    expect(validCheck.isValid).toBe(true);
    expect(validCheck.remainingQuota).toBe(30);

    // Tambah 35 -> total 105 > 100 -> tidak valid
    const invalidCheck = validateAidLimit({
      totalNeed,
      currentConfirmed,
      incomingQty: 35,
    });
    expect(invalidCheck.isValid).toBe(false);
    expect(invalidCheck.remainingQuota).toBe(30);
    expect(invalidCheck.error).toContain("melebihi");
  });
});

