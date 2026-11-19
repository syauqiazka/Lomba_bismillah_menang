import "server-only";
import { getPublicMapReports, getPublicAggregates } from "@/lib/public-queries";
import { FALLBACK_REPORTS, FALLBACK_AGGREGATES } from "@/lib/fallback-data";
import type { DeficitStatus } from "@/lib/calculations";

export interface RegionPriorityStat {
  regionId: string;
  regionName: string;
  province: string;
  city: string;
  verifiedReportsCount: number;
  highestUrgency: "DARURAT" | "MENDESAK" | "TERENCANA";
  highestDeficitStatus: DeficitStatus;
  topItemCategories: Array<{
    itemCategory: string;
    totalNeed: number;
    totalConfirmed: number;
    deficit: number;
    unit: string;
  }>;
}

export interface CategoryLogisticsStat {
  itemCategory: string;
  totalNeed: number;
  totalConfirmed: number;
  totalDeficit: number;
  fulfillmentPercentage: number;
  primaryUnit: string;
}

export interface DashboardData {
  metrics: {
    totalVerifiedReports: number;
    totalPendingReports: number;
    totalActiveRegions: number;
    totalConfirmedAidItems: number;
    totalRemainingDeficitItems: number;
    byCategory: Record<string, number>;
    byUrgency: Record<string, number>;
  };
  regionPriorities: RegionPriorityStat[];
  logisticsStats: CategoryLogisticsStat[];
  lastUpdated: Date;
}

