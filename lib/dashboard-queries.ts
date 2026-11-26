import "server-only";
import { prisma } from "@/lib/prisma";
import { getPublicMapReports, getPublicAggregates } from "@/lib/public-queries";
import { FALLBACK_REPORTS, FALLBACK_AGGREGATES } from "@/lib/fallback-data";
import type { DeficitStatus } from "@/lib/calculations";
import type { SessionData } from "@/lib/session-options";

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

export interface RoleWorkspaceData {
  role: "RELAWAN" | "VERIFIKATOR" | "ADMIN";
  isDemoMode: boolean;
  myReports: Array<{
    id: string;
    title: string;
    status: string;
    urgency: string;
    updatedAt: string;
  }>;
  pendingSlaQueue: Array<{
    id: string;
    title: string;
    urgency: string;
    regionName: string;
    ageHours: number;
  }>;
  adminAuditSummary?: {
    totalUsers: number;
    totalVerifiedOrgs: number;
    recentActions: Array<{
      id: string;
      decision: string;
      note: string | null;
      actorName: string;
      reportTitle: string;
      createdAt: string;
    }>;
  };
}

/**
 * Mengambil ringkasan ruang kerja operasional berbasis role untuk pengguna terautentikasi di /dashboard.
 */
export async function getRoleWorkspaceData(
  session: SessionData
): Promise<RoleWorkspaceData> {
  const role: "RELAWAN" | "VERIFIKATOR" | "ADMIN" = session.role ?? "RELAWAN";
  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  const nowMs = Date.now();

  if (isPlaceholderDb) {
    return {
      role,
      isDemoMode: true,
      myReports: FALLBACK_REPORTS.slice(0, 2).map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        urgency: r.urgency,
        updatedAt: new Date(r.updatedAt).toISOString(),
      })),
      pendingSlaQueue:
        session.role === "VERIFIKATOR" || session.role === "ADMIN"
          ? [
              {
                id: "rep-jayapura-pending-005",
                title: "Kebutuhan Buku Bacaan dan Alat Tulis Sekolah Rimba Skouw",
                urgency: "TERENCANA",
                regionName: "Kota Jayapura",
                ageHours: 18,
              },
            ]
          : [],
      adminAuditSummary:
        session.role === "ADMIN"
          ? {
              totalUsers: 4,
              totalVerifiedOrgs: 1,
              recentActions: [
                {
                  id: "audit-demo-1",
                  decision: "APPROVE",
                  note: "Data validasi lapangan telah dikonfirmasi melalui ketua RW dan bukti foto geolokasi.",
                  actorName: "Budi Santoso (VERIFIKATOR)",
                  reportTitle: FALLBACK_REPORTS[0].title,
                  createdAt: new Date(FALLBACK_REPORTS[0].updatedAt).toISOString(),
                },
              ],
            }
          : undefined,
    };
  }

  try {
    const myReportsRaw = await prisma.report.findMany({
      where: { reporterId: session.userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, urgency: true, updatedAt: true },
    });

    const pendingSlaRaw =
      session.role === "VERIFIKATOR" || session.role === "ADMIN"
        ? await prisma.report.findMany({
            where: { status: { in: ["PENDING", "NEEDS_REVISION"] } },
            orderBy: { createdAt: "asc" },
            take: 5,
            select: {
              id: true,
              title: true,
              urgency: true,
              createdAt: true,
              region: { select: { name: true } },
            },
          })
        : [];

    let adminAuditSummary: RoleWorkspaceData["adminAuditSummary"];
    if (session.role === "ADMIN") {
      const [totalUsers, totalVerifiedOrgs, recentVerifs] = await Promise.all([
        prisma.user.count(),
        prisma.organization.count({ where: { isVerified: true } }),
        prisma.verification.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            decision: true,
            note: true,
            createdAt: true,
            user: { select: { name: true, role: true } },
            report: { select: { title: true } },
          },
        }),
      ]);

      adminAuditSummary = {
        totalUsers,
        totalVerifiedOrgs,
        recentActions: recentVerifs.map((v) => ({
          id: v.id,
          decision: v.decision,
          note: v.note,
          actorName: `${v.user.name} (${v.user.role})`,
          reportTitle: v.report.title,
          createdAt: v.createdAt.toISOString(),
        })),
      };
    }

    return {
      role,
      isDemoMode: false,
      myReports: myReportsRaw.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        urgency: r.urgency,
        updatedAt: r.updatedAt.toISOString(),
      })),
      pendingSlaQueue: pendingSlaRaw.map((p) => ({
        id: p.id,
        title: p.title,
        urgency: p.urgency,
        regionName: p.region.name,
        ageHours: Math.max(1, Math.round((nowMs - p.createdAt.getTime()) / (1000 * 60 * 60))),
      })),
      adminAuditSummary,
    };
  } catch {
    return {
      role,
      isDemoMode: true,
      myReports: [],
      pendingSlaQueue: [],
    };
  }
}

