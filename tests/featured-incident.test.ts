import { describe, it, expect } from "vitest";
import {
  selectFeaturedIncident,
  sortReportsDeterministically,
  getThematicDocumentaryImage,
} from "@/lib/featured-incident";
import { FALLBACK_REPORTS } from "@/lib/fallback-data";
import type { PublicReportItem } from "@/lib/public-queries";

describe("Deterministic Featured Incident Selection (featured-incident.test.ts)", () => {
  it("mengembalikan null jika tidak ada laporan", () => {
    expect(selectFeaturedIncident([])).toBeNull();
  });

  it("memilih DARURAT di atas MENDESAK dan TERENCANA secara deterministik", () => {
    const featured = selectFeaturedIncident(FALLBACK_REPORTS);
    expect(featured).not.toBeNull();
    expect(featured?.urgency).toBe("DARURAT");
    expect(featured?.id).toBe("rep-cianjur-sample");
  });

  it("mengurutkan berdasarkan updatedAt terbaru jika urgensi sama", () => {
    const older: PublicReportItem = {
      ...FALLBACK_REPORTS[1],
      id: "rep-older",
      urgency: "DARURAT",
      updatedAt: new Date("2026-11-10T00:00:00Z"),
    };
    const newer: PublicReportItem = {
      ...FALLBACK_REPORTS[1],
      id: "rep-newer",
      urgency: "DARURAT",
      updatedAt: new Date("2026-11-20T00:00:00Z"),
    };

    const sorted = sortReportsDeterministically([older, newer]);
    expect(sorted[0].id).toBe("rep-newer");
  });

  it("memprioritaskan kategori LINGKUNGAN atau BENCANA jika urgensi dan updatedAt sama", () => {
    const sameDate = new Date("2026-11-18T00:00:00Z");
    const pendidikan: PublicReportItem = {
      ...FALLBACK_REPORTS[0],
      id: "rep-pend",
      category: "PENDIDIKAN",
      urgency: "MENDESAK",
      updatedAt: sameDate,
    };
    const lingkungan: PublicReportItem = {
      ...FALLBACK_REPORTS[0],
      id: "rep-ling",
      category: "LINGKUNGAN",
      urgency: "MENDESAK",
      updatedAt: sameDate,
    };

    const sorted = sortReportsDeterministically([pendidikan, lingkungan]);
    expect(sorted[0].id).toBe("rep-ling");
  });

  it("memetakan aset foto dokumenter terkurasi sesuai kategori", () => {
    const envAsset = getThematicDocumentaryImage("LINGKUNGAN");
    expect(envAsset.src).toContain("/images/landing/");
    expect(envAsset.attribution).toContain("Arsip Kurasi TILARA");
  });

  it("menyaring keluar laporan non-VERIFIED (PENDING/NEEDS_REVISION/REJECTED_FINAL)", () => {
    const pending = {
      ...FALLBACK_REPORTS[0],
      id: "rep-pending-leak",
      status: "PENDING" as unknown as "VERIFIED",
    };
    const result = sortReportsDeterministically([pending, ...FALLBACK_REPORTS]);
    expect(result.find((r) => r.id === "rep-pending-leak")).toBeUndefined();
    expect(result.every((r) => r.status === "VERIFIED")).toBe(true);
  });
});

