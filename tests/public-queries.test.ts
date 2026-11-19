import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    report: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    aid: {
      aggregate: vi.fn(),
    },
    emergencyContact: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getPublicMapReports,
  getPublicReportById,
  getPublicReportDetail,
  getPublicAggregates,
} from "@/lib/public-queries";

describe("Public Data Access & Privacy (public-queries.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("harus menyamarkan koordinat dan deskripsi lokasi untuk kategori sensitif (LANSIA / KESEHATAN)", async () => {
    const rawReports = [
      {
        id: "rep-bencana",
        clientId: "cid-1",
        title: "Banjir Bandang",
        type: "KEBUTUHAN" as const,
        category: "BENCANA",
        urgency: "DARURAT",
        status: "VERIFIED" as const,
        verificationLevel: "COMMUNITY" as const,
        trustScore: 80,
        trustScoreReasons: JSON.stringify(["Foto terlampir (+30)"]),
        latitude: -6.812345,
        longitude: 107.128765,
        what: "Banjir",
        who: "Warga RW 01",
        whereDescription: "Jalan Mawar No. 12 RT 03",
        when: new Date("2026-11-19T00:00:00Z"),
        why: "Hujan",
        how: "Lewat posko",
        createdAt: new Date(),
        updatedAt: new Date(),
        region: { id: "reg-1", name: "Cianjur", province: "Jabar", city: "Cianjur" },
        needs: [{ itemCategory: "MAKANAN", unit: "kotak", qty: 100 }],
        aids: [{ itemCategory: "MAKANAN", unit: "kotak", qty: 40, status: "CONFIRMED", createdAt: new Date() }],
      },
      {
        id: "rep-lansia",
        clientId: "cid-2",
        title: "Pendampingan Lansia",
        type: "KEBUTUHAN" as const,
        category: "LANSIA",
        urgency: "TERENCANA",
        status: "VERIFIED" as const,
        verificationLevel: "COMMUNITY" as const,
        trustScore: 75,
        trustScoreReasons: JSON.stringify(["Foto panti (+30)"]),
        latitude: -6.284523,
        longitude: 106.824137,
        what: "Pendampingan",
        who: "Lansia Panti",
        whereDescription: "Jalan Rahasia No. 99 RT 05",
        when: new Date("2026-11-19T00:00:00Z"),
        why: "Kebutuhan harian",
        how: "Kontak pengurus",
        createdAt: new Date(),
        updatedAt: new Date(),
        region: { id: "reg-2", name: "Jaksel", province: "DKI", city: "Jakarta Selatan" },
        needs: [{ itemCategory: "MEDIS", unit: "paket", qty: 20 }],
        aids: [],
      },
    ];

    (prisma.report.findMany as any).mockResolvedValue(rawReports);

    const results = await getPublicMapReports();

    expect(results).toHaveLength(2);

    // BENCANA: Koordinat presisi tidak disamarkan
    const bencana = results.find((r) => r.id === "rep-bencana");
    expect(bencana).toBeDefined();
    expect(bencana?.isLocationBlurred).toBe(false);
    expect(bencana?.latitude).toBe(-6.812345);
    expect(bencana?.whereDescription).toBe("Jalan Mawar No. 12 RT 03");

    // LANSIA: Koordinat dibulatkan ke 2 desimal (~1,1 km), deskripsi disamarkan
    const lansia = results.find((r) => r.id === "rep-lansia");
    expect(lansia).toBeDefined();
    expect(lansia?.isLocationBlurred).toBe(true);
    expect(lansia?.latitude).toBe(-6.28);
    expect(lansia?.longitude).toBe(106.82);
    expect(lansia?.whereDescription).toContain("disamarkan");
  });

  it("dilarang menghitung selisih kebutuhan pada laporan bertipe PEMANTAUAN", async () => {
    const rawReports = [
      {
        id: "rep-pantau",
        clientId: "cid-pantau",
        title: "Pantauan Erupsi",
        type: "PEMANTAUAN" as const,
        category: "BENCANA",
        urgency: "MENDESAK",
        status: "VERIFIED" as const,
        verificationLevel: "OFFICIAL" as const,
        trustScore: 85,
        trustScoreReasons: null,
        latitude: -8.1189,
        longitude: 113.0845,
        what: "Pantauan abu",
        who: "Warga sekitar",
        whereDescription: "Pos pengamatan",
        when: new Date(),
        why: "Erupsi",
        how: "Visual",
        createdAt: new Date(),
        updatedAt: new Date(),
        region: { id: "reg-3", name: "Lumajang", province: "Jatim", city: "Lumajang" },
        needs: [],
        aids: [],
      },
    ];

    (prisma.report.findMany as any).mockResolvedValue(rawReports);

    const results = await getPublicMapReports();
    const pantau = results[0];

    expect(pantau.type).toBe("PEMANTAUAN");
    expect(pantau.itemDeficits).toEqual([]);
    expect(pantau.overallDeficitStatus).toBeNull();
  });

  it("harus menandai isStale jika pembaruan terakhir lebih dari 7 hari", async () => {
    const nineDaysAgo = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000);
    const rawReports = [
      {
        id: "rep-stale",
        clientId: "cid-stale",
        title: "Laporan Basi",
        type: "KEBUTUHAN" as const,
        category: "BENCANA",
        urgency: "DARURAT",
        status: "VERIFIED" as const,
        verificationLevel: "COMMUNITY" as const,
        trustScore: 80,
        trustScoreReasons: null,
        latitude: -6.1,
        longitude: 106.8,
        what: "Laporan lama",
        who: "Warga",
        whereDescription: "Posko",
        when: nineDaysAgo,
        why: "Banjir",
        how: "Jalur darat",
        createdAt: nineDaysAgo,
        updatedAt: nineDaysAgo,
        region: { id: "reg-1", name: "Cianjur", province: "Jabar", city: "Cianjur" },
        needs: [{ itemCategory: "MAKANAN", unit: "kotak", qty: 100 }],
        aids: [],
      },
    ];

    (prisma.report.findMany as any).mockResolvedValue(rawReports);

    const results = await getPublicMapReports();
    expect(results[0].isStale).toBe(true);
  });

  it("harus mengembalikan agregat publik tanpa membocorkan identitas laporan PENDING", async () => {
    (prisma.report.count as any)
      .mockResolvedValueOnce(45) // total VERIFIED
      .mockResolvedValueOnce(12); // total PENDING
    (prisma.report.groupBy as any).mockResolvedValue([
      { regionId: "reg-1" },
      { regionId: "reg-2" },
      { regionId: "reg-3" },
    ]);
    (prisma.aid.aggregate as any).mockResolvedValue({
      _sum: { qty: 2500 },
    });

    const aggregates = await getPublicAggregates();

    expect(aggregates.totalVerifiedReports).toBe(45);
    expect(aggregates.totalPendingReports).toBe(12);
    expect(aggregates.totalActiveRegions).toBe(3);
    expect(aggregates.totalConfirmedAidItems).toBe(2500);
  });

  it("harus mengembalikan null untuk laporan yang tidak ditemukan atau tidak berstatus VERIFIED", async () => {
    (prisma.report.findFirst as any).mockResolvedValue(null);

    const result = await getPublicReportById("rep-nonexistent");
    expect(result).toBeNull();
  });

  it("harus mengembalikan detail laporan terverifikasi dengan benar", async () => {
    const rawReport = {
      id: "rep-detail-1",
      clientId: "cid-detail-1",
      title: "Laporan Detail",
      type: "KEBUTUHAN" as const,
      category: "BENCANA",
      urgency: "DARURAT",
      status: "VERIFIED" as const,
      verificationLevel: "COMMUNITY" as const,
      trustScore: 90,
      trustScoreReasons: JSON.stringify(["Foto (+30)"]),
      latitude: -6.8,
      longitude: 107.1,
      what: "Gempa",
      who: "Warga",
      whereDescription: "Posko 1",
      when: new Date(),
      why: "Gempa bumi",
      how: "Jalur darat",
      createdAt: new Date(),
      updatedAt: new Date(),
      region: { id: "reg-1", name: "Cianjur", province: "Jabar", city: "Cianjur" },
      needs: [{ itemCategory: "MAKANAN", unit: "kotak", qty: 100 }],
      aids: [{ itemCategory: "MAKANAN", unit: "kotak", qty: 40, status: "CONFIRMED", createdAt: new Date() }],
    };

    (prisma.report.findFirst as any).mockResolvedValue(rawReport);

    const result = await getPublicReportById("rep-detail-1");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("rep-detail-1");
    expect(result?.title).toBe("Laporan Detail");
    expect(result?.itemDeficits[0].deficit).toBe(60);
  });

  it("getPublicReportDetail: merahasiakan kontak koordinator untuk pengunjung anonim", async () => {
    const rawDetail = {
      id: "rep-detail-2",
      clientId: "cid-2",
      title: "Laporan Detail 2",
      type: "KEBUTUHAN" as const,
      category: "BENCANA",
      urgency: "MENDESAK",
      status: "VERIFIED" as const,
      verificationLevel: "OFFICIAL" as const,
      trustScore: 85,
      trustScoreReasons: JSON.stringify(["Foto (+30)"]),
      latitude: -6.8,
      longitude: 107.1,
      what: "Banjir",
      who: "Warga",
      whereDescription: "Posko Utama",
      when: new Date(),
      why: "Tanggul jebol",
      how: "Jalur darat",
      createdAt: new Date(),
      updatedAt: new Date(),
      reporterId: "user-rep-1",
      reporter: {
        name: "Dewi Kartika",
        phone: "081234567890",
      },
      region: { id: "reg-1", name: "Cianjur", province: "Jabar", city: "Cianjur" },
      needs: [{ id: "n1", itemCategory: "MAKANAN", unit: "kotak", qty: 100, kind: "BARANG" }],
      aids: [],
      verifications: [
        {
          id: "v1",
          decision: "APPROVE",
          note: "Tervalidasi",
          createdAt: new Date(),
          user: { name: "Budi" },
        },
      ],
    };

    (prisma.report.findUnique as any).mockResolvedValue(rawDetail);

    // Akses tanpa sesi (anonim)
    const resultAnon = await getPublicReportDetail("rep-detail-2", null);
    expect(resultAnon).not.toBeNull();
    expect(resultAnon?.coordinatorContact).toBeNull();

    // Akses dengan sesi login
    const session = {
      userId: "user-relawan-1",
      name: "Ahmad",
      email: "ahmad@trasec.id",
      role: "RELAWAN" as const,
    };
    const resultAuth = await getPublicReportDetail("rep-detail-2", session);
    expect(resultAuth).not.toBeNull();
    expect(resultAuth?.coordinatorContact).not.toBeNull();
    expect(resultAuth?.coordinatorContact?.name).toBe("Dewi Kartika");
    expect(resultAuth?.coordinatorContact?.phone).toBe("081234567890");
  });
});
