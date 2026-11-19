import "server-only";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "@/lib/session-options";

export type { SessionData };
export { sessionOptions };

/**
 * Mengambil sesi terenkripsi saat ini dari cookies Next.js (Server Action / Server Component).
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

/**
 * Menghancurkan sesi aktif (Logout).
 */
export async function destroySession() {
  const session = await getSession();
  session.destroy();
}
