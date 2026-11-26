"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface UnmetNeedsSectionProps {
  report: PublicReportItem | null;
}

/**
 * Menampilkan perbandingan kebutuhan vs bantuan terkonfirmasi dan selisih kurang.
 * ATURAN MUTLAK: Hanya tampil untuk laporan bertipe KEBUTUHAN, menggunakan kalkulasi dari server.
 */
export function UnmetNeedsSection({ report }: UnmetNeedsSectionProps) {
  if (!report || report.type !== "KEBUTUHAN" || report.itemDeficits.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Kebutuhan Belum Terpenuhi dan Bantuan Terkonfirmasi"
      data-reveal
      className="defer-render py-10 sm:py-12 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)]"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-danger-text)]">
              <PackageCheck className="w-4 h-4" aria-hidden="true" />
              <span>Selisih Logistik Terbuka (Kalkulasi Server)</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Kebutuhan Belum Terpenuhi vs Bantuan Terkonfirmasi
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Dihitung per kategori barang dan satuan ukur untuk laporan sorotan: <strong className="text-[var(--color-text)]">{report.title}</strong>.
            </p>
          </div>

          <Link
            href={`/laporan/${report.id}`}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors shrink-0"
          >
            <span>Catat Bantuan Fisik</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Tabel Semantik (Desktop) + Stacked List (Mobile) */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <th scope="col" className="py-3 px-4">Kategori Item</th>
                  <th scope="col" className="py-3 px-4">Satuan</th>
                  <th scope="col" className="py-3 px-4 text-right">Total Kebutuhan</th>
                  <th scope="col" className="py-3 px-4 text-right">Terkonfirmasi</th>
                  <th scope="col" className="py-3 px-4 text-right">Selisih Kurang</th>
                  <th scope="col" className="py-3 px-4 text-right">Terpenuhi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-sm">
                {report.itemDeficits.map((item) => (
                  <tr key={`${item.itemCategory}-${item.unit}`} className="hover:bg-[var(--color-surface-hover)]">
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-text)]">
                      {item.itemCategory}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">
                      {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-numbers text-[var(--color-text)]">
                      {item.totalNeed} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-numbers text-[var(--color-success-text)] font-medium">
                      {item.totalConfirmedAid} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-numbers font-bold bg-[var(--color-danger-bg)]/50 text-[var(--color-danger-text)]">
                      {item.deficit === 0
                        ? `0 ${item.unit} (Terpenuhi)`
                        : `${item.deficit} ${item.unit}`}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-numbers font-semibold text-[var(--color-text)]">
                      <div className="flex flex-col items-end gap-1.5">
                        <span>{item.percentageFulfilled}%</span>
                        <div
                          className="gap-bar w-24 h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden"
                          style={{ "--pct": item.percentageFulfilled } as CSSProperties}
                        >
                          <div className="gap-bar__fill h-full rounded-full bg-[var(--tilara-green)]" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Row List (DESIGN.md 7.3) */}
          <div className="md:hidden divide-y divide-[var(--color-border)]">
            {report.itemDeficits.map((item) => (
              <div key={`${item.itemCategory}-${item.unit}`} className="p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">{item.itemCategory}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] tabular-numbers">
                    {item.percentageFulfilled}% Terpenuhi
                  </span>
                </div>
                <div
                  className="gap-bar w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden"
                  style={{ "--pct": item.percentageFulfilled } as CSSProperties}
                >
                  <div className="gap-bar__fill h-full rounded-full bg-[var(--tilara-green)]" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="block text-[var(--color-text-muted)]">Kebutuhan</span>
                    <strong className="tabular-numbers text-[var(--color-text)]">
                      {item.totalNeed} {item.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)]">Terkonfirmasi</span>
                    <strong className="tabular-numbers text-[var(--color-success-text)]">
                      {item.totalConfirmedAid} {item.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)]">Selisih Kurang</span>
                    <strong className="tabular-numbers text-[var(--color-danger-text)]">
                      {item.deficit === 0 ? "Terpenuhi" : `${item.deficit} ${item.unit}`}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

