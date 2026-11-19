"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { canVerify } from "@/lib/access";
import {
  reviewReportSchema,
  reviewAidSchema,
  type ReviewReportInput,
  type ReviewAidInput,
} from "@/lib/validators";
import {
  evaluateReportTransition,
  type ReportState,
  type TransitionResult,
} from "@/lib/report-transitions";
import { validateAidLimit } from "@/lib/calculations";
import { getVerifierOrgStatus } from "@/lib/verification-queries";
import type { ActionResponse } from "@/lib/types";

export interface ReviewReportResult {
  message: string;
  result: TransitionResult;
}

export interface ReviewAidResult {
  message: string;
  nextStatus: "CONFIRMED" | "REJECTED";
}

/**
 * Server Action: Meninjau dan memverifikasi laporan kemanusiaan.
 * Wewenang: VERIFIKATOR dan ADMIN.
 */
export async function reviewReportAction(
  input: ReviewReportInput
): Promise<ActionResponse<ReviewReportResult>> {
  try {
    const session = await getSession();
    if (!session || !session.userId || !canVerify(session)) {
      return {
        ok: false,
        code: "FORBIDDEN",
        message: "Akses ditolak: Hanya VERIFIKATOR atau ADMIN yang memiliki wewenang verifikasi.",
      };
    }

    const parseResult = reviewReportSchema.safeParse(input);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Input tinjauan laporan tidak valid";
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: firstError,
      };
    }

    const { reportId, decision, note } = parseResult.data;

    const dbUrl = process.env.DATABASE_URL || "";
    const isPlaceholderDb =
      !dbUrl ||
      dbUrl.includes("placeholder") ||
      dbUrl.includes("ep-example") ||
      dbUrl.includes("localhost:5432/trasec_dev");

    const orgStatus = await getVerifierOrgStatus(session.userId, session.email);

    if (isPlaceholderDb) {
      // Mock Fallback Execution
      const mockReporterId = "usr-relawan-baru";
      if (session.userId === mockReporterId) {
        return {
          ok: false,
          code: "FORBIDDEN",
          message: "Verifikator tidak boleh memverifikasi laporannya sendiri",
        };
      }

      const currentState: ReportState = {
        status: reportId.includes("revision") ? "NEEDS_REVISION" : "PENDING",
        revisionCount: reportId.includes("revision") ? 1 : 0,
        verificationCount: reportId.includes("community") ? 1 : 0,
        reporterId: mockReporterId,
        previousVerifierIds: reportId.includes("community") ? ["usr-verif-komunitas-1"] : [],
      };

      const result = evaluateReportTransition(currentState, {
        type: decision,
        verifierId: session.userId,
        note,
        isFromVerifiedOrg: orgStatus.isFromVerifiedOrg,
        orgName: orgStatus.orgName,
      });

      const message =
        decision === "APPROVE"
          ? result.nextStatus === "VERIFIED"
            ? `Laporan berhasil disetujui (${result.verificationLevel === "OFFICIAL" ? "Tingkat Resmi Lembaga" : "Tingkat Komunitas"})`
            : "Persetujuan pertama dicatat. Menunggu 1 verifikator komunitas lagi."
          : result.nextStatus === "NEEDS_REVISION"
          ? "Permintaan revisi berhasil dikirim ke pelapor."
          : "Laporan ditolak permanen (batas maksimal revisi terlampaui).";

      return {
        ok: true,
        data: {
          message,
          result,
        },
      };
    }

    // Eksekusi Database Riil
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        verifications: true,
      },
    });

    if (!report) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: "Laporan tidak ditemukan.",
      };
    }

    if (report.status !== "PENDING" && report.status !== "NEEDS_REVISION") {
      return {
        ok: false,
        code: "CONFLICT",
        message: `Laporan ini sudah berstatus ${report.status} dan tidak dapat ditinjau ulang.`,
      };
    }

    const previousVerifierIds = report.verifications
      .filter((v) => v.decision === "APPROVE")
      .map((v) => v.userId);

    const currentState: ReportState = {
      status: report.status,
      revisionCount: report.revisionCount,
      verificationCount: report.verificationCount,
      reporterId: report.reporterId,
      previousVerifierIds,
    };

    const transitionResult = evaluateReportTransition(currentState, {
      type: decision,
      verifierId: session.userId,
      note,
      isFromVerifiedOrg: orgStatus.isFromVerifiedOrg,
      orgName: orgStatus.orgName,
    });

    // Mutasi Database dalam Transaksi
    await prisma.$transaction(async (tx) => {
      // 1. Simpan catatan verifikasi
      await tx.verification.create({
        data: {
          reportId: report.id,
          userId: session.userId!,
          decision: decision,
          note: note?.trim() || null,
        },
      });

      // 2. Perbarui status laporan
      await tx.report.update({
        where: { id: report.id },
        data: {
          status: transitionResult.nextStatus,
          verificationLevel: transitionResult.verificationLevel,
          verificationCount: transitionResult.verificationCount,
          revisionCount:
            decision === "REJECT" && transitionResult.nextStatus === "NEEDS_REVISION"
              ? report.revisionCount + 1
              : report.revisionCount,
        },
      });
    });

    revalidatePath("/verifikasi");
    revalidatePath("/");
    revalidatePath(`/laporan/${reportId}`);

    const message =
      decision === "APPROVE"
        ? transitionResult.nextStatus === "VERIFIED"
          ? `Laporan berhasil disetujui (${transitionResult.verificationLevel === "OFFICIAL" ? "Tingkat Lembaga Resmi" : "Tingkat Komunitas"})`
          : "Persetujuan dicatat (1/2). Menunggu 1 verifikator komunitas lagi."
        : transitionResult.nextStatus === "NEEDS_REVISION"
        ? "Permintaan revisi berhasil dikirim ke pelapor."
        : "Laporan ditolak secara permanen.";

    return {
      ok: true,
      data: {
        message,
        result: transitionResult,
      },
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat memproses verifikasi";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: errorMsg,
    };
  }
}

