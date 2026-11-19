import "server-only";
import { prisma } from "@/lib/prisma";
import { canVerify } from "@/lib/access";
import type { SessionData } from "@/lib/session-options";

export interface QueueReportItem {
  id: string;
  clientId: string;
  title: string;
  type: "KEBUTUHAN" | "PEMANTAUAN";
  category: "BENCANA" | "LINGKUNGAN" | "LANSIA" | "KESEHATAN" | "PENDIDIKAN" | "SOSIAL_LAINNYA";
  urgency: "DARURAT" | "MENDESAK" | "TERENCANA";
  status: "PENDING" | "NEEDS_REVISION" | "VERIFIED" | "REJECTED_FINAL";
  verificationLevel: "COMMUNITY" | "OFFICIAL" | null;
  verificationCount: number;
  revisionCount: number;
  trustScore: number;
  trustScoreReasons: string[];
  region: {
    id: string;
    name: string;
    province: string;
    city: string;
  };
  reporter: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    isVerifiedVolunteer: boolean;
  };
  what: string;
  who: string;
  whereDescription: string;
  when: Date;
  why: string;
  how: string;
  needs: Array<{
    id: string;
    itemCategory: string;
    unit: string;
    qty: number;
    kind: "BARANG" | "TENAGA";
  }>;
  pendingAids: Array<{
    id: string;
    userId: string;
    userName: string;
    userIsVerified: boolean;
    itemCategory: string;
    unit: string;
    qty: number;
    createdAt: Date;
  }>;
  verifications: Array<{
    id: string;
    userId: string;
    verifierName: string;
    decision: "APPROVE" | "REJECT";
    note: string | null;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerifierOrgInfo {
  isFromVerifiedOrg: boolean;
  orgName?: string;
}

const FALLBACK_QUEUE_REPORTS: QueueReportItem[] = [
  {
    id: "rep-jayapura-pending-005",
    clientId: "seed-rep-jayapura-pending-005",
    title: "Kebutuhan Buku Bacaan dan Alat Tulis Sekolah Rimba Skouw",
    type: "KEBUTUHAN",
    category: "PENDIDIKAN",
    urgency: "TERENCANA",
    status: "PENDING",
    verificationLevel: null,
    verificationCount: 0,
    revisionCount: 0,
    trustScore: 45,
    trustScoreReasons: [
      "Format 5W+1H lengkap (+15)",
      "Nomor telepon pelapor terdaftar (+15)",
      "Belum ada foto bukti lapangan (+0)",
    ],
    region: {
      id: "reg-jayapura",
      name: "Kota Jayapura",
      province: "Papua",
      city: "Jayapura",
    },
    reporter: {
      id: "usr-relawan-baru",
      name: "Ahmad Rizki",
      email: "ahmad.relawan@trasec.id",
      phone: "08110000005",
      isVerifiedVolunteer: false,
    },
    what: "Kekurangan buku tulis, alat mewarnai, dan papan tulis darurat untuk kelas belajar anak perbatasan.",
    who: "55 murid sekolah tapal batas usia SD kelas 1 hingga 4.",
    whereDescription: "Balai Komunitas Kampung Mosso, Distrik Muara Tami, Kota Jayapura.",
    when: new Date("2026-11-18T11:00:00Z"),
    why: "Ruang kelas darurat belum memiliki modul pembelajaran memadai menjelang tahun ajaran baru.",
    how: "Bantuan perlengkapan pendidikan dapat dititipkan ke kantor pos perbatasan atau diantar langsung.",
    needs: [
      { id: "need-jyp-1", itemCategory: "PENDIDIKAN", unit: "paket", qty: 60, kind: "BARANG" },
      { id: "need-jyp-2", itemCategory: "PENDIDIKAN", unit: "unit", qty: 3, kind: "BARANG" },
    ],
    pendingAids: [
      {
        id: "aid-pending-jyp-1",
        userId: "usr-relawan-baru",
        userName: "Ahmad Rizki",
        userIsVerified: false,
        itemCategory: "PENDIDIKAN",
        unit: "paket",
        qty: 15,
        createdAt: new Date("2026-11-18T14:30:00Z"),
      },
    ],
    verifications: [],
    createdAt: new Date("2026-11-18T11:00:00Z"),
    updatedAt: new Date("2026-11-18T11:00:00Z"),
  },
  {
    id: "rep-padang-revision-006",
    clientId: "seed-rep-padang-revision-006",
    title: "Permohonan Penjernih Air Pasca Banjir Luapan Batang Kuranji",
    type: "KEBUTUHAN",
    category: "KESEHATAN",
    urgency: "MENDESAK",
    status: "NEEDS_REVISION",
    verificationLevel: null,
    verificationCount: 0,
    revisionCount: 1,
    trustScore: 30,
    trustScoreReasons: [
      "Pelapor terdaftar (+15)",
      "Deskripsi parsial (+15)",
    ],
    region: {
      id: "reg-padang",
      name: "Kota Padang",
      province: "Sumatera Barat",
      city: "Padang",
    },
    reporter: {
      id: "usr-relawan-baru",
      name: "Ahmad Rizki",
      email: "ahmad.relawan@trasec.id",
      phone: "08110000005",
      isVerifiedVolunteer: false,
    },
    what: "Sumur warga tergenang lumpur sehingga butuh kaporit dan tablet penjernih air.",
    who: "Warga RW 02 sekitar bantaran sungai Batang Kuranji.",
    whereDescription: "Kelurahan Kuranji, Kota Padang.",
    when: new Date("2026-11-17T09:00:00Z"),
    why: "Air sumur keruh dan berbau tanah.",
    how: "Melalui pos ronda RT 03.",
    needs: [
      { id: "need-pdg-1", itemCategory: "SANITASI", unit: "kotak", qty: 100, kind: "BARANG" },
    ],
    pendingAids: [],
    verifications: [
      {
        id: "verif-pdg-prev-1",
        userId: "usr-verif-komunitas",
        verifierName: "Budi Santoso",
        decision: "REJECT",
        note: "Mohon sertakan estimasi jumlah kepala keluarga penerima manfaat dan foto titik sumber air yang tercemar.",
        createdAt: new Date("2026-11-17T15:20:00Z"),
      },
    ],
    createdAt: new Date("2026-11-17T09:00:00Z"),
    updatedAt: new Date("2026-11-17T15:20:00Z"),
  },
  {
    id: "rep-cianjur-pending-community",
    clientId: "seed-rep-cianjur-comm-008",
    title: "Kebutuhan Tambahan Terpal dan Tikar Pengungsian Balai Desa Sukaresmi",
    type: "KEBUTUHAN",
    category: "BENCANA",
    urgency: "DARURAT",
    status: "PENDING",
    verificationLevel: null,
    verificationCount: 1, // Sudah diverifikasi 1 verifikator, butuh 1 lagi untuk tingkat COMMUNITY
    revisionCount: 0,
    trustScore: 65,
    trustScoreReasons: [
      "Pelapor relawan terpercaya (+20)",
      "Format 5W+1H lengkap (+15)",
      "Diverifikasi oleh 1 relawan terdaftar (+30)",
    ],
    region: {
      id: "reg-cianjur",
      name: "Kabupaten Cianjur",
      province: "Jawa Barat",
      city: "Cianjur",
    },
    reporter: {
      id: "usr-dewi-relawan",
      name: "Dewi Kartika",
      email: "dewi.relawan@trasec.id",
      phone: "08110000004",
      isVerifiedVolunteer: true,
    },
    what: "Pengungsi tambahan sebanyak 40 jiwa membutuhkan alas tidur dan terpal penutup dapur umum.",
    who: "Warga RT 02 Dusun 3 Desa Sukaresmi.",
    whereDescription: "Halaman Balai Desa Sukaresmi, Cianjur.",
    when: new Date("2026-11-19T02:00:00Z"),
    why: "Tanah basah akibat rembesan air hujan malam hari.",
    how: "Dapat diantar via mobil pickup ke gerbang balai desa.",
    needs: [
      { id: "need-cjr-comm-1", itemCategory: "HUNIAN", unit: "lembar", qty: 30, kind: "BARANG" },
      { id: "need-cjr-comm-2", itemCategory: "LOGISTIK", unit: "lembar", qty: 45, kind: "BARANG" },
    ],
    pendingAids: [],
    verifications: [
      {
        id: "verif-cjr-1",
        userId: "usr-verif-komunitas-1",
        verifierName: "Budi Santoso",
        decision: "APPROVE",
        note: "Data telah diverifikasi via telepon posko desa.",
        createdAt: new Date("2026-11-19T03:30:00Z"),
      },
    ],
    createdAt: new Date("2026-11-19T02:00:00Z"),
    updatedAt: new Date("2026-11-19T03:30:00Z"),
  },
];

/**
 * Mendapatkan daftar antrean verifikasi untuk VERIFIKATOR dan ADMIN.
 */
export async function getVerificationQueue(
  userSession?: SessionData | null
): Promise<QueueReportItem[]> {
  if (!canVerify(userSession)) {
    return [];
  }

  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  if (isPlaceholderDb) {
    return FALLBACK_QUEUE_REPORTS;
  }

  try {
    const rawReports = await prisma.report.findMany({
      where: {
        status: {
          in: ["PENDING", "NEEDS_REVISION"],
        },
      },
      include: {
        region: true,
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerifiedVolunteer: true,
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
          where: {
            status: "PENDING",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                isVerifiedVolunteer: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        verifications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: [
        {
          urgency: "asc", // DARURAT -> MENDESAK -> TERENCANA
        },
        {
          createdAt: "asc",
        },
      ],
    });

    return rawReports.map((r) => {
      let reasons: string[] = [];
      try {
        if (r.trustScoreReasons) {
          reasons = JSON.parse(r.trustScoreReasons);
        }
      } catch {
        reasons = [];
      }

      return {
        id: r.id,
        clientId: r.clientId,
        title: r.title,
        type: r.type,
        category: r.category,
        urgency: r.urgency,
        status: r.status,
        verificationLevel: r.verificationLevel,
        verificationCount: r.verificationCount,
        revisionCount: r.revisionCount,
        trustScore: r.trustScore,
        trustScoreReasons: reasons,
        region: {
          id: r.region.id,
          name: r.region.name,
          province: r.region.province,
          city: r.region.city,
        },
        reporter: {
          id: r.reporter.id,
          name: r.reporter.name,
          email: r.reporter.email,
          phone: r.reporter.phone,
          isVerifiedVolunteer: r.reporter.isVerifiedVolunteer,
        },
        what: r.what,
        who: r.who,
        whereDescription: r.whereDescription,
        when: r.when,
        why: r.why,
        how: r.how,
        needs: r.needs.map((n) => ({
          id: n.id,
          itemCategory: n.itemCategory,
          unit: n.unit,
          qty: n.qty,
          kind: n.kind,
        })),
        pendingAids: r.aids.map((a) => ({
          id: a.id,
          userId: a.user.id,
          userName: a.user.name,
          userIsVerified: a.user.isVerifiedVolunteer,
          itemCategory: a.itemCategory,
          unit: a.unit,
          qty: a.qty,
          createdAt: a.createdAt,
        })),
        verifications: r.verifications.map((v) => ({
          id: v.id,
          userId: v.userId,
          verifierName: v.user.name,
          decision: v.decision,
          note: v.note,
          createdAt: v.createdAt,
        })),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
  } catch (error) {
    console.error("Gagal mengambil antrean verifikasi:", error);
    return FALLBACK_QUEUE_REPORTS;
  }
}

/**
 * Memeriksa status lembaga terverifikasi untuk verifikator.
 */
export async function getVerifierOrgStatus(
  userId: string,
  userEmail?: string
): Promise<VerifierOrgInfo> {
  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  if (isPlaceholderDb) {
    if (userEmail?.includes("pmi") || userEmail?.includes("lembaga")) {
      return {
        isFromVerifiedOrg: true,
        orgName: "Palang Merah Indonesia (PMI) Wilayah Jawa Barat",
      };
    }
    return { isFromVerifiedOrg: false };
  }

  try {
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organization: {
          isVerified: true,
        },
      },
      include: {
        organization: true,
      },
    });

    if (membership && membership.organization) {
      return {
        isFromVerifiedOrg: true,
        orgName: membership.organization.name,
      };
    }

    return { isFromVerifiedOrg: false };
  } catch {
    return { isFromVerifiedOrg: false };
  }
}

