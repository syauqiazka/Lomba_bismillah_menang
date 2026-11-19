"use client";

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
  if (!report) return null;

  const isSensitive = report.isLocationBlurred;
  const isNeedsType = report.type === "KEBUTUHAN";

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label={`Ringkasan Laporan: ${report.title}`}
      className="fixed z-[1150] inset-y-0 right-0 w-full sm:w-[450px] lg:w-[480px] bg-white border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out"
    >
      {/* Header Panel */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-start justify-between gap-3 bg-[var(--color-bg)]">
        <div>
          {/* Lencana Kategori & Urgensi */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[var(--color-secondary)] text-white">
              {report.category}
            </span>

            {report.urgency === "DARURAT" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8E5E3] text-[#B83E37] border border-red-200">
                DARURAT
              </span>
            )}
            {report.urgency === "MENDESAK" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBF0DC] text-[#8A5A00] border border-amber-200">
                MENDESAK
              </span>
            )}
            {report.urgency === "TERENCANA" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E4F0EA] text-[#1B5440] border border-emerald-200">
                TERENCANA
              </span>
            )}

            {report.verificationLevel === "OFFICIAL" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E4F0EA] text-[#1B5440] border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Lembaga Resmi
              </span>
            )}
            {report.verificationLevel === "COMMUNITY" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E4F0EA] text-[#1B5440] border border-emerald-200 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Diverifikasi Komunitas
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-[var(--color-text)] leading-snug">
            {report.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-muted)]" />
            <span>
              {report.region.name}, {report.region.province}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
          aria-label="Tutup panel ringkasan"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Konten Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Peringatan Privasi / Data Basi */}
        {isSensitive && (
          <div className="p-3 rounded-lg bg-[var(--color-info-bg)] border border-blue-200 text-xs text-[var(--color-info-text)] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Privasi Diutamakan:</strong> Titik koordinat disamarkan (~1,1 km) dan alamat rinci dirahasiakan untuk melindungi privasi keluarga/lansia.
            </p>
          </div>
        )}

        {report.isStale && (
          <div className="p-3 rounded-lg bg-[var(--color-warning-bg)] border border-amber-300 text-xs text-[var(--color-warning-text)] flex items-start gap-2">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Data Perlu Konfirmasi Ulang:</strong> Laporan ini belum memiliki pembaruan atau catatan bantuan selama lebih dari 7 hari.
            </p>
          </div>
        )}

        {/* Skor Kepercayaan & Transparansi Alasan */}
        <div className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--color-text)]">
              Skor Kepercayaan Lapangan
            </span>
            <span className="text-sm font-extrabold text-[var(--color-primary)] tabular-numbers">
              {report.trustScore} / 100
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-2.5">
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, report.trustScore))}%` }}
            />
          </div>

          {report.trustScoreReasons && report.trustScoreReasons.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Faktor Verifikasi Transparan:
              </span>
              <ul className="space-y-1">
                {report.trustScoreReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)] mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tabel / Rincian Selisih Kebutuhan vs Bantuan */}
        {isNeedsType ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                Status Selisih Logistik
              </h3>
              <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
                Kebutuhan vs Terkonfirmasi
              </span>
            </div>

            {report.itemDeficits.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] italic">
                Belum ada rincian item kebutuhan tercatat.
              </p>
            ) : (
              <div className="space-y-2.5">
                {report.itemDeficits.map((item, idx) => {
                  const pct = item.percentageFulfilled;
                  const isLargeDeficit = item.deficit > 0 && pct < 50;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[var(--color-border)] bg-white shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[var(--color-text)]">
                          {item.itemCategory}
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                          Satuan: {item.unit}
                        </span>
                      </div>

                      {/* Visual Bar Horizontal Selisih */}
                      <div className="w-full h-3 rounded-md bg-gray-100 flex overflow-hidden my-1.5 border border-gray-200">
                        {/* Bagian Terkonfirmasi (Forest) */}
                        <div
                          className="bg-[#246B50] h-full"
                          style={{ width: `${pct}%` }}
                          title={`Terkonfirmasi: ${item.totalConfirmedAid} ${item.unit} (${pct}%)`}
                        />
                        {/* Bagian Selisih / Kekurangan (Alert Dark) */}
                        <div
                          className="bg-[#B83E37] h-full"
                          style={{ width: `${100 - pct}%` }}
                          title={`Selisih Kekurangan: ${item.deficit} ${item.unit}`}
                        />
                      </div>

                      {/* Detail Angka Tabular */}
                      <div className="flex items-center justify-between text-[11px] tabular-numbers pt-0.5">
                        <span className="text-[var(--color-text-secondary)]">
                          Kebutuhan: <strong>{item.totalNeed}</strong>
                        </span>
                        <span className="text-[#1B5440]">
                          Masuk: <strong>{item.totalConfirmedAid}</strong>
                        </span>
                        <span className={isLargeDeficit ? "text-[#B83E37] font-bold" : "text-[var(--color-text)] font-semibold"}>
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
        <div className="space-y-2 pt-1 border-t border-[var(--color-border)]">
          <h3 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
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

      {/* Footer CTA */}
      <div className="p-4 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <Link
          href={`/laporan/${report.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs md:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shadow-sm"
        >
          <span>Buka Detail & Salurkan Bantuan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
