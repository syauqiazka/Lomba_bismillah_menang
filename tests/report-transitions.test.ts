import { describe, it, expect } from "vitest";
import {
  evaluateReportTransition,
  evaluateRevisionSubmission,
  MAX_REVISIONS,
  type ReportState,
  type VerifierAction,
} from "@/lib/report-transitions";

describe("Domain Logic: Mesin Transisi Status Laporan (report-transitions.ts)", () => {
  it("konstanta MAX_REVISIONS harus bernilai 3", () => {
    expect(MAX_REVISIONS).toBe(3);
  });

  it("laporan PENDING yang disetujui verifikator lembaga resmi langsung menjadi VERIFIED (OFFICIAL)", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 0,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const action: VerifierAction = {
      type: "APPROVE",
      verifierId: "verifier-1",
      isFromVerifiedOrg: true,
      orgName: "BPBD Wilayah A",
    };

    const result = evaluateReportTransition(currentState, action);
    expect(result.nextStatus).toBe("VERIFIED");
    expect(result.verificationLevel).toBe("OFFICIAL");
    expect(result.verificationCount).toBe(1);
  });

  it("laporan PENDING yang baru menerima 1 persetujuan verifikator komunitas tetap PENDING dengan counter 1", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 0,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const action: VerifierAction = {
      type: "APPROVE",
      verifierId: "verifier-1",
      isFromVerifiedOrg: false,
    };

    const result = evaluateReportTransition(currentState, action);
    expect(result.nextStatus).toBe("PENDING");
    expect(result.verificationLevel).toBeNull();
    expect(result.verificationCount).toBe(1);
  });

  it("laporan PENDING yang menerima persetujuan kedua dari verifikator berbeda beralih menjadi VERIFIED (COMMUNITY)", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 0,
      verificationCount: 1,
      reporterId: "user-1",
      previousVerifierIds: ["verifier-1"],
    };

    const action: VerifierAction = {
      type: "APPROVE",
      verifierId: "verifier-2",
      isFromVerifiedOrg: false,
    };

    const result = evaluateReportTransition(currentState, action);
    expect(result.nextStatus).toBe("VERIFIED");
    expect(result.verificationLevel).toBe("COMMUNITY");
    expect(result.verificationCount).toBe(2);
  });

  it("verifikator dilarang menyetujui laporannya sendiri", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 0,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const action: VerifierAction = {
      type: "APPROVE",
      verifierId: "user-1", // ID sama dengan pelapor
      isFromVerifiedOrg: false,
    };

    expect(() => evaluateReportTransition(currentState, action)).toThrow(
      "Verifikator tidak boleh memverifikasi laporannya sendiri"
    );
  });

  it("verifikator yang sama dilarang menyetujui dua kali pada laporan komunitas", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 0,
      verificationCount: 1,
      reporterId: "user-1",
      previousVerifierIds: ["verifier-1"],
    };

    const action: VerifierAction = {
      type: "APPROVE",
      verifierId: "verifier-1", // Verifikator sama
      isFromVerifiedOrg: false,
    };

    expect(() => evaluateReportTransition(currentState, action)).toThrow(
      "Verifikator yang sama sudah pernah memberikan persetujuan"
    );
  });

  it("penolakan wajib menyertakan alasan tertulis minimal 10 karakter", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 0,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const actionWithShortNote: VerifierAction = {
      type: "REJECT",
      verifierId: "verifier-1",
      note: "Kurang", // Kurang dari 10 karakter
      isFromVerifiedOrg: false,
    };

    expect(() => evaluateReportTransition(currentState, actionWithShortNote)).toThrow(
      "Alasan wajib diisi minimal 10 karakter"
    );
  });

  it("penolakan ketika revisionCount < 3 menghasilkan status NEEDS_REVISION", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 1,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const action: VerifierAction = {
      type: "REJECT",
      verifierId: "verifier-1",
      note: "Foto bukti buram dan patokan lokasi kurang jelas.",
      isFromVerifiedOrg: false,
    };

    const result = evaluateReportTransition(currentState, action);
    expect(result.nextStatus).toBe("NEEDS_REVISION");
  });

  it("penolakan ketika revisionCount sudah mencapai 3 menghasilkan REJECTED_FINAL", () => {
    const currentState: ReportState = {
      status: "PENDING",
      revisionCount: 3,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const action: VerifierAction = {
      type: "REJECT",
      verifierId: "verifier-1",
      note: "Batas maksimal 3 kali revisi telah terlampaui tanpa perbaikan valid.",
      isFromVerifiedOrg: false,
    };

    const result = evaluateReportTransition(currentState, action);
    expect(result.nextStatus).toBe("REJECTED_FINAL");
  });

  it("pengiriman revisi oleh pelapor mengubah status kembali ke PENDING dan menaikkan revisionCount", () => {
    const currentState: ReportState = {
      status: "NEEDS_REVISION",
      revisionCount: 1,
      verificationCount: 0,
      reporterId: "user-1",
    };

    const result = evaluateRevisionSubmission(currentState, "user-1");
    expect(result.nextStatus).toBe("PENDING");
    expect(result.nextRevisionCount).toBe(2);
    expect(result.resetVerificationCount).toBe(0);
  });

  it("pengguna lain dilarang mengirimkan revisi atas laporan milik orang lain", () => {
    const currentState: ReportState = {
      status: "NEEDS_REVISION",
      revisionCount: 1,
      verificationCount: 0,
      reporterId: "user-1",
    };

    expect(() => evaluateRevisionSubmission(currentState, "user-2")).toThrow(
      "Hanya pelapor asli yang berhak mengirimkan revisi"
    );
  });
});
