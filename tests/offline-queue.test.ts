import { describe, it, expect, beforeEach } from "vitest";

// Mock localStorage in Node environment
let memoryStore: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => memoryStore[key] || null,
  setItem: (key: string, value: string) => {
    memoryStore[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete memoryStore[key];
  },
  clear: () => {
    memoryStore = {};
  },
};

(globalThis as any).window = { localStorage: mockLocalStorage };
(globalThis as any).localStorage = mockLocalStorage;

import {
  getOfflineQueue,
  enqueueOfflineDraft,
  updateOfflineDraftStatus,
  removeOfflineDraft,
  clearOfflineDraftsForUser,
} from "@/lib/offline-queue";

describe("Offline Queue Utility (offline-queue.ts)", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it("menyimpan draf baru dengan status MENUNGGU dan ID unik", () => {
    const item = enqueueOfflineDraft({
      clientId: "uuid-client-test-1",
      userId: "usr-relawan-1",
      userName: "Relawan Lapangan",
      type: "REPORT",
      reportData: {
        title: "Kebutuhan Tenda Cugenang",
        type: "KEBUTUHAN",
        category: "BENCANA",
        urgency: "DARURAT",
        regionId: "reg-cianjur",
        regionName: "Kabupaten Cianjur",
        latitude: -6.82,
        longitude: 107.13,
        what: "Longsor menimbun jalan desa",
        who: "30 KK",
        whereDescription: "Titik kumpul posko",
        when: new Date().toISOString(),
        why: "Hujan deras",
        how: "Akses motor",
        hasPhotoEvidence: true,
        needs: [{ itemCategory: "HUNIAN", unit: "unit", qty: 20, kind: "BARANG" }],
      },
    });

    expect(item.id).toBeTruthy();
    expect(item.status).toBe("MENUNGGU");
    expect(item.createdAt).toBeTruthy();

    const queue = getOfflineQueue("usr-relawan-1");
    expect(queue.length).toBe(1);
    expect(queue[0].reportData?.title).toBe("Kebutuhan Tenda Cugenang");
  });

  it("mengisolasi draf per akun pengguna pada perangkat bersama (Shared Devices)", () => {
    // Pengguna A menyimpan draf
    enqueueOfflineDraft({
      clientId: "uuid-a-1",
      userId: "usr-alice",
      userName: "Alice",
      type: "REPORT",
      reportData: {
        title: "Laporan Alice",
        type: "KEBUTUHAN",
        category: "BENCANA",
        urgency: "DARURAT",
        regionId: "reg-1",
        regionName: "Region 1",
        latitude: -6.1,
        longitude: 106.8,
        what: "Deskripsi",
        who: "Warga",
        whereDescription: "Lokasi",
        when: new Date().toISOString(),
        why: "Alasan",
        how: "Cara",
        hasPhotoEvidence: false,
        needs: [],
      },
    });

    // Pengguna B menyimpan draf
    enqueueOfflineDraft({
      clientId: "uuid-b-1",
      userId: "usr-bob",
      userName: "Bob",
      type: "AID",
      aidData: {
        reportId: "rep-1",
        reportTitle: "Laporan Gempa",
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 50,
      },
    });

    // Alice hanya melihat draf miliknya
    const aliceQueue = getOfflineQueue("usr-alice");
    expect(aliceQueue.length).toBe(1);
    expect(aliceQueue[0].reportData?.title).toBe("Laporan Alice");

    // Bob hanya melihat draf miliknya
    const bobQueue = getOfflineQueue("usr-bob");
    expect(bobQueue.length).toBe(1);
    expect(bobQueue[0].aidData?.qty).toBe(50);
  });

  it("memperbarui status draf menjadi MENGIRIM atau GAGAL beserta pesan kesalahan", () => {
    const item = enqueueOfflineDraft({
      clientId: "uuid-sync-1",
      userId: "usr-1",
      userName: "Relawan",
      type: "AID",
      aidData: {
        reportId: "rep-1",
        reportTitle: "Laporan Banjir",
        itemCategory: "MEDIS",
        unit: "kotak",
        qty: 10,
      },
    });

    // Update to MENGIRIM
    updateOfflineDraftStatus(item.id, "MENGIRIM");
    let queue = getOfflineQueue("usr-1");
    expect(queue[0].status).toBe("MENGIRIM");

    // Update to GAGAL with error message
    updateOfflineDraftStatus(item.id, "GAGAL", "Jumlah bantuan melampaui sisa kebutuhan.");
    queue = getOfflineQueue("usr-1");
    expect(queue[0].status).toBe("GAGAL");
    expect(queue[0].errorMessage).toContain("melampaui sisa kebutuhan");
  });

  it("menghapus draf setelah berhasil tersinkronisasi", () => {
    const item = enqueueOfflineDraft({
      clientId: "uuid-del-1",
      userId: "usr-1",
      userName: "Relawan",
      type: "AID",
      aidData: {
        reportId: "rep-1",
        reportTitle: "Laporan Gempa",
        itemCategory: "MAKANAN",
        unit: "paket",
        qty: 15,
      },
    });

    expect(getOfflineQueue("usr-1").length).toBe(1);

    removeOfflineDraft(item.id);
    expect(getOfflineQueue("usr-1").length).toBe(0);
  });

  it("membersihkan seluruh draf milik pengguna tertentu tanpa menghapus draf pengguna lain", () => {
    enqueueOfflineDraft({
      clientId: "uuid-usr-1-a",
      userId: "usr-1",
      userName: "Relawan 1",
      type: "AID",
      aidData: { reportId: "r1", reportTitle: "R1", itemCategory: "MAKANAN", unit: "kotak", qty: 5 },
    });

    enqueueOfflineDraft({
      clientId: "uuid-usr-2-a",
      userId: "usr-2",
      userName: "Relawan 2",
      type: "AID",
      aidData: { reportId: "r2", reportTitle: "R2", itemCategory: "MAKANAN", unit: "kotak", qty: 10 },
    });

    clearOfflineDraftsForUser("usr-1");

    expect(getOfflineQueue("usr-1").length).toBe(0);
    expect(getOfflineQueue("usr-2").length).toBe(1);
  });
});

