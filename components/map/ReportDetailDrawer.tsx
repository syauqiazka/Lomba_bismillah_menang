"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Users,
} from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface ReportDetailDrawerProps {
  report: PublicReportItem | null;
  onClose: () => void;
}

export function ReportDetailDrawer({ report, onClose }: ReportDetailDrawerProps) {
  useEffect(() => {
    if (!report) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [report, onClose]);

  if (!report) return null;

  const isSensitive = report.isLocationBlurred;
  const isNeedsType = report.type === "KEBUTUHAN";

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label={`Ringkasan Laporan: ${report.title}`}
      style={{ boxShadow: "var(--shadow-elevated)" }}
      className="fixed z-[1150] inset-y-0 right-0 w-full sm:w-[420px] lg:w-[460px] bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col overflow-hidden"
    >
      {/* Header Panel */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-start justify-between gap-3 bg-[var(--color-bg)]">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-secondary)] text-white">
              {report.category}
            </span>

            {report.urgency === "DARURAT" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] border border-[var(--color-danger-text)]">
                Darurat
              </span>
            )}
            {report.urgency === "MENDESAK" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border border-[var(--color-warning-text)]">
                Mendesak
              </span>
            )}
            {report.urgency === "TERENCANA" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-primary)]">
                Terencana
              </span>
            )}

            {report.verificationLevel === "OFFICIAL" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-primary)] inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                Lembaga Resmi
              </span>
            )}
            {report.verificationLevel === "COMMUNITY" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] inline-flex items-center gap-1">
                <Users className="w-3 h-3" aria-hidden="true" />
                Diverifikasi Komunitas
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-[var(--color-text)] leading-snug">
            {report.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
            <span>
              {report.region.name}, {report.region.province}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] -mt-1 -mr-1 flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
          aria-label="Tutup panel ringkasan"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Konten Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isSensitive && (
          <div className="p-3 rounded-lg bg-[var(--color-info-bg)] border border-[var(--color-info-text)] text-xs text-[var(--color-info-text)] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Privasi Diutamakan:</strong> Titik koordinat disamarkan (~1,1 km) dan alamat rinci dirahasiakan untuk melindungi privasi keluarga/lansia.
            </p>
          </div>
        )}

        {report.isStale && (
          <div className="p-3 rounded-lg bg-[var(--color-warning-bg)] border border-[var(--color-warning-text)] text-xs text-[var(--color-warning-text)] flex items-start gap-2">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Data Perlu Konfirmasi Ulang:</strong> Laporan ini belum memiliki pembaruan atau catatan bantuan selama lebih dari 7 hari.
            </p>
          </div>
        )}

        {/* Skor Kepercayaan & Transparansi Alasan */}
        <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text)]">
              Skor Kepercayaan Lapangan
            </span>
            <span className="text-sm font-bold text-[var(--color-primary)] tabular-numbers">
              {report.trustScore} / 100
            </span>
          </div>

          <div className="w-full h-2 rounded bg-[var(--color-border)] overflow-hidden mb-2.5">
            <div
              className="h-full bg-[var(--color-primary)]"
              style={{ width: `${Math.min(100, Math.max(0, report.trustScore))}%` }}
            />
          </div>

          {report.trustScoreReasons && report.trustScoreReasons.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
                Faktor Verifikasi Transparan:
              </span>
              <ul className="space-y-1">
                {report.trustScoreReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)] mt-0.5" aria-hidden="true" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rincian Selisih Kebutuhan vs Bantuan */}
        {isNeedsType ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[var(--color-text)]">
                Status Selisih Logistik
              </h3>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Kebutuhan vs Terkonfirmasi
              </span>
            </div>

            {report.itemDeficits.length === 0 ? (
              <p className="text-xs text-[var(--color-text-secondary)]">
                Belum ada rincian item kebutuhan tercatat.
              </p>
            ) : (
              <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
                {report.itemDeficits.map((item, idx) => {
                  const pct = item.percentageFulfilled;
                  const isLargeDeficit = item.deficit > 0 && pct < 50;

                  return (
                    <div key={idx} className="p-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[var(--color-text)]">
                          {item.itemCategory}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          Satuan: {item.unit}
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded bg-[var(--color-bg)] flex overflow-hidden my-1.5 border border-[var(--color-border)]">
                        <div
                          className="bg-[var(--color-primary)] h-full"
                          style={{ width: `${pct}%` }}
                          title={`Terkonfirmasi: ${item.totalConfirmedAid} ${item.unit} (${pct}%)`}
                        />
                        <div
                          className="bg-[var(--color-danger-text)] h-full"
                          style={{ width: `${100 - pct}%` }}
                          title={`Selisih Kekurangan: ${item.deficit} ${item.unit}`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs tabular-numbers pt-0.5">
                        <span className="text-[var(--color-text-secondary)]">
                          Butuh: <strong>{item.totalNeed}</strong>
                        </span>
                        <span className="text-[var(--color-success-text)]">
                          Masuk: <strong>{item.totalConfirmedAid}</strong>
                        </span>
                        <span className={isLargeDeficit ? "text-[var(--color-danger-text)] font-bold" : "text-[var(--color-text)] font-semibold"}>
                          Kurang: {item.deficit} {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
            <h3 className="font-bold text-[var(--color-text)] mb-1">
              Laporan Pemantauan Lingkungan / Sosial
            </h3>
            <p className="leading-relaxed">
              Laporan ini berfokus pada observasi kondisi lapangan tanpa alokasi barang bantuan logistik.
            </p>
          </div>
        )}

        {/* Ringkasan 5W + 1H */}
        <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
          <h3 className="text-xs font-bold text-[var(--color-text)]">
            Konteks Lapangan (5W+1H)
          </h3>

          <div className="text-xs space-y-1.5 text-[var(--color-text-secondary)]">
            <div>
              <strong className="text-[var(--color-text)]">Kejadian (What):</strong>{" "}
              {report.what}
            </div>
            <div>
              <strong className="text-[var(--color-text)]">Penerima (Who):</strong>{" "}
              {report.who}
            </div>
            <div>
              <strong className="text-[var(--color-text)]">Lokasi (Where):</strong>{" "}
              {report.whereDescription}
            </div>
            <div>
              <strong className="text-[var(--color-text)]">Akses Penyaluran (How):</strong>{" "}
              {report.how}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA (beri ruang aman dari tombol darurat terapung di layar mobile) */}
      <div className="p-4 pb-20 sm:pb-4 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <Link
          href={`/laporan/${report.id}`}
          className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 transition-colors"
        >
          <span>Buka Detail &amp; Salurkan Bantuan</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
