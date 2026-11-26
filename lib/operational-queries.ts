import "server-only";
import { prisma } from "@/lib/prisma";
import { getPublicMapReports, type PublicReportItem } from "@/lib/public-queries";
import { FALLBACK_REPORTS as DEMO_REPORTS } from "@/lib/fallback-data";

export interface OperationalPendingAidItem {
  id: string;
  reportId: string;
  reportTitle: string;
  itemCategory: string;
  unit: string;
  qty: number;
  userName: string;
  createdAt: string;
}

export interface OperationalNeedsData {
  needsReports: PublicReportItem[];
  pendingAids: OperationalPendingAidItem[];
  isDemoMode: boolean;
}

const DEMO_PENDING_AIDS: OperationalPendingAidItem[] = [
  {
    id: "aid-pending-demo-1",
    reportId: "rep-cianjur-sample",
    reportTitle: "Kebutuhan Mendesak Pengungsian Desa Cibulakan Pasca Gempa Susulan",
    itemCategory: "MAKANAN",
    unit: "paket",
    qty: 50,
    userName: "Relawan Posko Cugenang (DEMO)",
    createdAt: new Date("2026-11-19T08:00:00Z").toISOString(),
  },
];

/**
 * Mengambil data pemantauan kebutuhan (khusus tipe KEBUTUHAN) dan daftar bantuan PENDING
 * untuk halaman operasional /kebutuhan dan /distribusi.
 */
export async function getOperationalNeedsData(): Promise<OperationalNeedsData> {
  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  if (isPlaceholderDb) {
    return {
      needsReports: DEMO_REPORTS.filter((r) => r.type === "KEBUTUHAN"),
      pendingAids: DEMO_PENDING_AIDS,
      isDemoMode: true,
    };
  }

  try {
    const [allVerified, pendingAidsRaw] = await Promise.all([
      getPublicMapReports(),
      prisma.aid.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          reportId: true,
          itemCategory: true,
          unit: true,
          qty: true,
          createdAt: true,
          user: { select: { name: true } },
          report: { select: { title: true } },
        },
      }),
    ]);

    return {
      needsReports: allVerified.filter((r) => r.type === "KEBUTUHAN"),
      pendingAids: pendingAidsRaw.map((a) => ({
        id: a.id,
        reportId: a.reportId,
        reportTitle: a.report.title,
        itemCategory: a.itemCategory,
        unit: a.unit,
        qty: a.qty,
        userName: a.user.name,
        createdAt: a.createdAt.toISOString(),
      })),
      isDemoMode: false,
    };
  } catch {
    return {
      needsReports: DEMO_REPORTS.filter((r) => r.type === "KEBUTUHAN"),
      pendingAids: DEMO_PENDING_AIDS,
      isDemoMode: true,
    };
  }
}
