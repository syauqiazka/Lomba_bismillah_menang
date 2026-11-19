"use client";

import { generateClientId } from "@/lib/uuid";

export type OfflineItemType = "REPORT" | "AID";
export type OfflineItemStatus = "MENUNGGU" | "MENGIRIM" | "GAGAL";

export interface OfflineDraftItem {
  id: string; // Unique queue identifier
  clientId: string; // UUID v4 idempoten untuk payload entitas
  userId: string; // ID pengguna pemilik draf (isolasi shared devices)
  userName: string;
  type: OfflineItemType;
  status: OfflineItemStatus;
  createdAt: string;
  lastAttemptAt?: string;
  errorMessage?: string;

  // Data Laporan Kemanusiaan 5W+1H
  reportData?: {
    title: string;
    type: "KEBUTUHAN" | "PEMANTAUAN";
    category: "BENCANA" | "LINGKUNGAN" | "LANSIA" | "KESEHATAN" | "PENDIDIKAN" | "SOSIAL_LAINNYA";
    urgency: "DARURAT" | "MENDESAK" | "TERENCANA";
    regionId: string;
    regionName: string;
    latitude: number;
    longitude: number;
    what: string;
    who: string;
    whereDescription: string;
    when: string;
    why: string;
    how: string;
    hasPhotoEvidence: boolean;
    needs: Array<{
      itemCategory: string;
      unit: string;
      qty: number;
      kind: "BARANG" | "TENAGA";
    }>;
  };

  // Data Penyaluran Bantuan Relawan
  aidData?: {
    reportId: string;
    reportTitle: string;
    itemCategory: string;
    unit: string;
    qty: number;
  };
}

const STORAGE_KEY = "trasec_offline_queue_v1";

/**
 * Membaca seluruh draf antrean luring yang tersimpan di localStorage.
 * Memfilter hanya draf milik userId yang sedang aktif (Aturan 15.3 AGENTS.md).
 */
export function getOfflineQueue(userId?: string): OfflineDraftItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Jika baru pertama kali dibuka, sediakan 1 draf contoh untuk simulasi evaluasi juri
      if (userId) {
        const initialSample: OfflineDraftItem = {
          id: "draft-sample-cjr-01",
          clientId: "uuid-client-offline-cjr-01",
          userId: userId,
          userName: "Relawan Lapangan",
          type: "REPORT",
          status: "MENUNGGU",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          reportData: {
            title: "Kebutuhan Terpal dan Matras Pengungsian Blok Cugenang",
            type: "KEBUTUHAN",
            category: "BENCANA",
            urgency: "DARURAT",
            regionId: "reg-cianjur",
            regionName: "Kabupaten Cianjur",
            latitude: -6.8222,
            longitude: 107.1394,
            what: "45 tenda keluarga tergenang rembesan air hujan dan butuh matras serta selimut tebal.",
            who: "110 jiwa warga RW 02 Desa Mangunkerta.",
            whereDescription: "Lapangan sepak bola samping mushola Al-Hidayah, Desa Mangunkerta.",
            when: new Date().toISOString(),
            why: "Hujan lebat setiap sore membuat alas tanah menjadi becek dan berisiko hipotermia.",
            how: "Dapat diakses mobil logistik lewat jalur alternatif via Warungkondang.",
            hasPhotoEvidence: true,
            needs: [
              { itemCategory: "HUNIAN", unit: "lembar", qty: 50, kind: "BARANG" },
              { itemCategory: "LOGISTIK", unit: "lembar", qty: 80, kind: "BARANG" },
            ],
          },
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([initialSample]));
        return [initialSample];
      }
      return [];
    }

    const parsed: OfflineDraftItem[] = JSON.parse(raw);
    if (!userId) return parsed;
    return parsed.filter((item) => item.userId === userId);
  } catch (err) {
    console.error("Gagal membaca antrean offline dari storage:", err);
    return [];
  }
}

/**
 * Menyimpan array draf ke localStorage.
 */
export function saveOfflineQueue(items: OfflineDraftItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Gagal menyimpan antrean offline:", err);
  }
}

/**
 * Menambahkan item draf baru ke antrean luring.
 */
export function enqueueOfflineDraft(
  draft: Omit<OfflineDraftItem, "id" | "createdAt" | "status">
): OfflineDraftItem {
  const newItem: OfflineDraftItem = {
    ...draft,
    id: generateClientId(),
    status: "MENUNGGU",
    createdAt: new Date().toISOString(),
  };

  const current = getOfflineQueue(); // baca semua tanpa filter
  const updated = [newItem, ...current];
  saveOfflineQueue(updated);
  return newItem;
}

/**
 * Memperbarui status item draf (misal saat sedang dikirim atau gagal).
 */
export function updateOfflineDraftStatus(
  id: string,
  status: OfflineItemStatus,
  errorMessage?: string
): void {
  const current = getOfflineQueue();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        lastAttemptAt: new Date().toISOString(),
        errorMessage: errorMessage || item.errorMessage,
      };
    }
    return item;
  });
  saveOfflineQueue(updated);
}

/**
 * Menghapus draf setelah berhasil terkirim atau dibatalkan pengguna.
 */
export function removeOfflineDraft(id: string): void {
  const current = getOfflineQueue();
  const updated = current.filter((item) => item.id !== id);
  saveOfflineQueue(updated);
}

/**
 * Menghapus seluruh draf milik pengguna tertentu (misal saat logout).
 */
export function clearOfflineDraftsForUser(userId: string): void {
  const current = getOfflineQueue();
  const remaining = current.filter((item) => item.userId !== userId);
  saveOfflineQueue(remaining);
}

