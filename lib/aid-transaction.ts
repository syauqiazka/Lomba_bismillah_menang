import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma, Aid } from "@prisma/client";
import { validateAidLimit } from "@/lib/calculations";
import { isTrustedVolunteer } from "@/lib/trust";

export interface RecordAidInput {
  clientId: string;
  reportId: string;
  userId: string;
  itemCategory: string;
  unit: string;
  qty: number;
  organizationId?: string | null;
  submittedOfflineAt?: Date | null;
}

export interface RecordAidSuccess {
  success: true;
  aid: Aid;
  isDuplicate: boolean;
  message: string;
}

export interface RecordAidFailure {
  success: false;
  error: string;
  code:
    | "INVALID_INPUT"
    | "REPORT_NOT_FOUND"
    | "INVALID_REPORT_TYPE"
    | "REPORT_NOT_VERIFIED"
    | "NEED_NOT_FOUND"
    | "LIMIT_EXCEEDED"
    | "CONCURRENCY_ERROR";
}

export type RecordAidResult = RecordAidSuccess | RecordAidFailure;

/**
 * Mencatat bantuan relawan dengan transaksi serializable dan proteksi race condition.
 * Memastikan alokasi bantuan tidak melebihi sisa kebutuhan riil dan mendukung pengiriman
 * idempoten melalui clientId (UUID v4).
 */
export async function recordAidTransaction(
  input: RecordAidInput,
  prismaClient = prisma
): Promise<RecordAidResult> {
  // 1. Validasi masukan dasar
  if (!input.clientId || typeof input.clientId !== "string" || input.clientId.trim().length === 0) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "ClientId (UUID v4) wajib disertakan untuk idempotensi.",
    };
  }

  if (!input.reportId || typeof input.reportId !== "string" || input.reportId.trim().length === 0) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "ID laporan kemanusiaan wajib disertakan.",
    };
  }

  if (!input.userId || typeof input.userId !== "string" || input.userId.trim().length === 0) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "ID relawan pencatat wajib disertakan.",
    };
  }

  if (!input.itemCategory || typeof input.itemCategory !== "string" || input.itemCategory.trim().length === 0) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "Kategori logistik bantuan wajib disertakan.",
    };
  }

  if (!input.unit || typeof input.unit !== "string" || input.unit.trim().length === 0) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "Satuan logistik bantuan wajib disertakan.",
    };
  }

  if (typeof input.qty !== "number" || input.qty <= 0 || !Number.isInteger(input.qty)) {
    return {
      success: false,
      code: "INVALID_INPUT",
      error: "Kuantitas bantuan harus berupa bilangan bulat positif lebih besar dari 0.",
    };
  }

  try {
    return await prismaClient.$transaction(
      async (tx) => {
        // a. Idempotency Check: apakah clientId sudah pernah tercatat?
        const existingAid = await tx.aid.findUnique({
          where: { clientId: input.clientId.trim() },
        });

        if (existingAid) {
          return {
            success: true,
            aid: existingAid,
            isDuplicate: true,
            message: "Bantuan sudah tercatat sebelumnya (idempoten).",
          };
        }

        // b. Ambil data laporan
        const report = await tx.report.findUnique({
          where: { id: input.reportId },
          select: {
            id: true,
            type: true,
            status: true,
          },
        });

        if (!report) {
          return {
            success: false,
            code: "REPORT_NOT_FOUND",
            error: "Laporan kemanusiaan tidak ditemukan.",
          };
        }

        // c. Aturan Bisnis: Tipe PEMANTAUAN dilarang memiliki Aid
        if (report.type !== "KEBUTUHAN") {
          return {
            success: false,
            code: "INVALID_REPORT_TYPE",
            error: "Laporan bertipe PEMANTAUAN tidak dapat menerima catatan penyaluran bantuan.",
          };
        }

        // d. Aturan Bisnis: Laporan wajib berstatus VERIFIED
        if (report.status !== "VERIFIED") {
          return {
            success: false,
            code: "REPORT_NOT_VERIFIED",
            error: "Bantuan hanya dapat dicatat pada laporan yang telah berstatus VERIFIED.",
          };
        }

        // e. Validasi Need: ambil item kebutuhan laporan untuk verifikasi pasangan (itemCategory, unit)
        const reportNeeds = await tx.need.findMany({
          where: { reportId: input.reportId },
          select: { itemCategory: true, unit: true, qty: true },
        });

        const normCategory = input.itemCategory.trim().toUpperCase();
        const normUnit = input.unit.trim().toLowerCase();

        const matchingNeeds = reportNeeds.filter(
          (n) =>
            n.itemCategory.trim().toUpperCase() === normCategory &&
            n.unit.trim().toLowerCase() === normUnit
        );

        const totalNeed = matchingNeeds.reduce((sum, n) => sum + n.qty, 0);

        if (totalNeed <= 0) {
          return {
            success: false,
            code: "NEED_NOT_FOUND",
            error: `Kebutuhan untuk kategori '${input.itemCategory}' dengan satuan '${input.unit}' tidak terdaftar pada laporan ini.`,
          };
        }

        // Gunakan nama kategori dan satuan kanonikal dari database
        const canonicalCategory = matchingNeeds[0].itemCategory;
        const canonicalUnit = matchingNeeds[0].unit;

        // f. Hitung bantuan yang telah CONFIRMED untuk pasangan (itemCategory, unit) ini
        const confirmedAids = await tx.aid.findMany({
          where: {
            reportId: input.reportId,
            status: "CONFIRMED",
          },
          select: { itemCategory: true, unit: true, qty: true },
        });

        const totalConfirmed = confirmedAids
          .filter(
            (a) =>
              a.itemCategory.trim().toUpperCase() === normCategory &&
              a.unit.trim().toLowerCase() === normUnit
          )
          .reduce((sum, a) => sum + a.qty, 0);

        // g. Validasi batas kuota bantuan (tidak boleh melebihi sisa kebutuhan)
        const limitCheck = validateAidLimit({
          totalNeed,
          currentConfirmed: totalConfirmed,
          incomingQty: input.qty,
        });

        if (!limitCheck.isValid) {
          return {
            success: false,
            code: "LIMIT_EXCEEDED",
            error: limitCheck.error ?? "Jumlah bantuan melebihi sisa kebutuhan.",
          };
        }

        // h. Tentukan status bantuan secara deterministik
        // Relawan terpercaya langsung CONFIRMED, relawan baru PENDING
        const trusted = await isTrustedVolunteer(input.userId, tx);
        const aidStatus = trusted ? "CONFIRMED" : "PENDING";

        // i. Simpan data bantuan
        const createdAid = await tx.aid.create({
          data: {
            clientId: input.clientId.trim(),
            reportId: input.reportId,
            userId: input.userId,
            itemCategory: canonicalCategory,
            unit: canonicalUnit,
            qty: input.qty,
            status: aidStatus,
            organizationId: input.organizationId ?? null,
            submittedOfflineAt: input.submittedOfflineAt ?? null,
          },
        });

        return {
          success: true,
          aid: createdAid,
          isDuplicate: false,
          message: trusted
            ? "Bantuan berhasil dicatat dan langsung terkonfirmasi (Relawan Terpercaya)."
            : "Bantuan berhasil dicatat dan menunggu peninjauan verifikator (Relawan Baru).",
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      }
    );
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2034" || err.code === "P2002")
    ) {
      return {
        success: false,
        code: "CONCURRENCY_ERROR",
        error: "Terjadi benturan pencatatan bantuan bersamaan. Silakan coba kembali.",
      };
    }
    throw err;
  }
}

