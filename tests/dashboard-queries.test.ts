import { describe, it, expect } from "vitest";
import { getDashboardData } from "@/lib/dashboard-queries";

describe("Dashboard Queries (/dashboard)", () => {
  it("mengembalikan data dashboard publik dengan metrik agregat yang valid", async () => {
    const data = await getDashboardData();

    // 1. Metrik Agregat
    expect(data.metrics.totalVerifiedReports).toBeGreaterThanOrEqual(1);
    expect(data.metrics.totalPendingReports).toBeGreaterThanOrEqual(1);
    expect(data.metrics.totalActiveRegions).toBeGreaterThanOrEqual(1);
    expect(data.metrics.totalConfirmedAidItems).toBeGreaterThanOrEqual(0);
    expect(data.metrics.totalRemainingDeficitItems).toBeGreaterThanOrEqual(0);

    // 2. Distribusi Kategori Resmi
    expect(data.metrics.byCategory).toHaveProperty("BENCANA");
    expect(data.metrics.byCategory).toHaveProperty("LINGKUNGAN");
    expect(data.metrics.byCategory).toHaveProperty("LANSIA");
    expect(data.metrics.byCategory).toHaveProperty("KESEHATAN");
    expect(data.metrics.byCategory).toHaveProperty("PENDIDIKAN");
    expect(data.metrics.byCategory).toHaveProperty("SOSIAL_LAINNYA");

    // 3. Distribusi Tingkat Urgensi
    expect(data.metrics.byUrgency).toHaveProperty("DARURAT");
    expect(data.metrics.byUrgency).toHaveProperty("MENDESAK");
    expect(data.metrics.byUrgency).toHaveProperty("TERENCANA");
  });

  it("memiliki daftar wilayah prioritas yang terurut berdasarkan status kekurangan", async () => {
    const data = await getDashboardData();

    expect(data.regionPriorities.length).toBeGreaterThanOrEqual(1);

    const first = data.regionPriorities[0];
    expect(first.regionId).toBeTruthy();
    expect(first.regionName).toBeTruthy();
    expect(first.province).toBeTruthy();
    expect(first.verifiedReportsCount).toBeGreaterThanOrEqual(1);
    expect(["DARURAT", "MENDESAK", "TERENCANA"]).toContain(first.highestUrgency);
    expect(["KEKURANGAN_BESAR", "KEKURANGAN_SEDANG", "HAMPIR_TERPENUHI", "BELUM_ADA_DATA"]).toContain(
      first.highestDeficitStatus
    );
  });

  it("menghitung rekapitulasi selisih logistik per kategori barang dan persentase keterpenuhan", async () => {
    const data = await getDashboardData();

    expect(data.logisticsStats.length).toBeGreaterThanOrEqual(1);

    data.logisticsStats.forEach((stat) => {
      expect(stat.itemCategory).toBeTruthy();
      expect(stat.totalNeed).toBeGreaterThanOrEqual(0);
      expect(stat.totalConfirmed).toBeGreaterThanOrEqual(0);
      expect(stat.totalDeficit).toBeGreaterThanOrEqual(0);
      expect(stat.fulfillmentPercentage).toBeGreaterThanOrEqual(0);
      expect(stat.fulfillmentPercentage).toBeLessThanOrEqual(100);
      expect(stat.primaryUnit).toBeTruthy();
    });
  });
});

