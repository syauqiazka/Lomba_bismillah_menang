"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { recordAidTransaction } from "@/lib/aid-transaction";
import type { ActionResponse } from "@/lib/types";

export interface SubmitAidPayload {
  reportId: string;
  itemCategory: string;
  unit: string;
  qty: number;
  clientId: string;
  organizationId?: string | null;
}

export interface SubmitAidResponseData {
  id: string;
  status: "CONFIRMED" | "PENDING" | "REJECTED";
  message: string;
}

/**
 * Server Action untuk mencatat penyaluran bantuan relawan pada laporan kemanusiaan.
 * Menjalankan validasi sesi, proteksi alokasi berlebih, dan transaksi serializable.
 */
export async function submitAidAction(
  payload: SubmitAidPayload
): Promise<ActionResponse<SubmitAidResponseData>> {
  const session = await getSession();

  if (!session || !session.userId) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Anda wajib masuk (login) sebagai relawan untuk mencatat penyaluran bantuan.",
    };
  }

  try {
    const result = await recordAidTransaction({
      clientId: payload.clientId,
      reportId: payload.reportId,
      userId: session.userId,
      itemCategory: payload.itemCategory,
      unit: payload.unit,
      qty: payload.qty,
      organizationId: payload.organizationId,
    });

    if (!result.success) {
      const isValidationError =
        result.code === "LIMIT_EXCEEDED" ||
        result.code === "INVALID_INPUT" ||
        result.code === "NEED_NOT_FOUND";

      return {
        ok: false,
        code: isValidationError ? "VALIDATION_ERROR" : "CONFLICT",
        message: result.error,
      };
    }

    revalidatePath(`/laporan/${payload.reportId}`);
    revalidatePath("/");

    return {
      ok: true,
      data: {
        id: result.aid.id,
        status: result.aid.status,
        message: result.message,
      },
    };
  } catch (error) {
    console.error("Galat saat mencatat transaksi bantuan:", error);
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: "Terjadi kesalahan internal sistem saat memproses bantuan. Silakan coba kembali.",
    };
  }
}