/**
 * Server Action: Meninjau catatan bantuan relawan (Aid).
 * Verifikator dapat menyetujui (CONFIRM) atau menolak (REJECT).
 */
export async function reviewAidAction(
  input: ReviewAidInput
): Promise<ActionResponse<ReviewAidResult>> {
  try {
    const session = await getSession();
    if (!session || !session.userId || !canVerify(session)) {
      return {
        ok: false,
        code: "FORBIDDEN",
        message: "Akses ditolak: Hanya VERIFIKATOR atau ADMIN yang memiliki wewenang tinjauan bantuan.",
      };
    }

    const parseResult = reviewAidSchema.safeParse(input);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Input tinjauan bantuan tidak valid";
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: firstError,
      };
    }

    const { aidId, decision, note } = parseResult.data;

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
          message:
            decision === "CONFIRM"
              ? "Catatan bantuan relawan berhasil dikonfirmasi."
              : "Catatan bantuan relawan berhasil ditolak.",
          nextStatus: decision === "CONFIRM" ? "CONFIRMED" : "REJECTED",
        },
      };
    }

    // Eksekusi Database Riil
    const targetAid = await prisma.aid.findUnique({
      where: { id: aidId },
      include: {
        report: {
          include: {
            needs: true,
            aids: true,
          },
        },
      },
    });

    if (!targetAid) {
      return {
        ok: false,
        code: "NOT_FOUND",
        message: "Catatan bantuan tidak ditemukan.",
      };
    }

    if (targetAid.status !== "PENDING") {
      return {
        ok: false,
        code: "CONFLICT",
        message: `Catatan bantuan ini sudah berstatus ${targetAid.status}.`,
      };
    }

    if (decision === "CONFIRM") {
      // Hitung total kebutuhan dan total bantuan terkonfirmasi saat ini
      const matchingNeeds = targetAid.report.needs.filter(
        (n) => n.itemCategory === targetAid.itemCategory && n.unit === targetAid.unit
      );
      const totalNeed = matchingNeeds.reduce((sum, n) => sum + n.qty, 0);

      const matchingAids = targetAid.report.aids.filter(
        (a) =>
          a.status === "CONFIRMED" &&
          a.itemCategory === targetAid.itemCategory &&
          a.unit === targetAid.unit
      );
      const totalConfirmedAid = matchingAids.reduce((sum, a) => sum + a.qty, 0);

      const limitCheck = validateAidLimit({
        totalNeed,
        currentConfirmed: totalConfirmedAid,
        incomingQty: targetAid.qty,
      });

      if (!limitCheck.isValid) {
        return {
          ok: false,
          code: "CONFLICT",
          message:
            limitCheck.error ||
            `Jumlah bantuan (${targetAid.qty} ${targetAid.unit}) melampaui sisa kebutuhan yang tersedia (${limitCheck.remainingQuota} ${targetAid.unit}).`,
        };
      }

      await prisma.aid.update({
        where: { id: aidId },
        data: {
          status: "CONFIRMED",
        },
      });

      revalidatePath("/verifikasi");
      revalidatePath(`/laporan/${targetAid.reportId}`);
      revalidatePath("/");

      return {
        ok: true,
        data: {
          message: "Bantuan berhasil dikonfirmasi dan dimasukkan ke perhitungan selisih.",
          nextStatus: "CONFIRMED",
        },
      };
    } else {
      // REJECT
      await prisma.aid.update({
        where: { id: aidId },
        data: {
          status: "REJECTED",
          rejectionNote: note?.trim(),
        },
      });

      revalidatePath("/verifikasi");
      revalidatePath(`/laporan/${targetAid.reportId}`);

      return {
        ok: true,
        data: {
          message: "Catatan bantuan berhasil ditolak.",
          nextStatus: "REJECTED",
        },
      };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses tinjauan bantuan";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: errorMsg,
    };
  }
}
