import { describe, it, expect } from "vitest";
import {
  calculateTrustScore,
  type TrustScoreFactors,
} from "@/lib/trust-score";

describe("Domain Logic: Skor Kepercayaan Deterministik (trust-score.ts)", () => {
  it("harus menghasilkan skor 0 dan daftar alasan jika tidak ada faktor yang terpenuhi", () => {
    const factors: TrustScoreFactors = {
      hasPhotoEvidence: false,
      hasNearbyReportsWithin2Km: false,
      isTrustedReporter: false,
      hasSubstantive5W1H: false,
      hasVerifiedContact: false,
    };

    const result = calculateTrustScore(factors);
    expect(result.score).toBe(0);
    expect(result.reasons).toHaveLength(5);
    expect(result.reasons.every((r) => r.points === 0)).toBe(true);
  });

  it("harus menghitung poin penuh (100) dan mencantumkan seluruh alasan penambah", () => {
    const factors: TrustScoreFactors = {
      hasPhotoEvidence: true,            // +30
      hasNearbyReportsWithin2Km: true,   // +20
      isTrustedReporter: true,           // +20
      hasSubstantive5W1H: true,          // +15
      hasVerifiedContact: true,          // +15
    };

    const result = calculateTrustScore(factors);
    expect(result.score).toBe(100);
    expect(result.reasons).toHaveLength(5);
    expect(result.reasons.find((r) => r.factor === "hasPhotoEvidence")?.points).toBe(30);
    expect(result.reasons.find((r) => r.factor === "hasNearbyReportsWithin2Km")?.points).toBe(20);
    expect(result.reasons.find((r) => r.factor === "isTrustedReporter")?.points).toBe(20);
    expect(result.reasons.find((r) => r.factor === "hasSubstantive5W1H")?.points).toBe(15);
    expect(result.reasons.find((r) => r.factor === "hasVerifiedContact")?.points).toBe(15);
  });

  it("harus menghasilkan skor parsial dan alasan transparan jika hanya sebagian faktor terpenuhi", () => {
    const factors: TrustScoreFactors = {
      hasPhotoEvidence: true,            // +30
      hasNearbyReportsWithin2Km: false,  // 0
      isTrustedReporter: true,           // +20
      hasSubstantive5W1H: true,          // +15
      hasVerifiedContact: false,         // 0
    };

    const result = calculateTrustScore(factors);
    expect(result.score).toBe(65);
    
    const photoReason = result.reasons.find((r) => r.factor === "hasPhotoEvidence");
    expect(photoReason?.points).toBe(30);
    expect(photoReason?.description).toContain("Foto terlampir");

    const nearbyReason = result.reasons.find((r) => r.factor === "hasNearbyReportsWithin2Km");
    expect(nearbyReason?.points).toBe(0);
    expect(nearbyReason?.description).toContain("Belum ada laporan lain");
  });

  it("skor tidak boleh melebihi 100 atau di bawah 0", () => {
    const factors: TrustScoreFactors = {
      hasPhotoEvidence: true,
      hasNearbyReportsWithin2Km: true,
      isTrustedReporter: true,
      hasSubstantive5W1H: true,
      hasVerifiedContact: true,
    };

    const result = calculateTrustScore(factors);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});

