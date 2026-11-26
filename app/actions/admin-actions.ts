"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { canAdmin } from "@/lib/access";
import { recordServerAuditLog } from "@/lib/audit-log";
import type { ActionResponse } from "@/lib/types";

export interface UpdateUserRoleInput {
  userId: string;
  role: "ADMIN" | "VERIFIKATOR" | "RELAWAN";
  isVerifiedVolunteer?: boolean;
}

export interface VerifyOrganizationInput {
  organizationId: string;
  isVerified: boolean;
}

/**
 * Server Action: Mengubah peran pengguna atau status relawan terpercaya.
 * Khusus peran ADMIN.
 */
export async function updateUserRoleAction(
  input: UpdateUserRoleInput
): Promise<ActionResponse<{ message: string }>> {
  try {
    const session = await getSession();
    if (!session || !canAdmin(session)) {
      return {
        ok: false,
        code: "FORBIDDEN",
        message: "Akses ditolak: Hanya ADMIN yang berhak mengubah peran pengguna.",
      };
    }

    const { userId, role, isVerifiedVolunteer } = input;

    const dbUrl = process.env.DATABASE_URL || "";
    const isPlaceholderDb =
      !dbUrl ||
      dbUrl.includes("placeholder") ||
      dbUrl.includes("ep-example") ||
      dbUrl.includes("localhost:5432/trasec_dev");

    if (isPlaceholderDb) {
      recordServerAuditLog({
        actorId: session.userId || "unknown",
        actorRole: session.role || "ADMIN",
        action: "ROLE_CHANGE",
        targetId: userId,
        fromState: "UNKNOWN",
        toState: role,
        reason: "Perubahan peran melalui panel Admin (mode demo)",
      });
      return {
        ok: true,
        data: {
          message: `Peran pengguna berhasil diperbarui menjadi ${role}.`,
        },
      };
    }

    const prevUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        ...(isVerifiedVolunteer !== undefined ? { isVerifiedVolunteer } : {}),
      },
    });

    recordServerAuditLog({
      actorId: session.userId || "unknown",
      actorRole: session.role || "ADMIN",
      action: "ROLE_CHANGE",
      targetId: userId,
      fromState: prevUser?.role || "UNKNOWN",
      toState: role,
      reason: "Pembaruan peran akun oleh Administrator",
    });

    revalidatePath("/admin");
    return {
      ok: true,
      data: {
        message: "Pengaturan akun pengguna berhasil disimpan.",
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui peran pengguna";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: msg,
    };
  }
}

/**
 * Server Action: Memvalidasi atau membatalkan verifikasi lembaga kemanusiaan.
 * Khusus peran ADMIN.
 */
export async function verifyOrganizationAction(
  input: VerifyOrganizationInput
): Promise<ActionResponse<{ message: string }>> {
  try {
    const session = await getSession();
    if (!session || !canAdmin(session)) {
      return {
        ok: false,
        code: "FORBIDDEN",
        message: "Akses ditolak: Hanya ADMIN yang berhak memverifikasi lembaga.",
      };
    }

    const { organizationId, isVerified } = input;

    const dbUrl = process.env.DATABASE_URL || "";
    const isPlaceholderDb =
      !dbUrl ||
      dbUrl.includes("placeholder") ||
      dbUrl.includes("ep-example") ||
      dbUrl.includes("localhost:5432/trasec_dev");

    if (isPlaceholderDb) {
      return {
        ok: true,
        data: {
          message: isVerified
            ? "Lembaga berhasil diverifikasi resmi (hak verifikasi OFFICIAL aktif)."
            : "Status verifikasi resmi lembaga dibatalkan.",
        },
      };
    }

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
        verifiedById: isVerified ? session.userId : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/verifikasi");

    return {
      ok: true,
      data: {
        message: isVerified
          ? "Lembaga berhasil diverifikasi resmi."
          : "Status verifikasi lembaga dibatalkan.",
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui verifikasi lembaga";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: msg,
    };
  }
}

