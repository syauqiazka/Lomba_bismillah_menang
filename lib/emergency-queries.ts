import "server-only";
import { prisma } from "@/lib/prisma";

export interface EmergencyContactItem {
  id: string;
  name: string;
  number: string;
  scope: "NASIONAL" | "PROVINSI" | "KABUPATEN";
  regionName?: string;
  sourceUrl?: string | null;
  checkedAt: Date;
  description?: string;
}

export const FALLBACK_EMERGENCY_CONTACTS: EmergencyContactItem[] = [
  {
    id: "ec-bnpb-117",
    name: "BNPB (Badan Nasional Penanggulangan Bencana)",
    number: "117",
    scope: "NASIONAL",
    sourceUrl: "https://bnpb.go.id",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Pusat Pengendalian Operasi (Pusdalops) penanganan bencana skala nasional.",
  },
  {
    id: "ec-basarnas-115",
    name: "BASARNAS (Badan Nasional Pencarian dan Pertolongan)",
    number: "115",
    scope: "NASIONAL",
    sourceUrl: "https://basarnas.go.id",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Operasi SAR darurat evakuasi korban bencana alam dan kecelakaan transportasi.",
  },
  {
    id: "ec-ntr-112",
    name: "Layanan Panggilan Darurat Terpadu Nasional",
    number: "112",
    scope: "NASIONAL",
    sourceUrl: "https://layanan112.kominfo.go.id",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Akses darurat terpadu bebas pulsa untuk medis, kepolisian, dan kebakaran.",
  },
  {
    id: "ec-kemenkes-119",
    name: "Kemenkes / Ambulans Gawat Darurat (SPGDT)",
    number: "119",
    scope: "NASIONAL",
    sourceUrl: "https://kemkes.go.id",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Sistem Penanggulangan Gawat Darurat Terpadu medis dan rujukan ambulans.",
  },
  {
    id: "ec-polisi-110",
    name: "Kepolisian Republik Indonesia (Polri)",
    number: "110",
    scope: "NASIONAL",
    sourceUrl: "https://polri.go.id",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Pengamanan wilayah, ketertiban umum, dan jalur evakuasi darurat.",
  },
  {
    id: "ec-damkar-113",
    name: "Pemadam Kebakaran (Damkar)",
    number: "113",
    scope: "NASIONAL",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Penanganan kebakaran pemukiman, penyelamatan hewan, dan bencana teknis.",
  },
  {
    id: "ec-bpbd-cianjur",
    name: "Posko Darurat BPBD Kabupaten Cianjur",
    number: "0263-2280112",
    scope: "KABUPATEN",
    regionName: "Kabupaten Cianjur (Jawa Barat)",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Pos Komando Utama penanganan pasca gempa dan tanah longsor wilayah Cugenang.",
  },
  {
    id: "ec-bpbd-lumajang",
    name: "Posko Tanggap Darurat Bencana Lumajang",
    number: "0334-881112",
    scope: "KABUPATEN",
    regionName: "Kabupaten Lumajang (Jawa Timur)",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Posko pemantauan guguran Semeru dan koordinasi pengungsian Pronojiwo.",
  },
  {
    id: "ec-bpbd-semarang",
    name: "Posko Siaga Banjir Rob Tambak Lorok Semarang",
    number: "024-3580011",
    scope: "KABUPATEN",
    regionName: "Kota Semarang (Jawa Tengah)",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Penanganan darurat tanggul jebol pesisir utara dan pasokan karung pasir.",
  },
  {
    id: "ec-bpbd-dki",
    name: "Pusdalops BPBD DKI Jakarta",
    number: "021-3865686",
    scope: "PROVINSI",
    regionName: "DKI Jakarta",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Pusat kendali banjir, genangan rob, dan koordinasi evakuasi ibu kota.",
  },
  {
    id: "ec-bpbd-padang",
    name: "Pusdalops BPBD Kota Padang",
    number: "0751-778775",
    scope: "KABUPATEN",
    regionName: "Kota Padang (Sumatera Barat)",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Kesiapsiagaan luapan sungai Batang Kuranji dan peringatan dini tsunami.",
  },
  {
    id: "ec-bpbd-jayapura",
    name: "Posko Bencana BPBD Kota Jayapura",
    number: "0967-531123",
    scope: "KABUPATEN",
    regionName: "Kota Jayapura (Papua)",
    checkedAt: new Date("2026-11-19T00:00:00Z"),
    description: "Koordinasi tanggap darurat wilayah perbatasan dan distrik pesisir.",
  },
];

/**
 * Mengambil daftar kontak darurat resmi untuk halaman /darurat.
 * Resilient terhadap ketiadaan koneksi database di lingkungan lokal/demo.
 */
export async function getEmergencyContacts(): Promise<EmergencyContactItem[]> {
  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  if (isPlaceholderDb) {
    return FALLBACK_EMERGENCY_CONTACTS;
  }

  try {
    const rawContacts = await prisma.emergencyContact.findMany({
      include: {
        region: true,
      },
      orderBy: [
        {
          scope: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    if (rawContacts.length === 0) {
      return FALLBACK_EMERGENCY_CONTACTS;
    }

    return rawContacts.map((c) => ({
      id: c.id,
      name: c.name,
      number: c.number,
      scope: c.scope,
      regionName: c.region ? `${c.region.name} (${c.region.province})` : undefined,
      sourceUrl: c.sourceUrl,
      checkedAt: c.checkedAt,
      description:
        c.scope === "NASIONAL"
          ? "Kontak resmi layanan darurat nasional Republik Indonesia."
          : `Posko siaga darurat daerah ${c.region?.name || ""}.`,
    }));
  } catch (error) {
    console.warn("Gagal mengambil kontak darurat dari database, menggunakan fallback data:", error);
    return FALLBACK_EMERGENCY_CONTACTS;
  }
}

