import type { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  name?: string;
  email?: string;
  role?: "RELAWAN" | "VERIFIKATOR" | "ADMIN";
  isVerifiedVolunteer?: boolean;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "trasec_humanitarian_platform_session_secret_32_chars_min_production",
  cookieName: "trasec_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  },
};