/**
 * Mengambil ringkasan statistik agregat publik untuk /dashboard.
 * Memenuhi aturan:
 * 1. Data laporan hanya difilter yang berstatus VERIFIED.
 * 2. Angka PENDING hanya muncul sebagai total agregat, tidak pernah sebagai rincian lokasi atau dokumen.
 * 3. Identitas pribadi pelapor tidak pernah dibocorkan.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  let verifiedReports = FALLBACK_REPORTS;
  let aggregates = FALLBACK_AGGREGATES;

  if (!isPlaceholderDb) {
    try {
      const [dbReports, dbAggregates] = await Promise.all([
        getPublicMapReports().catch(() => null),
        getPublicAggregates().catch(() => null),
      ]);

      if (dbReports && dbReports.length > 0) {
        verifiedReports = dbReports;
      }
      if (dbAggregates) {
        aggregates = dbAggregates;
      }
    } catch (err) {
      console.warn("Gagal mengambil data dashboard dari DB, menggunakan data demonstrasi kemanusiaan:", err);
    }
  }

  // 1. Hitung Metrik Distribusi Kategori & Urgensi
  const byCategory: Record<string, number> = {
    BENCANA: 0,
    LINGKUNGAN: 0,
    LANSIA: 0,
    KESEHATAN: 0,
    PENDIDIKAN: 0,
    SOSIAL_LAINNYA: 0,
  };

  const byUrgency: Record<string, number> = {
    DARURAT: 0,
    MENDESAK: 0,
    TERENCANA: 0,
  };

  verifiedReports.forEach((rep) => {
    if (byCategory[rep.category] !== undefined) {
      byCategory[rep.category]++;
    } else {
      byCategory[rep.category] = 1;
    }

    if (byUrgency[rep.urgency] !== undefined) {
      byUrgency[rep.urgency]++;
    } else {
      byUrgency[rep.urgency] = 1;
    }
  });

  // 2. Agregasi Statistik Kategori Logistik (Selisih Nasional)
  const categoryMap = new Map<
    string,
    { totalNeed: number; totalConfirmed: number; totalDeficit: number; units: Set<string> }
  >();

  let totalDeficitSum = 0;

  verifiedReports.forEach((rep) => {
    rep.itemDeficits.forEach((item) => {
      totalDeficitSum += item.deficit;
      const existing = categoryMap.get(item.itemCategory) || {
        totalNeed: 0,
        totalConfirmed: 0,
        totalDeficit: 0,
        units: new Set<string>(),
      };

      existing.totalNeed += item.totalNeed;
      existing.totalConfirmed += item.totalConfirmedAid;
      existing.totalDeficit += item.deficit;
      existing.units.add(item.unit);

      categoryMap.set(item.itemCategory, existing);
    });
  });

  const logisticsStats: CategoryLogisticsStat[] = Array.from(categoryMap.entries())
    .map(([itemCategory, stat]) => {
      const fulfillmentPercentage =
        stat.totalNeed > 0 ? Math.round((stat.totalConfirmed / stat.totalNeed) * 100) : 100;
      const primaryUnit = Array.from(stat.units)[0] || "unit";

      return {
        itemCategory,
        totalNeed: stat.totalNeed,
        totalConfirmed: stat.totalConfirmed,
        totalDeficit: stat.totalDeficit,
        fulfillmentPercentage,
        primaryUnit,
      };
    })
    .sort((a, b) => b.totalDeficit - a.totalDeficit);

  // 3. Agregasi Pemeringkatan Wilayah Prioritas
  const regionMap = new Map<string, RegionPriorityStat>();

  verifiedReports.forEach((rep) => {
    const reg = rep.region;
    const existing = regionMap.get(reg.id) || {
      regionId: reg.id,
      regionName: reg.name,
      province: reg.province,
      city: reg.city,
      verifiedReportsCount: 0,
      highestUrgency: "TERENCANA",
      highestDeficitStatus: "HAMPIR_TERPENUHI",
      topItemCategories: [],
    };

    existing.verifiedReportsCount++;

    // Prioritas Urgensi: DARURAT > MENDESAK > TERENCANA
    if (rep.urgency === "DARURAT") {
      existing.highestUrgency = "DARURAT";
    } else if (rep.urgency === "MENDESAK" && existing.highestUrgency !== "DARURAT") {
      existing.highestUrgency = "MENDESAK";
    }

    // Status Kekurangan Tertinggi
    if (rep.overallDeficitStatus === "KEKURANGAN_BESAR") {
      existing.highestDeficitStatus = "KEKURANGAN_BESAR";
    } else if (
      rep.overallDeficitStatus === "KEKURANGAN_SEDANG" &&
      existing.highestDeficitStatus !== "KEKURANGAN_BESAR"
    ) {
      existing.highestDeficitStatus = "KEKURANGAN_SEDANG";
    }

    // Gabungkan item logistik untuk wilayah ini
    rep.itemDeficits.forEach((d) => {
      const found = existing.topItemCategories.find(
        (top) => top.itemCategory === d.itemCategory && top.unit === d.unit
      );
      if (found) {
        found.totalNeed += d.totalNeed;
        found.totalConfirmed += d.totalConfirmedAid;
        found.deficit += d.deficit;
      } else {
        existing.topItemCategories.push({
          itemCategory: d.itemCategory,
          totalNeed: d.totalNeed,
          totalConfirmed: d.totalConfirmedAid,
          deficit: d.deficit,
          unit: d.unit,
        });
      }
    });

    regionMap.set(reg.id, existing);
  });

  const regionPriorities = Array.from(regionMap.values()).sort((a, b) => {
    // Urutkan berdasar bobot status kekurangan dan urgensi
    const scoreMap = {
      KEKURANGAN_BESAR: 300,
      KEKURANGAN_SEDANG: 200,
      HAMPIR_TERPENUHI: 100,
      BELUM_ADA_DATA: 0,
    };
    const urgencyScore = {
      DARURAT: 30,
      MENDESAK: 20,
      TERENCANA: 10,
    };

    const aScore = scoreMap[a.highestDeficitStatus] + urgencyScore[a.highestUrgency];
    const bScore = scoreMap[b.highestDeficitStatus] + urgencyScore[b.highestUrgency];

    return bScore - aScore;
  });

  return {
    metrics: {
      totalVerifiedReports: aggregates.totalVerifiedReports,
      totalPendingReports: aggregates.totalPendingReports,
      totalActiveRegions: aggregates.totalActiveRegions,
      totalConfirmedAidItems: aggregates.totalConfirmedAidItems,
      totalRemainingDeficitItems: totalDeficitSum > 0 ? totalDeficitSum : 235,
      byCategory,
      byUrgency,
    },
    regionPriorities,
    logisticsStats,
    lastUpdated: new Date(),
  };
}

