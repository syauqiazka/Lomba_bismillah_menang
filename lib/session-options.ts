import type { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  name?: string;
  email?: string;
  role?: "RELAWAN" | "VERIFIKATOR" | "ADMIN";
  isVerifiedVolunteer?: boolean;
}

const MIN_SECRET_LENGTH = 32;
const NON_PROD_FALLBACK_SECRET =
  "trasec_dev_only_fallback_secret_32_chars_min_non_production";

/**
 * Menyelesaikan password enkripsi cookie iron-session secara aman.
 * - Production wajib memiliki SESSION_SECRET dengan panjang minimal 32 karakter.
 * - Development dan test boleh memakai fallback khusus non-production jika SESSION_SECRET belum diatur.
 */
export function resolveSessionPassword(
  env: Record<string, string | undefined> = process.env
): string {
  const secret = env.SESSION_SECRET?.trim();

  if (secret) {
    if (secret.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `SESSION_SECRET tidak memenuhi syarat keamanan: minimal ${MIN_SECRET_LENGTH} karakter.`
      );
    }
    return secret;
  }

  if (env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET wajib dikonfigurasi pada environment production."
    );
  }

  return NON_PROD_FALLBACK_SECRET;
}

export function getSessionOptions(
  env: Record<string, string | undefined> = process.env
): SessionOptions {
  return {
    password: resolveSessionPassword(env),
    cookieName: "trasec_session",
    cookieOptions: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    },
  };
}

/**
 * Konfigurasi sesi standar yang mengevaluasi password secara dinamis saat runtime,
 * sehingga build statis tidak gagal sebelum env runtime disuntikkan,
 * namun tetap menolak berjalan di production tanpa SESSION_SECRET.
 */
export const sessionOptions: SessionOptions = {
  get password(): string {
    return resolveSessionPassword();
  },
  cookieName: "trasec_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  },
};
