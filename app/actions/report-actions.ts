"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createReportSchema, type CreateReportInput } from "@/lib/validators";
import { calculateTrustScore } from "@/lib/trust-score";
import { isTrustedVolunteer } from "@/lib/trust";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResponse } from "@/lib/types";

export interface CreateReportResponseData {
  id: string;
  isDuplicate: boolean;
  message: string;
}

/**
 * Server Action untuk mengajukan laporan kemanusiaan 5W+1H baru.
 * Menegakkan autentikasi relawan, validasi Zod ketat, perhitungan skor kepercayaan,
 * dan idempotensi pengiriman clientId UUID v4.
 */
export async function createReportAction(
  rawInput: CreateReportInput
): Promise<ActionResponse<CreateReportResponseData>> {
  const session = await getSession();

  if (!session || !session.userId) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Anda wajib masuk (login) sebagai relawan untuk mengajukan laporan.",
    };
  }

  // 0. Rate limiting per pengguna untuk mencegah spam laporan (/lapor)
  const rateCheck = await checkRateLimit(`lapor:${session.userId}`, 10, 10 * 60 * 1000);
  if (!rateCheck.allowed) {
    return {
      ok: false,
      code: "RATE_LIMITED",
      message: "Terlalu banyak pengajuan laporan dalam waktu singkat. Silakan tunggu beberapa menit.",
    };
  }

  // 1. Validasi Zod komposit
  const parsed = createReportSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Data laporan tidak memenuhi kriteria kelengkapan 5W+1H.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Cek apakah database dalam mode placeholder/fallback
  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  if (isPlaceholderDb) {
    return {
      ok: true,
      data: {
        id: `mock-rep-${Date.now()}`,
        isDuplicate: false,
        message: "Laporan berhasil diajukan dalam mode demonstrasi.",
      },
    };
  }

  try {
    // 2. Idempotency Check (UUID v4 clientId)
    const existing = await prisma.report.findUnique({
      where: { clientId: data.clientId },
      select: { id: true },
    });

    if (existing) {
      return {
        ok: true,
        data: {
          id: existing.id,
          isDuplicate: true,
          message: "Laporan ini telah tercatat sebelumnya (pengiriman idempoten).",
        },
      };
    }

    // 3. Evaluasi Parameter Skor Kepercayaan
    const [trustedVolunteer, userRecord, nearbyCount] = await Promise.all([
      isTrustedVolunteer(session.userId),
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { phone: true },
      }),
      prisma.report.count({
        where: {
          regionId: data.regionId,
          status: "VERIFIED",
        },
      }),
    ]);

    const trustResult = calculateTrustScore({
      hasPhotoEvidence: Boolean(data.hasPhotoEvidence),
      hasNearbyReportsWithin2Km: nearbyCount > 0,
      isTrustedReporter: trustedVolunteer,
      hasSubstantive5W1H: true, // Telah divalidasi skema Zod lengkap
      hasVerifiedContact: Boolean(userRecord?.phone),
    });

    // 4. Simpan ke database dalam transaksi
    const newReport = await prisma.$transaction(async (tx) => {
      const created = await tx.report.create({
        data: {
          clientId: data.clientId,
          title: data.title,
          type: data.type,
          category: data.category,
          urgency: data.urgency,
          status: "PENDING",
          trustScore: trustResult.score,
          trustScoreReasons: JSON.stringify(trustResult.reasons),
          latitude: data.latitude,
          longitude: data.longitude,
          regionId: data.regionId,
          reporterId: session.userId!,
          what: data.what,
          who: data.who,
          whereDescription: data.whereDescription,
          when: new Date(data.when),
          why: data.why,
          how: data.how,
          needs:
            data.type === "KEBUTUHAN" && data.needs.length > 0
              ? {
                  create: data.needs.map((n) => ({
                    itemCategory: n.itemCategory.trim().toUpperCase(),
                    unit: n.unit.trim().toLowerCase(),
                    qty: n.qty,
                    kind: n.kind,
                  })),
                }
              : undefined,
        },
        select: { id: true },
      });

      return created;
    });

    revalidatePath("/");
    revalidatePath("/verifikasi");

    return {
      ok: true,
      data: {
        id: newReport.id,
        isDuplicate: false,
        message: "Laporan berhasil diajukan dan sedang dalam antrean verifikasi faktual.",
      },
    };
  } catch (error) {
    console.error("Galat saat membuat laporan:", error);
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: "Gagal menyimpan laporan kemanusiaan ke database. Silakan coba kembali.",
    };
  }
}
