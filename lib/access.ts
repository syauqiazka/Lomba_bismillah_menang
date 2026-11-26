import { SessionData } from "@/lib/session-options";

export class EntityNotFoundError extends Error {
  constructor(message = "Entitas tidak ditemukan.") {
    super(message);
    this.name = "EntityNotFoundError";
  }
}

export class AccessForbiddenError extends Error {
  constructor(message = "Akses ditolak: Peran pengguna tidak memiliki izin untuk tindakan ini.") {
    super(message);
    this.name = "AccessForbiddenError";
  }
}

export type UserRole = "RELAWAN" | "VERIFIKATOR" | "ADMIN";

/**
 * Mengecek apakah peran pengguna memiliki wewenang verifikasi laporan atau bantuan.
 * Hanya role VERIFIKATOR dan ADMIN yang diperbolehkan.
 */
export function canVerify(user?: SessionData | null): boolean {
  if (!user || !user.role) return false;
  return user.role === "VERIFIKATOR" || user.role === "ADMIN";
}

/**
 * Mengecek apakah peran pengguna memiliki wewenang administrasi sistem.
 */
export function canAdmin(user?: SessionData | null): boolean {
  if (!user || !user.role) return false;
  return user.role === "ADMIN";
}

/**
 * Mengecek apakah pengguna berhak mengedit laporan kemanusiaan.
 * Aturan Bisnis 4.3: Hanya pelapor asli yang berhak mengubah laporan,
 * dan hanya ketika status laporan adalah NEEDS_REVISION.
 */
export function canEditReport(
  report: { reporterId: string; status: string },
  user?: SessionData | null
): boolean {
  if (!user || !user.userId) return false;
  if (report.status !== "NEEDS_REVISION") return false;
  return report.reporterId === user.userId;
}

/**
 * Mengecek apakah pengguna berhak melihat kontak koordinator lapangan atau data presisi.
 * Aturan Bisnis 4.2: Kontak koordinator hanya diberikan kepada relawan yang memiliki sesi login valid.
 */
export function canViewSensitiveDetails(user?: SessionData | null): boolean {
  return Boolean(user && user.userId && user.role);
}

/**
 * Evaluasi izin akses rute halaman aplikasi.
 * Menghasilkan instruksi redirect (307) untuk pengguna anonim atau sinyal 403 (Forbidden)
 * untuk pengguna login yang mencoba mengakses modul di luar perannya.
 */
export function evaluateRouteAccess(
  pathname: string,
  user?: SessionData | null
): { allowed: boolean; redirectUrl?: string; isForbidden?: boolean } {
  const isAuth = Boolean(user && user.userId);
  const role = user?.role;

  // 1. Rute Pelaporan (/lapor)
  if (pathname === "/lapor" || pathname.startsWith("/lapor/")) {
    if (!isAuth) {
      return { allowed: false, redirectUrl: `/login?next=${encodeURIComponent(pathname)}` };
    }
    return { allowed: true };
  }

  // 2. Rute Verifikasi (/verifikasi)
  if (pathname === "/verifikasi" || pathname.startsWith("/verifikasi/")) {
    if (!isAuth) {
      return { allowed: false, redirectUrl: `/login?next=${encodeURIComponent(pathname)}` };
    }
    if (role === "VERIFIKATOR" || role === "ADMIN") {
      return { allowed: true };
    }
    return { allowed: false, isForbidden: true };
  }

  // 3. Rute Admin (/admin)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAuth) {
      return { allowed: false, redirectUrl: `/login?next=${encodeURIComponent(pathname)}` };
    }
    if (role === "ADMIN") {
      return { allowed: true };
    }
    return { allowed: false, isForbidden: true };
  }

  // 4. Rute Antrean Offline (/antrean) & Pemantauan Kebutuhan (/kebutuhan)
  if (
    pathname === "/antrean" ||
    pathname.startsWith("/antrean/") ||
    pathname === "/kebutuhan" ||
    pathname.startsWith("/kebutuhan/")
  ) {
    if (!isAuth) {
      return { allowed: false, redirectUrl: `/login?next=${encodeURIComponent(pathname)}` };
    }
    return { allowed: true };
  }

  // 5. Rute Distribusi Bantuan (/distribusi) — Khusus Koordinator/Verifikator & Admin
  if (pathname === "/distribusi" || pathname.startsWith("/distribusi/")) {
    if (!isAuth) {
      return { allowed: false, redirectUrl: `/login?next=${encodeURIComponent(pathname)}` };
    }
    if (role === "VERIFIKATOR" || role === "ADMIN") {
      return { allowed: true };
    }
    return { allowed: false, isForbidden: true };
  }

  // Rute publik lainnya (misal: /, /laporan/:id, /darurat)
  return { allowed: true };
}

/**
 * Proteksi IDOR (Insecure Direct Object Reference).
 * Jika entitas tidak ada, berstatus non-VERIFIED dan pengguna bukan pembuat serta bukan verifikator/admin:
 * WAJIB kembalikan / lempar 404 (EntityNotFoundError).
 * Dilarang mengembalikan 403 untuk ID privat guna mencegah enumerasi data.
 */
export function assertEntityAccessOr404<
  T extends { status: string; reporterId?: string | null; userId?: string | null }
>(entity: T | null, user?: SessionData | null): T {
  if (!entity) {
    throw new EntityNotFoundError();
  }

  // Laporan publik yang sudah terverifikasi boleh dilihat siapapun
  if (entity.status === "VERIFIED") {
    return entity;
  }

  // Jika status belum publik (PENDING, NEEDS_REVISION, REJECTED_FINAL):
  // Verifikator dan Admin berhak melihat untuk keperluan audit/tinjauan
  if (user && (user.role === "VERIFIKATOR" || user.role === "ADMIN")) {
    return entity;
  }

  // Pemilik asli entitas berhak melihat status pengajuannya sendiri
  const ownerId = entity.reporterId ?? entity.userId;
  if (user && user.userId && ownerId === user.userId) {
    return entity;
  }

  // Di luar kondisi di atas, WAJIB 404 (Jangan pernah 403)
  throw new EntityNotFoundError();
}
