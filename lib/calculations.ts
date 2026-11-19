export interface NeedItem {
  itemCategory: string;
  unit: string;
  qty: number;
}

export interface ConfirmedAidItem {
  itemCategory: string;
  unit: string;
  qty: number;
}

export interface ItemDeficitResult {
  itemCategory: string;
  unit: string;
  totalNeed: number;
  totalConfirmedAid: number;
  deficit: number;
  percentageFulfilled: number;
}

export type DeficitStatus =
  | "KEKURANGAN_BESAR"
  | "KEKURANGAN_SEDANG"
  | "HAMPIR_TERPENUHI"
  | "BELUM_ADA_DATA";

/**
 * Menghitung selisih kebutuhan vs bantuan terkonfirmasi per pasangan unik (itemCategory, unit).
 * Rumus: Selisih = max(0, sum(Need.qty) - sum(Aid.qty (status CONFIRMED)))
 * Aturan keras: Satuan berbeda dilarang saling dijumlahkan.
 */
export function calculateDeficitPerItem(
  needs: NeedItem[],
  confirmedAids: ConfirmedAidItem[]
): ItemDeficitResult[] {
  // Buat map agregasi bantuan terkonfirmasi per (itemCategory, unit)
  const aidMap = new Map<string, number>();
  for (const aid of confirmedAids) {
    const key = `${aid.itemCategory.trim().toUpperCase()}:::${aid.unit.trim().toLowerCase()}`;
    const current = aidMap.get(key) || 0;
    aidMap.set(key, current + aid.qty);
  }

  // Agregasi kebutuhan per (itemCategory, unit)
  const needMap = new Map<string, { itemCategory: string; unit: string; totalNeed: number }>();
  for (const need of needs) {
    const normCategory = need.itemCategory.trim().toUpperCase();
    const normUnit = need.unit.trim().toLowerCase();
    const key = `${normCategory}:::${normUnit}`;
    const current = needMap.get(key);
    if (current) {
      current.totalNeed += need.qty;
    } else {
      needMap.set(key, { itemCategory: normCategory, unit: normUnit, totalNeed: need.qty });
    }
  }

  const results: ItemDeficitResult[] = [];

  for (const [key, needData] of needMap.entries()) {
    const aidTotal = aidMap.get(key) || 0;
    const deficit = Math.max(0, needData.totalNeed - aidTotal);
    const percentageFulfilled =
      needData.totalNeed > 0
        ? Math.min(100, Math.round((aidTotal / needData.totalNeed) * 100))
        : 100;

    results.push({
      itemCategory: needData.itemCategory,
      unit: needData.unit,
      totalNeed: needData.totalNeed,
      totalConfirmedAid: aidTotal,
      deficit,
      percentageFulfilled,
    });
  }

  return results;
}

/**
 * Menentukan status agregat tingkat kekurangan untuk pewarnaan penanda peta.
 * Ambang batas:
 * - KEKURANGAN_BESAR: Selisih > 50% (Persentase terpenuhi < 50%)
 * - KEKURANGAN_SEDANG: Selisih 10% - 50% (Persentase terpenuhi 50% - 90%)
 * - HAMPIR_TERPENUHI: Selisih < 10% (Persentase terpenuhi >= 90%)
 * - BELUM_ADA_DATA: Jika tidak ada item kebutuhan
 */
export function calculateOverallDeficitStatus(
  itemResults: ItemDeficitResult[]
): DeficitStatus {
  if (itemResults.length === 0) {
    return "BELUM_ADA_DATA";
  }

  let totalNeed = 0;
  let totalDeficit = 0;

  for (const item of itemResults) {
    totalNeed += item.totalNeed;
    totalDeficit += item.deficit;
  }

  if (totalNeed === 0) {
    return "BELUM_ADA_DATA";
  }

  const deficitRatio = totalDeficit / totalNeed;

  if (deficitRatio > 0.5) {
    return "KEKURANGAN_BESAR";
  } else if (deficitRatio >= 0.1) {
    return "KEKURANGAN_SEDANG";
  } else {
    return "HAMPIR_TERPENUHI";
  }
}

/**
 * Validasi batas atas bantuan yang sedang dicatat.
 * Jumlah bantuan yang dicatat tidak boleh melampaui sisa kebutuhan tercatat.
 */
export function validateAidLimit(params: {
  totalNeed: number;
  currentConfirmed: number;
  incomingQty: number;
}): { isValid: boolean; remainingQuota: number; error?: string } {
  const { totalNeed, currentConfirmed, incomingQty } = params;
  const remainingQuota = Math.max(0, totalNeed - currentConfirmed);

  if (incomingQty <= 0) {
    return {
      isValid: false,
      remainingQuota,
      error: "Kuantitas bantuan yang dicatat harus lebih besar dari 0.",
    };
  }

  if (incomingQty > remainingQuota) {
    return {
      isValid: false,
      remainingQuota,
      error: `Jumlah bantuan (${incomingQty}) melebihi sisa kebutuhan yang tersedia (${remainingQuota}).`,
    };
  }

  return {
    isValid: true,
    remainingQuota,
  };
}
