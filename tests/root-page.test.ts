import { describe, it, expect } from "vitest";
import { FALLBACK_REPORTS, FALLBACK_AGGREGATES } from "@/lib/fallback-data";

describe("Root Route & UI Architecture: Opsi C Data Integrity (root-page.test.ts)", () => {
  it("seluruh data fallback wajib berstatus VERIFIED", () => {
    expect(FALLBACK_REPORTS.length).toBeGreaterThan(0);
    FALLBACK_REPORTS.forEach((rep) => {
      expect(rep.status).toBe("VERIFIED");
    });
  });

  it("laporan bertipe PEMANTAUAN dilarang memiliki item defisit logistik", () => {
    const pantau = FALLBACK_REPORTS.find((r) => r.type === "PEMANTAUAN");
    expect(pantau).toBeDefined();
    if (pantau) {
      expect(pantau.itemDeficits).toEqual([]);
      expect(pantau.overallDeficitStatus).toBeNull();
    }
  });

  it("kategori rentan (LANSIA) wajib dikaburkan koordinat dan deskripsi lokasinya", () => {
    const lansia = FALLBACK_REPORTS.find((r) => r.category === "LANSIA");
    expect(lansia).toBeDefined();
    if (lansia) {
      expect(lansia.isLocationBlurred).toBe(true);
      expect(lansia.whereDescription).toContain("disamarkan");
      // Cek bahwa latitude dan longitude tidak memiliki lebih dari 2 angka desimal
      const latDecimals = lansia.latitude.toString().split(".")[1]?.length || 0;
      const lngDecimals = lansia.longitude.toString().split(".")[1]?.length || 0;
      expect(latDecimals).toBeLessThanOrEqual(2);
      expect(lngDecimals).toBeLessThanOrEqual(2);
    }
  });

  it("agregat publik wajib menyajikan data angka ringkasan valid", () => {
    expect(FALLBACK_AGGREGATES.totalVerifiedReports).toBeGreaterThan(0);
    expect(FALLBACK_AGGREGATES.totalActiveRegions).toBeGreaterThan(0);
    expect(FALLBACK_AGGREGATES.totalConfirmedAidItems).toBeGreaterThan(0);
  });
});

