import type { PublicReportItem, PublicReportDetail, PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";

export interface RegionOption {
  id: string;
  name: string;
  province: string;
  city: string;
  latitude: number;
  longitude: number;
}

export const FALLBACK_REGIONS: RegionOption[] = [
  { id: "reg-jkt-pusat", name: "Jakarta Pusat", province: "DKI Jakarta", city: "Jakarta Pusat", latitude: -6.1805, longitude: 106.8284 },
  { id: "reg-jkt-selatan", name: "Jakarta Selatan", province: "DKI Jakarta", city: "Jakarta Selatan", latitude: -6.2615, longitude: 106.8106 },
  { id: "reg-cianjur", name: "Kabupaten Cianjur", province: "Jawa Barat", city: "Cianjur", latitude: -6.8222, longitude: 107.1394 },
  { id: "reg-bandung", name: "Kota Bandung", province: "Jawa Barat", city: "Bandung", latitude: -6.9175, longitude: 107.6191 },
  { id: "reg-semarang", name: "Kota Semarang", province: "Jawa Tengah", city: "Semarang", latitude: -6.9667, longitude: 110.4167 },
  { id: "reg-lumajang", name: "Kabupaten Lumajang", province: "Jawa Timur", city: "Lumajang", latitude: -8.1331, longitude: 113.2246 },
  { id: "reg-surabaya", name: "Kota Surabaya", province: "Jawa Timur", city: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
  { id: "reg-aceh-besar", name: "Kabupaten Aceh Besar", province: "Aceh", city: "Jantho", latitude: 5.3833, longitude: 95.5167 },
  { id: "reg-padang", name: "Kota Padang", province: "Sumatera Barat", city: "Padang", latitude: -0.9492, longitude: 100.3543 },
  { id: "reg-banjarmasin", name: "Kota Banjarmasin", province: "Kalimantan Selatan", city: "Banjarmasin", latitude: -3.3194, longitude: 114.5908 },
  { id: "reg-samarinda", name: "Kota Samarinda", province: "Kalimantan Timur", city: "Samarinda", latitude: -0.5022, longitude: 117.1536 },
  { id: "reg-denpasar", name: "Kota Denpasar", province: "Bali", city: "Denpasar", latitude: -8.6705, longitude: 115.2126 },
  { id: "reg-kupang", name: "Kota Kupang", province: "Nusa Tenggara Timur", city: "Kupang", latitude: -10.1772, longitude: 123.6070 },
  { id: "reg-makassar", name: "Kota Makassar", province: "Sulawesi Selatan", city: "Makassar", latitude: -5.1477, longitude: 119.4327 },
  { id: "reg-palu", name: "Kota Palu", province: "Sulawesi Tengah", city: "Palu", latitude: -0.8917, longitude: 119.8707 },
  { id: "reg-jayapura", name: "Kota Jayapura", province: "Papua", city: "Jayapura", latitude: -2.5916, longitude: 140.6690 },
];

export const FALLBACK_REPORTS: PublicReportItem[] = [
  {
    id: "rep-cianjur-sample",
    clientId: "fallback-cianjur-001",
    title: "Kebutuhan Mendesak Pengungsian Desa Cibulakan Pasca Gempa Susulan",
    type: "KEBUTUHAN",
    category: "BENCANA",
    urgency: "DARURAT",
    status: "VERIFIED",
    verificationLevel: "COMMUNITY",
    trustScore: 85,
    trustScoreReasons: [
      "Foto bukti lapangan terlampir (+30)",
      "Pelapor merupakan relawan terpercaya (+20)",
      "Terdapat laporan lain dalam radius 2 km (+20)",
      "Format 5W+1H lengkap dan spesifik (+15)",
    ],
    latitude: -6.8123,
    longitude: 107.1287,
    isLocationBlurred: false,
    region: {
      id: "reg-cianjur",
      name: "Kabupaten Cianjur",
      province: "Jawa Barat",
      city: "Cianjur",
    },
    what: "Gempa susulan berkekuatan M 4.2 menyebabkan 35 rumah rusak berat dan warga mengungsi di lapangan terbuka.",
    who: "85 Kepala Keluarga (sekitar 320 jiwa) termasuk 28 balita dan 15 lansia di RW 04.",
    whereDescription: "Lapangan samping Kantor Balai RW 04, Desa Cibulakan, Kecamatan Cugenang.",
    when: new Date("2026-11-18T06:30:00Z"),
    why: "Tenda keluarga dan selimut sangat mendesak karena hujan deras setiap sore.",
    how: "Penyaluran logistik fisik dapat diantarkan langsung ke Posko Lapangan RW 04.",
    isStale: false,
    createdAt: new Date("2026-11-18T06:30:00Z"),
    updatedAt: new Date("2026-11-18T06:30:00Z"),
    itemDeficits: [
      {
        itemCategory: "HUNIAN",
        unit: "unit",
        totalNeed: 40,
        totalConfirmedAid: 15,
        deficit: 25,
        percentageFulfilled: 38,
      },
      {
        itemCategory: "MAKANAN",
        unit: "paket",
        totalNeed: 300,
        totalConfirmedAid: 120,
        deficit: 180,
        percentageFulfilled: 40,
      },
      {
        itemCategory: "MEDIS",
        unit: "kotak",
        totalNeed: 50,
        totalConfirmedAid: 20,
        deficit: 30,
        percentageFulfilled: 40,
      },
    ],
    overallDeficitStatus: "KEKURANGAN_BESAR",
    needsCount: 4,
    confirmedAidsCount: 3,
  },
  {
    id: "rep-semarang-sample",
    clientId: "fallback-semarang-002",
    title: "Perbaikan Darurat Tanggul Tambak Lorok dan Pasokan Karung Pasir",
    type: "KEBUTUHAN",
    category: "LINGKUNGAN",
    urgency: "MENDESAK",
    status: "VERIFIED",
    verificationLevel: "OFFICIAL",
    trustScore: 80,
    trustScoreReasons: [
      "Diverifikasi langsung oleh perwakilan resmi PMI (+50)",
      "Foto bukti tanggul jebol terlampir (+30)",
    ],
    latitude: -6.9451,
    longitude: 110.4352,
    isLocationBlurred: false,
    region: {
      id: "reg-semarang",
      name: "Kota Semarang",
      province: "Jawa Tengah",
      city: "Semarang",
    },
    what: "Tanggul penahan air laut jebol sepanjang 12 meter mengakibatkan genangan rob merendam pemukiman.",
    who: "Masyarakat pesisir Tambak Lorok RW 13, mencakup 140 rumah warga.",
    whereDescription: "Titik jebol dermaga nelayan Tambak Lorok, Tanjung Mas.",
    when: new Date("2026-11-17T14:00:00Z"),
    why: "Mencegah genangan meluas ke jalan raya saat pasang malam.",
    how: "Bantuan karung pasir diturunkan di dekat gapura dermaga.",
    isStale: false,
    createdAt: new Date("2026-11-17T14:00:00Z"),
    updatedAt: new Date("2026-11-17T14:00:00Z"),
    itemDeficits: [
      {
        itemCategory: "LOGISTIK",
        unit: "karung",
        totalNeed: 2000,
        totalConfirmedAid: 800,
        deficit: 1200,
        percentageFulfilled: 40,
      },
    ],
    overallDeficitStatus: "KEKURANGAN_BESAR",
    needsCount: 3,
    confirmedAidsCount: 1,
  },
  {
    id: "rep-lansia-sample",
    clientId: "fallback-lansia-003",
    title: "Dukungan Makanan Lunak dan Obat Rutin untuk Panti Jompo Swadaya",
    type: "KEBUTUHAN",
    category: "LANSIA",
    urgency: "TERENCANA",
    status: "VERIFIED",
    verificationLevel: "COMMUNITY",
    trustScore: 70,
    trustScoreReasons: [
      "Foto bukti panti jompo terlampir (+30)",
      "Pelapor terverifikasi (+20)",
      "Format 5W+1H lengkap (+15)",
    ],
    latitude: -6.28,
    longitude: 106.82,
    isLocationBlurred: true,
    region: {
      id: "reg-jkt-selatan",
      name: "Jakarta Selatan",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
    },
    what: "Kebutuhan pasokan popok dewasa, makanan lunak bergizi, dan obat pemeliharaan lansia.",
    who: "42 penghuni panti lansia non-pemerintah usia 68-87 tahun.",
    whereDescription: "Lokasi presisi disamarkan untuk privasi penerima manfaat.",
    when: new Date("2026-11-16T10:00:00Z"),
    why: "Persediaan kebutuhan pokok panti menipis untuk 10 hari ke depan.",
    how: "Paket dikirimkan ke sekretariat yayasan pada jam kerja.",
    isStale: false,
    createdAt: new Date("2026-11-16T10:00:00Z"),
    updatedAt: new Date("2026-11-16T10:00:00Z"),
    itemDeficits: [
      {
        itemCategory: "MAKANAN",
        unit: "paket",
        totalNeed: 50,
        totalConfirmedAid: 25,
        deficit: 25,
        percentageFulfilled: 50,
      },
      {
        itemCategory: "MEDIS",
        unit: "paket",
        totalNeed: 40,
        totalConfirmedAid: 15,
        deficit: 25,
        percentageFulfilled: 38,
      },
    ],
    overallDeficitStatus: "KEKURANGAN_SEDANG",
    needsCount: 3,
    confirmedAidsCount: 2,
  },
  {
    id: "rep-pantau-sample",
    clientId: "fallback-pantau-004",
    title: "Pantauan Aktivitas Guguran Lava dan Jalur Evakuasi Curah Kobokan",
    type: "PEMANTAUAN",
    category: "BENCANA",
    urgency: "MENDESAK",
    status: "VERIFIED",
    verificationLevel: "OFFICIAL",
    trustScore: 85,
    trustScoreReasons: [
      "Diverifikasi pos pengamatan resmi (+50)",
      "Foto visual guguran terlampir (+30)",
    ],
    latitude: -8.1189,
    longitude: 113.0845,
    isLocationBlurred: false,
    region: {
      id: "reg-lumajang",
      name: "Kabupaten Lumajang",
      province: "Jawa Timur",
      city: "Lumajang",
    },
    what: "Aktivitas vulkanik meningkat dengan luncuran awan panas guguran sejauh 3 km ke arah Besuk Kobokan.",
    who: "Warga Dusun Kajar Kuning dan Dusun Kamarkajang diimbau waspada.",
    whereDescription: "Jalur penyeberangan Besuk Kobokan, Desa Supiturang, Kecamatan Pronojiwo.",
    when: new Date("2026-11-19T04:15:00Z"),
    why: "Peringatan dini bagi relawan dan warga agar tidak melintasi jembatan darurat.",
    how: "Akses visual dari Pos Pengamatan Gunung Sawur.",
    isStale: false,
    createdAt: new Date("2026-11-19T04:15:00Z"),
    updatedAt: new Date("2026-11-19T04:15:00Z"),
    itemDeficits: [],
    overallDeficitStatus: null,
    needsCount: 0,
    confirmedAidsCount: 0,
  },
];

export const FALLBACK_AGGREGATES: PublicAggregates = {
  totalVerifiedReports: 4,
  totalPendingReports: 2,
  totalActiveRegions: 4,
  totalConfirmedAidItems: 960,
};

export function getFallbackReportDetail(
  id: string,
  userSession?: SessionData | null
): PublicReportDetail | null {
  const item = FALLBACK_REPORTS.find((r) => r.id === id);
  if (!item) return null;

  const hasLogin = Boolean(userSession && userSession.userId);

  return {
    ...item,
    coordinatorContact: hasLogin
      ? {
          name: "Dewi Kartika (Koordinator Lapangan)",
          phone: "08110000004",
        }
      : null,
    verifications: [
      {
        id: "verif-1",
        decision: "APPROVE",
        note: "Data validasi lapangan telah dikonfirmasi melalui ketua RW dan bukti foto geolokasi.",
        createdAt: new Date("2026-11-18T08:00:00Z"),
        verifierName: "Budi Santoso (Verifikator Komunitas)",
      },
    ],
    rawNeeds: item.itemDeficits.map((d, i) => ({
      id: `need-${i}`,
      itemCategory: d.itemCategory,
      unit: d.unit,
      qty: d.totalNeed,
      kind: d.itemCategory === "EVAKUASI" ? "TENAGA" : "BARANG",
    })),
  };
}

