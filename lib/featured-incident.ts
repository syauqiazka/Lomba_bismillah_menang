import type { PublicReportItem } from "@/lib/public-queries";

const URGENCY_RANK: Record<string, number> = {
  DARURAT: 3,
  MENDESAK: 2,
  TERENCANA: 1,
};

const CATEGORY_RELEVANCE_RANK: Record<string, number> = {
  BENCANA: 3,
  LINGKUNGAN: 3,
  KESEHATAN: 2,
  LANSIA: 2,
  PENDIDIKAN: 1,
  SOSIAL_LAINNYA: 1,
};

/**
 * Mengurutkan laporan VERIFIED secara deterministik (tanpa random) berdasarkan:
 * 1. Urgensi: DARURAT -> MENDESAK -> TERENCANA
 * 2. Kebaruan updatedAt (terbaru lebih dulu)
 * 3. Relevansi kategori lingkungan dan bencana
 */
export function sortReportsDeterministically(
  reports: PublicReportItem[]
): PublicReportItem[] {
  const verifiedOnly = reports.filter((r) => r.status === "VERIFIED");

  return [...verifiedOnly].sort((a, b) => {
    const urgDiff = (URGENCY_RANK[b.urgency] ?? 0) - (URGENCY_RANK[a.urgency] ?? 0);
    if (urgDiff !== 0) return urgDiff;

    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    if (timeB !== timeA) return timeB - timeA;

    const catDiff =
      (CATEGORY_RELEVANCE_RANK[b.category] ?? 0) -
      (CATEGORY_RELEVANCE_RANK[a.category] ?? 0);
    if (catDiff !== 0) return catDiff;

    return a.id.localeCompare(b.id);
  });
}

/**
 * Memilih 1 laporan utama (Featured Incident) secara deterministik.
 */
export function selectFeaturedIncident(
  reports: PublicReportItem[]
): PublicReportItem | null {
  const sorted = sortReportsDeterministically(reports);
  return sorted[0] ?? null;
}

export interface ThematicAsset {
  src: string;
  alt: string;
  attribution: string;
}

/**
 * Memetakan aset foto dokumenter terkurasi dari public/images/landing/ secara tematik.
 * Seluruh foto diberi label sebagai dokumentasi tematik arsip agar tidak menyamar sebagai foto langsung kejadian.
 */
export function getThematicDocumentaryImage(category: string): ThematicAsset {
  switch (category) {
    case "BENCANA":
      return {
        src: "/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg",
        alt: "Ilustrasi tematik posko dan tenda pengungsian relawan",
        attribution: "Arsip Kurasi TILARA: Operasi Posko Pengungsian",
      };
    case "LINGKUNGAN":
      return {
        src: "/images/landing/field-activities/bersih-sungai-cikapundung.jpg",
        alt: "Ilustrasi tematik aksi penanganan dan pembersihan lingkungan sungai",
        attribution: "Arsip Kurasi TILARA: Aksi Bersih Sungai & Lingkungan",
      };
    case "LANSIA":
      return {
        src: "/images/landing/categories/posyandu-kesehatan-lansia.jpg",
        alt: "Ilustrasi tematik pelayanan kesehatan dan pendampingan lansia",
        attribution: "Arsip Kurasi TILARA: Pendampingan Lansia & Posyandu",
      };
    case "KESEHATAN":
      return {
        src: "/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg",
        alt: "Ilustrasi tematik penyaluran paket kebersihan dan kesehatan lapangan",
        attribution: "Arsip Kurasi TILARA: Logistik Sanitasi & Kesehatan",
      };
    default:
      return {
        src: "/images/landing/hero/gotong-royong-relawan-sungai.jpg",
        alt: "Ilustrasi tematik gotong royong relawan kemanusiaan Indonesia",
        attribution: "Arsip Kurasi TILARA: Dokumentasi Gotong Royong Relawan",
      };
  }
}

