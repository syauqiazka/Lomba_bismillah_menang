import "server-only";
import { prisma } from "@/lib/prisma";
import { assertEntityAccessOr404, EntityNotFoundError } from "@/lib/access";
import type { SessionData } from "@/lib/session-options";
import {
  calculateDeficitPerItem,
  calculateOverallDeficitStatus,
  type ItemDeficitResult,
  type DeficitStatus,
} from "@/lib/calculations";

export interface PublicReportItem {
  id: string;
  clientId: string;
  title: string;
  type: "KEBUTUHAN" | "PEMANTAUAN";
  category: string;
  urgency: string;
  status: "VERIFIED";
  verificationLevel: "COMMUNITY" | "OFFICIAL" | null;
  trustScore: number;
  trustScoreReasons: string[] | null;
  latitude: number;
  longitude: number;
  isLocationBlurred: boolean;
  region: {
    id: string;
    name: string;
    province: string;
    city: string;
  };
  what: string;
  who: string;
  whereDescription: string;
  when: Date;
  why: string;
  how: string;
  isStale: boolean;
  createdAt: Date;
  updatedAt: Date;
  itemDeficits: ItemDeficitResult[];
  overallDeficitStatus: DeficitStatus | null;
  needsCount: number;
  confirmedAidsCount: number;
}

export interface PublicReportDetail extends PublicReportItem {
  verifications: {
    id: string;
    decision: string;
    note: string | null;
    createdAt: Date;
    verifierName: string;
  }[];
  coordinatorContact?: {
    name: string;
    phone: string | null;
  } | null;
  rawNeeds: {
    id: string;
    itemCategory: string;
    unit: string;
    qty: number;
    kind: "BARANG" | "TENAGA";
  }[];
}

export interface PublicAggregates {
  totalVerifiedReports: number;
  totalPendingReports: number;
  totalActiveRegions: number;
  totalConfirmedAidItems: number;
}

const STALE_THRESHOLD_DAYS = 7;
const SENSITIVE_CATEGORIES = new Set(["LANSIA", "KESEHATAN"]);

/**
 * Membulatkan koordinat GPS maksimal ke 2 angka desimal (~1,1 km radius pengaburan)
 * untuk melindungi privasi keluarga dan penerima manfaat kategori rentan.
 */
function blurCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Mengecek apakah laporan sudah basi (tidak ada pembaruan > 7 hari).
 */
