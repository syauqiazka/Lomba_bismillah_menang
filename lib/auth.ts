import "server-only";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validators";
import { SessionData } from "@/lib/session-options";

export type AuthResult =
  | { success: true; user: SessionData }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Otentikasi pengguna berdasarkan email dan kata sandi menggunakan bcrypt.
 */
export async function authenticateUser(
  input: LoginInput,
  prismaClient = prisma
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data login tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prismaClient.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
      isVerifiedVolunteer: true,
    },
  });

  if (!user) {
    return {
      success: false,
      error: "Email atau kata sandi tidak cocok.",
    };
  }

  const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      error: "Email atau kata sandi tidak cocok.",
    };
  }

  return {
    success: true,
    user: {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerifiedVolunteer: user.isVerifiedVolunteer,
    },
  };
}

/**
 * Pendaftaran akun relawan baru dengan validasi ketat dan hashing kata sandi.
 */
export async function registerVolunteer(
  input: RegisterInput,
  prismaClient = prisma
): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data pendaftaran tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase().trim();

  // Cek keunikan email
  const existingUser = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      success: false,
      error: "Alamat email ini sudah terdaftar. Silakan masuk.",
    };
  }

  // Hash kata sandi dengan salt rounds 10
  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone ? parsed.data.phone.trim() : null,
      password: hashedPassword,
      role: "RELAWAN",
      isVerifiedVolunteer: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerifiedVolunteer: true,
    },
  });

  return {
    success: true,
    user: {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isVerifiedVolunteer: newUser.isVerifiedVolunteer,
    },
  };
}
