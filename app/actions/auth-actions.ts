"use server";

import { revalidatePath } from "next/cache";
import { getSession, destroySession } from "@/lib/session";
import { authenticateUser, registerVolunteer } from "@/lib/auth";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validators";
import type { ActionResponse } from "@/lib/types";
import type { SessionData } from "@/lib/session-options";

const DEMO_ACCOUNTS: Record<string, { name: string; role: "ADMIN" | "VERIFIKATOR" | "RELAWAN"; isVerified: boolean; passwordMatch: string }> = {
  "admin@trasec.id": {
    name: "Administrator Sistem Trasec",
    role: "ADMIN",
    isVerified: true,
    passwordMatch: "AdminTrasec2026!",
  },
  "verifikator.komunitas@trasec.id": {
    name: "Budi Santoso (Verifikator Komunitas)",
    role: "VERIFIKATOR",
    isVerified: true,
    passwordMatch: "Verifikator2026!",
  },
  "pmi.verifikator@trasec.id": {
    name: "Siti Rahma (Verifikator PMI Jawa Barat)",
    role: "VERIFIKATOR",
    isVerified: true,
    passwordMatch: "Verifikator2026!",
  },
  "dewi.relawan@trasec.id": {
    name: "Dewi Kartika (Relawan Terpercaya)",
    role: "RELAWAN",
    isVerified: true,
    passwordMatch: "Relawan2026!",
  },
  "ahmad.relawan@trasec.id": {
    name: "Ahmad Rizki (Relawan Baru)",
    role: "RELAWAN",
    isVerified: false,
    passwordMatch: "Relawan2026!",
  },
};

/**
 * Server Action: Masuk sistem (Login) dengan verifikasi kredensial.
 */
export async function loginAction(
  input: LoginInput
): Promise<ActionResponse<{ user: SessionData; redirectUrl?: string }>> {
  try {
    const parseResult = loginSchema.safeParse(input);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Format data login tidak valid";
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: firstError,
      };
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    const dbUrl = process.env.DATABASE_URL || "";
    const isPlaceholderDb =
      !dbUrl ||
      dbUrl.includes("placeholder") ||
      dbUrl.includes("ep-example") ||
      dbUrl.includes("localhost:5432/trasec_dev");

    let authenticatedUser: SessionData | null = null;

    if (isPlaceholderDb) {
      // Demo Fallback Authentication
      const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
      if (demoAccount && (password === demoAccount.passwordMatch || password === "Password123!")) {
        authenticatedUser = {
          userId: `usr-${demoAccount.role.toLowerCase()}-${normalizedEmail.split("@")[0].replace(/[^a-z0-9]/g, "-")}`,
          name: demoAccount.name,
          email: normalizedEmail,
          role: demoAccount.role,
          isVerifiedVolunteer: demoAccount.isVerified,
        };
      } else {
        return {
          ok: false,
          code: "UNAUTHORIZED",
          message: "Email atau kata sandi tidak cocok.",
        };
      }
    } else {
      // Database Riil via Bcrypt
      const authRes = await authenticateUser({ email: normalizedEmail, password });
      if (!authRes.success) {
        return {
          ok: false,
          code: "UNAUTHORIZED",
          message: authRes.error,
        };
      }
      authenticatedUser = authRes.user;
    }

    // Simpan ke sesi terenkripsi iron-session
    const session = await getSession();
    session.userId = authenticatedUser.userId;
    session.name = authenticatedUser.name;
    session.email = authenticatedUser.email;
    session.role = authenticatedUser.role;
    session.isVerifiedVolunteer = authenticatedUser.isVerifiedVolunteer;
    await session.save();

    revalidatePath("/");
    revalidatePath("/lapor");
    revalidatePath("/verifikasi");
    revalidatePath("/admin");

    return {
      ok: true,
      data: {
        user: authenticatedUser,
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat proses masuk";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: msg,
    };
  }
}

/**
 * Server Action: Pendaftaran relawan baru.
 */
export async function registerAction(
  input: RegisterInput
): Promise<ActionResponse<{ user: SessionData }>> {
  try {
    const parseResult = registerSchema.safeParse(input);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Format data pendaftaran tidak valid";
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: firstError,
      };
    }

    const dbUrl = process.env.DATABASE_URL || "";
    const isPlaceholderDb =
      !dbUrl ||
      dbUrl.includes("placeholder") ||
      dbUrl.includes("ep-example") ||
      dbUrl.includes("localhost:5432/trasec_dev");

    let registeredUser: SessionData | null = null;

    if (isPlaceholderDb) {
      registeredUser = {
        userId: `usr-relawan-new-${Date.now()}`,
        name: parseResult.data.name.trim(),
        email: parseResult.data.email.toLowerCase().trim(),
        role: "RELAWAN",
        isVerifiedVolunteer: false,
      };
    } else {
      const authRes = await registerVolunteer(parseResult.data);
      if (!authRes.success) {
        return {
          ok: false,
          code: "CONFLICT",
          message: authRes.error,
        };
      }
      registeredUser = authRes.user;
    }

    // Masuk otomatis setelah pendaftaran berhasil
    const session = await getSession();
    session.userId = registeredUser.userId;
    session.name = registeredUser.name;
    session.email = registeredUser.email;
    session.role = registeredUser.role;
    session.isVerifiedVolunteer = registeredUser.isVerifiedVolunteer;
    await session.save();

    revalidatePath("/");

    return {
      ok: true,
      data: {
        user: registeredUser,
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar akun relawan";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: msg,
    };
  }
}

/**
 * Server Action: Keluar sistem (Logout).
 */
export async function logoutAction(): Promise<ActionResponse<{ message: string }>> {
  try {
    await destroySession();
    revalidatePath("/");
    return {
      ok: true,
      data: {
        message: "Sesi berhasil diakhiri.",
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengakhiri sesi";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: msg,
    };
  }
}

