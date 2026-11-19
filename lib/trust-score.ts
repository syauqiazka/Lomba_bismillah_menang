export interface TrustScoreFactors {
  hasPhotoEvidence: boolean;
  hasNearbyReportsWithin2Km: boolean;
  isTrustedReporter: boolean;
  hasSubstantive5W1H: boolean;
  hasVerifiedContact: boolean;
}

export interface ScoreReasonItem {
  factor: keyof TrustScoreFactors;
  points: number;
  maxPoints: number;
  description: string;
}

export interface TrustScoreResult {
  score: number;
  reasons: ScoreReasonItem[];
}

/**
 * Menghitung skor kepercayaan secara deterministik matematis (0 - 100).
 * Dilarang menggunakan AI untuk menentukan angka skor ini.
 * Setiap butir alasan penambah/pengurang dicatat dan disajikan secara transparan.
 */
export function calculateTrustScore(factors: TrustScoreFactors): TrustScoreResult {
  const reasons: ScoreReasonItem[] = [];

  // 1. Lampiran foto bukti lapangan (+30 poin)
  const photoPoints = factors.hasPhotoEvidence ? 30 : 0;
  reasons.push({
    factor: "hasPhotoEvidence",
    points: photoPoints,
    maxPoints: 30,
    description: factors.hasPhotoEvidence
      ? "Foto terlampir: Foto bukti lapangan berhasil diverifikasi (+30)"
      : "Belum melampirkan foto bukti lapangan (+0)",
  });

  // 2. Laporan mandiri lain dalam radius 2 km (+20 poin)
  const nearbyPoints = factors.hasNearbyReportsWithin2Km ? 20 : 0;
  reasons.push({
    factor: "hasNearbyReportsWithin2Km",
    points: nearbyPoints,
    maxPoints: 20,
    description: factors.hasNearbyReportsWithin2Km
      ? "Dukungan konfirmasi silang: Terdapat laporan mandiri lain dalam radius 2 km (+20)"
      : "Belum ada laporan lain dari relawan berbeda di sekitar titik lokasi (+0)",
  });

  // 3. Pelapor terverifikasi / trusted volunteer (+20 poin)
  const trustedPoints = factors.isTrustedReporter ? 20 : 0;
  reasons.push({
    factor: "isTrustedReporter",
    points: trustedPoints,
    maxPoints: 20,
    description: factors.isTrustedReporter
      ? "Pelapor terpercaya: Memiliki riwayat verifikasi valid sebelumnya (+20)"
      : "Pelapor belum memiliki rekam jejak laporan terverifikasi (+0)",
  });

  // 4. Deskripsi 5W+1H lengkap substantif (+15 poin)
  const substantivePoints = factors.hasSubstantive5W1H ? 15 : 0;
  reasons.push({
    factor: "hasSubstantive5W1H",
    points: substantivePoints,
    maxPoints: 15,
    description: factors.hasSubstantive5W1H
      ? "Narasi operasional lengkap dan memenuhi 6 unsur 5W+1H (+15)"
      : "Informasi 5W+1H belum terisi lengkap atau terlalu singkat (+0)",
  });

  // 5. Akun relawan dengan kontak nomor terverifikasi (+15 poin)
  const contactPoints = factors.hasVerifiedContact ? 15 : 0;
  reasons.push({
    factor: "hasVerifiedContact",
    points: contactPoints,
    maxPoints: 15,
    description: factors.hasVerifiedContact
      ? "Nomor kontak pelapor terverifikasi (+15)"
      : "Nomor kontak pelapor belum diverifikasi (+0)",
  });

  const totalScore = Math.min(
    100,
    Math.max(
      0,
      photoPoints + nearbyPoints + trustedPoints + substantivePoints + contactPoints
    )
  );

  return {
    score: totalScore,
    reasons,
  };
}
