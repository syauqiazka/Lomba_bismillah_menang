"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Send,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  HeartHandshake,
  MapPin,
  X,
  PlusCircle,
} from "lucide-react";
import type { SessionData } from "@/lib/session-options";
import {
  getOfflineQueue,
  removeOfflineDraft,
  updateOfflineDraftStatus,
  type OfflineDraftItem,
} from "@/lib/offline-queue";
import { createReportAction } from "@/app/actions/report-actions";
import { submitAidAction } from "@/app/actions/aid-actions";

interface OfflineQueueViewProps {
  currentUser: SessionData;
}

export function OfflineQueueView({ currentUser }: OfflineQueueViewProps) {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [queue, setQueue] = useState<OfflineDraftItem[]>(() =>
    typeof window !== "undefined" ? getOfflineQueue(currentUser.userId) : []
  );
  const [typeFilter, setTypeFilter] = useState<"ALL" | "REPORT" | "AID">("ALL");
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingItemId, setSyncingItemId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Muat antrean dari localStorage untuk userId saat ini
  const loadQueue = useCallback(() => {
    if (typeof window !== "undefined") {
      const items = getOfflineQueue(currentUser.userId);
      setQueue(items);
    }
  }, [currentUser.userId]);

  // Pantau status konektivitas jaringan
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      setNotification({
        type: "info",
        message: "Koneksi internet kembali aktif. Anda dapat menyinkronkan draf sekarang.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotification({
        type: "info",
        message: "Perangkat beralih ke mode luring (offline). Draf akan disimpan secara aman di perangkat.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadQueue]);

  // Sinkronisasi satu item
  const syncSingleItem = async (item: OfflineDraftItem): Promise<boolean> => {
    updateOfflineDraftStatus(item.id, "MENGIRIM");
    loadQueue();

    try {
      if (item.type === "REPORT" && item.reportData) {
        const payload = {
          clientId: item.clientId,
          title: item.reportData.title,
          type: item.reportData.type,
          category: item.reportData.category,
          urgency: item.reportData.urgency,
          regionId: item.reportData.regionId,
          latitude: item.reportData.latitude,
          longitude: item.reportData.longitude,
          what: item.reportData.what,
          who: item.reportData.who,
          whereDescription: item.reportData.whereDescription,
          when: item.reportData.when,
          why: item.reportData.why,
          how: item.reportData.how,
          hasPhotoEvidence: item.reportData.hasPhotoEvidence,
          needs: item.reportData.needs,
        };

        const res = await createReportAction(payload);
        if (res.ok) {
          removeOfflineDraft(item.id);
          loadQueue();
          return true;
        } else {
          updateOfflineDraftStatus(item.id, "GAGAL", res.message);
          loadQueue();
          return false;
        }
      } else if (item.type === "AID" && item.aidData) {
        const payload = {
          reportId: item.aidData.reportId,
          itemCategory: item.aidData.itemCategory,
          unit: item.aidData.unit,
          qty: item.aidData.qty,
          clientId: item.clientId,
        };

        const res = await submitAidAction(payload);
        if (res.ok) {
          removeOfflineDraft(item.id);
          loadQueue();
          return true;
        } else {
          updateOfflineDraftStatus(item.id, "GAGAL", res.message);
          loadQueue();
          return false;
        }
      }
      return false;
    } catch {
      updateOfflineDraftStatus(
        item.id,
        "GAGAL",
        "Terjadi kegagalan jaringan saat mengirim data ke server."
      );
      loadQueue();
      return false;
    }
  };

  const handleSyncItem = async (item: OfflineDraftItem) => {
    if (!isOnline) {
      setNotification({
        type: "error",
        message: "Perangkat sedang luring. Hubungkan ke internet untuk melakukan sinkronisasi.",
      });
      return;
    }

    setSyncingItemId(item.id);
    const success = await syncSingleItem(item);
    setSyncingItemId(null);

    if (success) {
      setNotification({
        type: "success",
        message: `Draf "${item.reportData?.title || "Bantuan Relawan"}" berhasil disinkronkan ke server.`,
      });
    } else {
      setNotification({
        type: "error",
        message: `Sinkronisasi gagal. Periksa kembali data atau tunggu jaringan stabil.`,
      });
    }
  };

  const handleSyncAll = async () => {
    if (!isOnline) {
      setNotification({
        type: "error",
        message: "Perangkat sedang luring. Tidak dapat menyinkronkan draf ke server.",
      });
      return;
    }

    if (queue.length === 0) return;

    setIsSyncingAll(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of queue) {
      const ok = await syncSingleItem(item);
      if (ok) successCount++;
      else failCount++;
    }

    setIsSyncingAll(false);
    loadQueue();

    if (failCount === 0) {
      setNotification({
        type: "success",
        message: `Seluruh ${successCount} draf berhasil disinkronkan dan diterbitkan ke server.`,
      });
    } else {
      setNotification({
        type: "error",
        message: `${successCount} draf berhasil disinkronkan, namun ${failCount} draf gagal.`,
      });
    }
  };

  const handleDeleteDraft = (id: string) => {
    removeOfflineDraft(id);
    loadQueue();
    setDeleteConfirmId(null);
    setNotification({
      type: "info",
      message: "Draf berhasil dihapus dari antrean lokal perangkat.",
    });
  };

  const filteredQueue = queue.filter((item) => {
    if (typeFilter === "REPORT" && item.type !== "REPORT") return false;
    if (typeFilter === "AID" && item.type !== "AID") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-forest-main)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta Operasional</span>
          </Link>

          {/* Network Status Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isOnline
                ? "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border-[var(--color-forest-border)]"
                : "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)] border-[var(--color-amber-border)]"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>Terhubung (Online)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Mode Luring (Blank Spot)</span>
              </>
            )}
          </div>
        </div>

        {/* Title Bar */}
        <div className="bg-white p-5 rounded-lg border border-[var(--color-border-subtle)] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[var(--color-text-main)]">
              Manajer Antrean Pengiriman Luring
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Draf laporan dan bantuan disimpan di penyimpanan lokal perangkat Anda (Akun: <strong>{currentUser.name}</strong>).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAll}
              disabled={isSyncingAll || queue.length === 0 || !isOnline}
              className="px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? "animate-spin" : ""}`} />
              <span>Sinkronisasi Semua ({queue.length})</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div
            role="status"
            aria-live="polite"
            className={`p-3 rounded-md text-xs font-medium border flex items-center justify-between ${
              notification.type === "success"
                ? "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border-[var(--color-forest-border)]"
                : notification.type === "error"
                ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border-[var(--color-brick-border)]"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : notification.type === "error" ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:opacity-75"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              typeFilter === "ALL"
                ? "bg-[var(--color-forest-main)] text-white"
                : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
            }`}
          >
            Semua Draf ({queue.length})
          </button>
          <button
            onClick={() => setTypeFilter("REPORT")}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              typeFilter === "REPORT"
                ? "bg-[var(--color-forest-main)] text-white"
                : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
            }`}
          >
            Laporan 5W+1H ({queue.filter((q) => q.type === "REPORT").length})
          </button>
          <button
            onClick={() => setTypeFilter("AID")}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
              typeFilter === "AID"
                ? "bg-[var(--color-forest-main)] text-white"
                : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
            }`}
          >
            Catatan Bantuan ({queue.filter((q) => q.type === "AID").length})
          </button>
        </div>

        {/* Items List */}
        {filteredQueue.length === 0 ? (
          <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-main)]">
              Antrean Luring Bersih
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
              Tidak ada draf laporan atau bantuan tertunda yang menunggu pengiriman di perangkat Anda.
            </p>
            <div className="pt-2">
              <Link
                href="/lapor"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Buat Laporan Baru</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQueue.map((item) => {
              const isSyncing = syncingItemId === item.id;
              const isReport = item.type === "REPORT";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-[var(--color-border-subtle)] p-4 shadow-xs space-y-3"
                >
                  {/* Top Bar item */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-slate-100 text-slate-700">
                        {isReport ? <FileText className="w-3.5 h-3.5" /> : <HeartHandshake className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                        {isReport ? "Laporan Kemanusiaan" : "Catatan Penyaluran Bantuan"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === "MENUNGGU"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : item.status === "MENGIRIM"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border border-[var(--color-brick-border)]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        Disimpan: {new Date(item.createdAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  {isReport && item.reportData ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.reportData.urgency === "DARURAT"
                              ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)]"
                              : "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)]"
                          }`}
                        >
                          {item.reportData.urgency}
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--color-text-muted)]">
                          {item.reportData.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-1">
                        {item.reportData.title}
                      </h3>
                      <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-[var(--color-forest-main)]" />
                        <span>{item.reportData.regionName}</span> •{" "}
                        <span>{item.reportData.needs.length} item logistik</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-main)] line-clamp-2 bg-[var(--color-bg-base)] p-2 rounded">
                        {item.reportData.what}
                      </p>
                    </div>
                  ) : item.aidData ? (
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-1">
                        {item.aidData.qty.toLocaleString("id-ID")} {item.aidData.unit} ({item.aidData.itemCategory})
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Ditujukan untuk: <strong>{item.aidData.reportTitle}</strong>
                      </p>
                    </div>
                  ) : null}

                  {/* Error Message banner if failed */}
                  {item.errorMessage && (
                    <div className="p-2.5 rounded bg-[var(--color-brick-bg)] border border-[var(--color-brick-border)] text-xs text-[var(--color-brick-main)] flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{item.errorMessage}</span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                      Client ID: {item.clientId.slice(0, 16)}...
                    </span>

                    <div className="flex items-center gap-2">
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-[var(--color-brick-main)] font-semibold mr-1">
                            Yakin hapus?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteDraft(item.id)}
                            className="px-2 py-1 rounded bg-[var(--color-brick-main)] text-white text-[10px] font-bold"
                          >
                            Ya, Hapus
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded border border-slate-300 text-[10px]"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="px-2.5 py-1.5 rounded text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-brick-main)] hover:bg-slate-100 transition-colors flex items-center gap-1"
                          title="Hapus draf dari antrean lokal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSyncItem(item)}
                        disabled={isSyncing || !isOnline}
                        className="px-3 py-1.5 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                      >
                        {isSyncing ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        <span>Kirim Sekarang</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