function checkIsStale(updatedAt: Date, latestAidDate?: Date): boolean {
  const latestActivity = latestAidDate && latestAidDate > updatedAt ? latestAidDate : updatedAt;
  const daysDiff = (Date.now() - latestActivity.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff > STALE_THRESHOLD_DAYS;
}

/**
 * Parsing aman untuk alasan skor kepercayaan yang disimpan dalam format JSON string.
 */
function parseTrustScoreReasons(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Mengambil daftar seluruh laporan berstatus VERIFIED untuk peta operasional publik.
 * Mematuhi aturan keamanan: filter VERIFIED di server, pengaburan koordinat sensitif,
 * dan tanpa mengekspos data pribadi pelapor.
 */
export async function getPublicMapReports(regionId?: string): Promise<PublicReportItem[]> {
  const reports = await prisma.report.findMany({
    where: {
      status: "VERIFIED",
      ...(regionId ? { regionId } : {}),
    },
    select: {
      id: true,
      clientId: true,
      title: true,
      type: true,
      category: true,
      urgency: true,
      status: true,
      verificationLevel: true,
      trustScore: true,
      trustScoreReasons: true,
      latitude: true,
      longitude: true,
      what: true,
      who: true,
      whereDescription: true,
      when: true,
      why: true,
      how: true,
      createdAt: true,
      updatedAt: true,
      region: {
        select: {
          id: true,
          name: true,
          province: true,
          city: true,
        },
      },
      needs: {
        select: {
          itemCategory: true,
          unit: true,
          qty: true,
        },
      },
      aids: {
        select: {
          itemCategory: true,
          unit: true,
          qty: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reports.map((rep) => {
    const isSensitive = SENSITIVE_CATEGORIES.has(rep.category);
    const confirmedAids = rep.aids.filter((a) => a.status === "CONFIRMED");

    // Tanggal bantuan terkonfirmasi terakhir untuk penentuan data basi
    const latestAid = confirmedAids.reduce<Date | undefined>((latest, a) => {
      return !latest || a.createdAt > latest ? a.createdAt : latest;
    }, undefined);

    const isStale = checkIsStale(rep.updatedAt, latestAid);

    // Kalkulasi selisih hanya untuk tipe KEBUTUHAN
    let itemDeficits: ItemDeficitResult[] = [];
    let overallDeficitStatus: DeficitStatus | null = null;

    if (rep.type === "KEBUTUHAN") {
      itemDeficits = calculateDeficitPerItem(rep.needs, confirmedAids);
      overallDeficitStatus = calculateOverallDeficitStatus(itemDeficits);
    }

    return {
      id: rep.id,
      clientId: rep.clientId,
      title: rep.title,
      type: rep.type,
      category: rep.category,
      urgency: rep.urgency,
      status: "VERIFIED",
      verificationLevel: rep.verificationLevel,
      trustScore: rep.trustScore,
      trustScoreReasons: parseTrustScoreReasons(rep.trustScoreReasons),
      latitude: isSensitive ? blurCoordinate(rep.latitude) : rep.latitude,
      longitude: isSensitive ? blurCoordinate(rep.longitude) : rep.longitude,
      isLocationBlurred: isSensitive,
      region: rep.region,
      what: rep.what,
      who: rep.who,
      whereDescription: isSensitive
        ? "Lokasi presisi disamarkan untuk privasi penerima manfaat."
        : rep.whereDescription,
      when: rep.when,
      why: rep.why,
      how: rep.how,
      isStale,
      createdAt: rep.createdAt,
      updatedAt: rep.updatedAt,
      itemDeficits,
      overallDeficitStatus,
      needsCount: rep.needs.length,
      confirmedAidsCount: confirmedAids.length,
    };
  });
}

/**
 * Mengambil detail tunggal laporan publik berdasarkan ID.
 * Mengembalikan null jika laporan tidak ditemukan atau belum berstatus VERIFIED.
 */
export async function getPublicReportById(id: string): Promise<PublicReportItem | null> {
  const rep = await prisma.report.findFirst({
    where: {
      id,
      status: "VERIFIED",
    },
    select: {
      id: true,
      clientId: true,
      title: true,
      type: true,
      category: true,
      urgency: true,
      status: true,
      verificationLevel: true,
      trustScore: true,
      trustScoreReasons: true,
      latitude: true,
      longitude: true,
      what: true,
      who: true,
      whereDescription: true,
      when: true,
      why: true,
      how: true,
      createdAt: true,
      updatedAt: true,
      region: {
        select: {
          id: true,
          name: true,
          province: true,
          city: true,
        },
      },
      needs: {
        select: {
          itemCategory: true,
          unit: true,
          qty: true,
        },
      },
      aids: {
        select: {
          itemCategory: true,
          unit: true,
          qty: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!rep) {
    return null;
  }

  const isSensitive = SENSITIVE_CATEGORIES.has(rep.category);
  const confirmedAids = rep.aids.filter((a) => a.status === "CONFIRMED");

  const latestAid = confirmedAids.reduce<Date | undefined>((latest, a) => {
    return !latest || a.createdAt > latest ? a.createdAt : latest;
  }, undefined);

  const isStale = checkIsStale(rep.updatedAt, latestAid);

  let itemDeficits: ItemDeficitResult[] = [];
  let overallDeficitStatus: DeficitStatus | null = null;

  if (rep.type === "KEBUTUHAN") {
    itemDeficits = calculateDeficitPerItem(rep.needs, confirmedAids);
    overallDeficitStatus = calculateOverallDeficitStatus(itemDeficits);
  }

  return {
    id: rep.id,
    clientId: rep.clientId,
    title: rep.title,
    type: rep.type,
    category: rep.category,
    urgency: rep.urgency,
    status: "VERIFIED",
    verificationLevel: rep.verificationLevel,
    trustScore: rep.trustScore,
    trustScoreReasons: parseTrustScoreReasons(rep.trustScoreReasons),
    latitude: isSensitive ? blurCoordinate(rep.latitude) : rep.latitude,
    longitude: isSensitive ? blurCoordinate(rep.longitude) : rep.longitude,
    isLocationBlurred: isSensitive,
    region: rep.region,
    what: rep.what,
    who: rep.who,
    whereDescription: isSensitive
      ? "Lokasi presisi disamarkan untuk privasi penerima manfaat."
      : rep.whereDescription,
    when: rep.when,
    why: rep.why,
    how: rep.how,
    isStale,
    createdAt: rep.createdAt,
    updatedAt: rep.updatedAt,
    itemDeficits,
    overallDeficitStatus,
    needsCount: rep.needs.length,
    confirmedAidsCount: confirmedAids.length,
  };
}

/**
 * Mengambil detail lengkap laporan kemanusiaan termasuk riwayat verifikasi,
 * daftar kebutuhan mentah, dan kontak koordinator (hanya jika pengguna login).
 * Memvalidasi hak akses dan proteksi IDOR: jika tidak sah, mengembalikan null (404).
 */
export async function getPublicReportDetail(
  id: string,
  userSession?: SessionData | null
): Promise<PublicReportDetail | null> {
  try {
    const rep = await prisma.report.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        title: true,
        type: true,
        category: true,
        urgency: true,
        status: true,
        verificationLevel: true,
        trustScore: true,
        trustScoreReasons: true,
        latitude: true,
        longitude: true,
        what: true,
        who: true,
        whereDescription: true,
        when: true,
        why: true,
        how: true,
        createdAt: true,
        updatedAt: true,
        reporterId: true,
        reporter: {
          select: {
            name: true,
            phone: true,
          },
        },
        region: {
          select: {
            id: true,
            name: true,
            province: true,
            city: true,
          },
        },
        needs: {
          select: {
            id: true,
            itemCategory: true,
            unit: true,
            qty: true,
            kind: true,
          },
        },
        aids: {
          select: {
            itemCategory: true,
            unit: true,
            qty: true,
            status: true,
            createdAt: true,
          },
        },
        verifications: {
          select: {
            id: true,
            decision: true,
            note: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!rep) {
      return null;
    }

    // Proteksi IDOR: pastikan hak akses entitas terpenuhi
    assertEntityAccessOr404(rep, userSession);

    const isSensitive = SENSITIVE_CATEGORIES.has(rep.category);
    const confirmedAids = rep.aids.filter((a) => a.status === "CONFIRMED");

    const latestAid = confirmedAids.reduce<Date | undefined>((latest, a) => {
      return !latest || a.createdAt > latest ? a.createdAt : latest;
    }, undefined);

    const isStale = checkIsStale(rep.updatedAt, latestAid);

    let itemDeficits: ItemDeficitResult[] = [];
    let overallDeficitStatus: DeficitStatus | null = null;

    if (rep.type === "KEBUTUHAN") {
      itemDeficits = calculateDeficitPerItem(rep.needs, confirmedAids);
      overallDeficitStatus = calculateOverallDeficitStatus(itemDeficits);
    }

    // Kontak koordinator HANYA diberikan jika pengguna login (Section 4.2 AGENTS.md)
    const hasLoginSession = Boolean(userSession && userSession.userId);
    const coordinatorContact = hasLoginSession
      ? {
          name: rep.reporter.name,
          phone: rep.reporter.phone,
        }
      : null;

    return {
      id: rep.id,
      clientId: rep.clientId,
      title: rep.title,
      type: rep.type,
      category: rep.category,
      urgency: rep.urgency,
      status: rep.status as "VERIFIED",
      verificationLevel: rep.verificationLevel,
      trustScore: rep.trustScore,
      trustScoreReasons: parseTrustScoreReasons(rep.trustScoreReasons),
      latitude: isSensitive ? blurCoordinate(rep.latitude) : rep.latitude,
      longitude: isSensitive ? blurCoordinate(rep.longitude) : rep.longitude,
      isLocationBlurred: isSensitive,
      region: rep.region,
      what: rep.what,
      who: rep.who,
      whereDescription:
        isSensitive && !hasLoginSession
          ? "Lokasi presisi disamarkan untuk privasi penerima manfaat."
          : rep.whereDescription,
      when: rep.when,
      why: rep.why,
      how: rep.how,
      isStale,
      createdAt: rep.createdAt,
      updatedAt: rep.updatedAt,
      itemDeficits,
      overallDeficitStatus,
      needsCount: rep.needs.length,
      confirmedAidsCount: confirmedAids.length,
      verifications: rep.verifications.map((v) => ({
        id: v.id,
        decision: v.decision,
        note: v.note,
        createdAt: v.createdAt,
        verifierName: v.user.name,
      })),
      coordinatorContact,
      rawNeeds: rep.needs,
    };
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      return null;
    }
    throw err;
  }
}

/**
 * Mengambil ringkasan data agregat untuk dashboard publik.
 * Laporan PENDING hanya ditampilkan sebagai angka total agregat, tidak pernah sebagai dokumen detail.
 */
export async function getPublicAggregates(): Promise<PublicAggregates> {
  const [totalVerifiedReports, totalPendingReports, verifiedRegions, confirmedAids] =
    await Promise.all([
      prisma.report.count({
        where: { status: "VERIFIED" },
      }),
      prisma.report.count({
        where: { status: "PENDING" },
      }),
      prisma.report.groupBy({
        by: ["regionId"],
        where: { status: "VERIFIED" },
      }),
      prisma.aid.aggregate({
        where: { status: "CONFIRMED" },
        _sum: { qty: true },
      }),
    ]);

  return {
    totalVerifiedReports,
    totalPendingReports,
    totalActiveRegions: verifiedRegions.length,
    totalConfirmedAidItems: confirmedAids._sum.qty ?? 0,
  };
}

/**
 * Mengambil daftar kontak darurat (Nasional dan Posko Daerah).
 */
export async function getPublicEmergencyContacts(regionId?: string) {
  return await prisma.emergencyContact.findMany({
    where: {
      OR: [
        { scope: "NASIONAL" },
        ...(regionId ? [{ regionId }] : []),
      ],
    },
    include: {
      region: {
        select: {
          name: true,
          province: true,
          city: true,
        },
      },
    },
    orderBy: [{ scope: "asc" }, { name: "asc" }],
  });
}

