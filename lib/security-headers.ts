export interface SecurityHeaderEntry {
  key: string;
  value: string;
}

/**
 * Membangun kebijakan Content-Security-Policy berdasarkan kebutuhan aktual TRASEC:
 * - Next.js App Router hydration & style inline
 * - Peta Leaflet + ubin OpenStreetMap (https://*.tile.openstreetmap.org)
 * - Pratinjau foto terkompresi via data:/blob:
 * - System font stack (tanpa Google Fonts eksternal)
 */
export function buildContentSecurityPolicy(
  isProduction: boolean = process.env.NODE_ENV === "production"
): string {
  const scriptSrc = isProduction
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  const connectSrc = isProduction
    ? "connect-src 'self'"
    : "connect-src 'self' ws: wss:";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.tile.openstreetmap.org",
    "font-src 'self' data:",
    connectSrc,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function getSecurityHeaders(
  isProduction: boolean = process.env.NODE_ENV === "production"
): SecurityHeaderEntry[] {
  return [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(isProduction),
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
  ];
}
