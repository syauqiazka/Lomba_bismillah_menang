/**
 * Menghasilkan Client ID (UUID v4) untuk penandaan idempoten transaksi
 * dan antrean kirim offline relawan lapangan.
 */
export function generateClientId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `aid-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}
