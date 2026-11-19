export const MAX_REVISIONS = 3;

export type ReportStatus =
  | "PENDING"
  | "VERIFIED"
  | "NEEDS_REVISION"
  | "REJECTED_FINAL";

export type VerificationLevel = "COMMUNITY" | "OFFICIAL";

export interface ReportState {
  status: ReportStatus;
  revisionCount: number;
  verificationCount: number;
  reporterId: string;
  previousVerifierIds?: string[];
}

export interface VerifierAction {
  type: "APPROVE" | "REJECT";
  verifierId: string;
  note?: string;
  isFromVerifiedOrg: boolean;
  orgName?: string;
}

export interface TransitionResult {
  nextStatus: ReportStatus;
  verificationLevel: VerificationLevel | null;
  verificationCount: number;
  note?: string;
}

/**
 * Mesin transisi status laporan.
 * Mengatur alur: PENDING -> VERIFIED / NEEDS_REVISION / REJECTED_FINAL.
 * Penolakan wajib memiliki catatan alasan minimal 10 karakter.
 */
export function evaluateReportTransition(
  currentState: ReportState,
  action: VerifierAction
): TransitionResult {
  // 1. Verifikator dilarang memverifikasi laporannya sendiri
  if (action.verifierId === currentState.reporterId) {
    throw new Error("Verifikator tidak boleh memverifikasi laporannya sendiri");
  }

  // 2. Tindakan Penolakan (REJECT)
  if (action.type === "REJECT") {
    if (!action.note || action.note.trim().length < 10) {
      throw new Error("Alasan wajib diisi minimal 10 karakter");
    }

    if (currentState.revisionCount < MAX_REVISIONS) {
      return {
        nextStatus: "NEEDS_REVISION",
        verificationLevel: null,
        verificationCount: 0,
        note: action.note.trim(),
      };
    } else {
      return {
        nextStatus: "REJECTED_FINAL",
        verificationLevel: null,
        verificationCount: 0,
        note: action.note.trim(),
      };
    }
  }

  // 3. Tindakan Persetujuan (APPROVE)
  if (currentState.previousVerifierIds?.includes(action.verifierId)) {
    throw new Error("Verifikator yang sama sudah pernah memberikan persetujuan");
  }

  // Verifikasi tingkat OFFICIAL (oleh lembaga resmi terverifikasi) langsung memvalidasi laporan
  if (action.isFromVerifiedOrg) {
    return {
      nextStatus: "VERIFIED",
      verificationLevel: "OFFICIAL",
      verificationCount: currentState.verificationCount + 1,
      note: action.note?.trim(),
    };
  }

  // Verifikasi tingkat COMMUNITY (butuh 2 verifikator berbeda)
  const newVerificationCount = currentState.verificationCount + 1;

  if (newVerificationCount >= 2) {
    return {
      nextStatus: "VERIFIED",
      verificationLevel: "COMMUNITY",
      verificationCount: newVerificationCount,
      note: action.note?.trim(),
    };
  } else {
    return {
      nextStatus: "PENDING",
      verificationLevel: null,
      verificationCount: newVerificationCount,
      note: action.note?.trim(),
    };
  }
}

/**
 * Evaluasi pengiriman revisi oleh pelapor.
 * Hanya pelapor asli yang berhak merevisi laporan berstatus NEEDS_REVISION.
 */
export function evaluateRevisionSubmission(
  currentState: ReportState,
  submittingUserId: string
): {
  nextStatus: "PENDING";
  nextRevisionCount: number;
  resetVerificationCount: number;
} {
  if (submittingUserId !== currentState.reporterId) {
    throw new Error("Hanya pelapor asli yang berhak mengirimkan revisi");
  }

  if (currentState.status !== "NEEDS_REVISION") {
    throw new Error("Hanya laporan berstatus NEEDS_REVISION yang dapat direvisi");
  }

  if (currentState.revisionCount >= MAX_REVISIONS) {
    throw new Error("Batas maksimal 3 kali revisi telah terlampaui");
  }

  return {
    nextStatus: "PENDING",
    nextRevisionCount: currentState.revisionCount + 1,
    resetVerificationCount: 0,
  };
}

