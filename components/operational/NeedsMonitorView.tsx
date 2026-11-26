"use client";

import Link from "next/link";
import { Clock, Package, ArrowRight } from "lucide-react";
import type { OperationalNeedsData } from "@/lib/operational-queries";

interface NeedsMonitorViewProps {
  data: OperationalNeedsData;
  canDistribute: boolean;
}

export function NeedsMonitorView({ data, canDistribute }: NeedsMonitorViewProps) {
  const { needsReports, pendingAids, isDemoMode } = data;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-info-bg)] text-[var(--status-info)]">
              OPERASIONAL LOGIN
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--status-demo)] text-white">
                DEMO
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
            Pemantauan Kebutuhan &amp; Kesenjangan Bantuan
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Menampilkan laporan bertipe KEBUTUHAN terverifikasi. Bantuan berstatus PENDING ditampilkan terpisah dan tidak mengurangi angka kekurangan resmi.
          </p>
        </div>

        {canDistribute && (
          <Link
            href="/distribusi"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[var(--forest-700)] hover:bg-[var(--forest-900)] text-white text-xs font-semibold"
          >
            <span>Buka Pencatatan Distribusi</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        )}
      </header>

      {/* Tabel Kebutuhan & Kekurangan Resmi */}
      <section aria-label="Daftar Kebutuhan Terverifikasi" className="space-y-4">
        {needsReports.map((rep) => (
          <article
            key={rep.id}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 bg-[var(--bg)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-[var(--text)]">{rep.title}</h2>
                <span className="text-xs text-[var(--text-muted)]">
                  {rep.region.name}, {rep.region.province} &bull; Urgensi: {rep.urgency}
                </span>
              </div>
              <Link
                href={`/laporan/${rep.id}`}
                className="text-xs font-semibold text-[var(--forest-700)] hover:underline"
              >
                Detail Laporan &rarr;
              </Link>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {rep.itemDeficits.map((item) => {
                const pendingForItem = pendingAids
                  .filter(
                    (a) =>
                      a.reportId === rep.id &&
                      a.itemCategory.toUpperCase() === item.itemCategory.toUpperCase() &&
                      a.unit.toLowerCase() === item.unit.toLowerCase()
                  )
                  .reduce((sum, a) => sum + a.qty, 0);

                return (
                  <div
                    key={`${item.itemCategory}-${item.unit}`}
                    className="p-4 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 tabular-numbers">
                      <span className="font-bold text-[var(--text)] inline-flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[var(--forest-700)]" aria-hidden="true" />
                        {item.itemCategory} ({item.unit})
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <span>Kebutuhan: <strong>{item.totalNeed} {item.unit}</strong></span>
                        <span className="text-[var(--status-verified)]">
                          Terkonfirmasi: <strong>{item.totalConfirmedAid} {item.unit}</strong>
                        </span>
                        <span className="text-[var(--status-attention)] font-bold">
                          Kekurangan: {item.deficit} {item.unit}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--forest-500)] rounded-full"
                        style={{ width: `${item.percentageFulfilled}%` }}
                      />
                    </div>

                    {pendingForItem > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-warning-bg)] text-[var(--status-pending)] font-semibold tabular-numbers">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          +{pendingForItem} {item.unit} PENDING (belum dikonfirmasi — di luar hitungan utama)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

