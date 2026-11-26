"use client";

import type { PublicAggregates, PublicReportItem } from "@/lib/public-queries";

interface ImpactSummarySectionProps {
  aggregates: PublicAggregates;
  featuredReport: PublicReportItem | null;
  isDemoMode: boolean;
}

export function ImpactSummarySection({
  aggregates,
  featuredReport,
  isDemoMode,
}: ImpactSummarySectionProps) {
  return (
    <section
      aria-label="Informasi Dampak Tercatat"
      data-reveal
      className="defer-render py-10 sm:py-12 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)]"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Ringkasan Dampak &amp; Cakupan Data
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Fakta Lapangan yang Tercatat di Sistem
            </h2>
          </div>
          {isDemoMode && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--status-demo)] text-white">
              DEMO
            </span>
          )}
        </div>

        {/* Penjelasan Dampak Faktual dari Laporan (Tanpa Angka Buatan) */}
        {featuredReport && (
          <div className="p-4 sm:p-5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Dampak &amp; Alasan Mendesak pada Kejadian Sorotan
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {featuredReport.why} Kelompok yang terdampak: {featuredReport.who}
            </p>
          </div>
        )}

        {/* Angka Agregat Publik Terverifikasi (Dari Server) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-lift p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Laporan Terverifikasi
            </span>
            <span
              data-count={aggregates.totalVerifiedReports}
              className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tabular-numbers mt-1 block"
            >
              {aggregates.totalVerifiedReports}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Tampil pada peta publik
            </span>
          </div>

          <div className="card-lift p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Wilayah Koordinasi Aktif
            </span>
            <span
              data-count={aggregates.totalActiveRegions}
              className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tabular-numbers mt-1 block"
            >
              {aggregates.totalActiveRegions}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Kabupaten / Kota tercatat
            </span>
          </div>

          <div className="card-lift p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Bantuan Terkonfirmasi
            </span>
            <span
              data-count={aggregates.totalConfirmedAidItems}
              className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] tabular-numbers mt-1 block"
            >
              {aggregates.totalConfirmedAidItems}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Total unit logistik tervalidasi
            </span>
          </div>

          <div className="card-lift p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] block">
              Antrean Tinjauan (Agregat)
            </span>
            <span
              data-count={aggregates.totalPendingReports}
              className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tabular-numbers mt-1 block"
            >
              {aggregates.totalPendingReports}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Menunggu verifikasi (privat)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

