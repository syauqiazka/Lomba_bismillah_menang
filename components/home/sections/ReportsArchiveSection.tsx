"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Clock, MapPin, ShieldCheck, Users } from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface ReportsArchiveSectionProps {
  reports: PublicReportItem[];
  isDemoMode: boolean;
}

const CATEGORIES = [
  { id: "ALL", label: "Semua" },
  { id: "BENCANA", label: "Bencana" },
  { id: "LINGKUNGAN", label: "Lingkungan" },
  { id: "LANSIA", label: "Lansia" },
  { id: "KESEHATAN", label: "Kesehatan" },
  { id: "PENDIDIKAN", label: "Pendidikan" },
  { id: "SOSIAL_LAINNYA", label: "Sosial" },
];

export function ReportsArchiveSection({
  reports,
  isDemoMode,
}: ReportsArchiveSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filtered =
    activeCategory === "ALL"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  return (
    <section
      id="laporan-terbaru"
      aria-label="Daftar Laporan Lingkungan dan Kemanusiaan"
      data-reveal
      className="defer-render py-10 sm:py-14 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)]"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Laporan Lingkungan &amp; Kemanusiaan
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Daftar Kejadian Terverifikasi ({filtered.length})
            </h2>
          </div>

          {/* Filter Kategori (Motion-powered transition, target sentuh >= 44px) */}
          <div
            role="group"
            aria-label="Filter kategori laporan"
            className="flex flex-wrap gap-1.5"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  aria-pressed={isSelected}
                  className={`min-h-[40px] px-3 py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] ${
                    isSelected
                      ? "bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]"
                      : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Laporan Berbasis Baris Terstruktur (Bukan Card Soup Seragam) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg divide-y divide-[var(--color-border)]"
          >
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
                Tidak ada laporan terverifikasi pada kategori ini saat ini.
              </div>
            ) : (
              filtered.map((rep) => (
                <article
                  key={rep.id}
                  className="card-lift p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[var(--color-surface-hover)]/50 transition-colors"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded font-semibold bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]">
                        {rep.category}
                      </span>
                      <span className="px-2 py-0.5 rounded font-semibold bg-[var(--color-info-bg)] text-[var(--color-info-text)]">
                        {rep.type}
                      </span>
                      <span className="px-2 py-0.5 rounded font-semibold bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]">
                        {rep.urgency}
                      </span>
                      {isDemoMode && (
                        <span className="px-2 py-0.5 rounded-full font-bold bg-[var(--status-demo)] text-white">
                          DEMO
                        </span>
                      )}
                      {rep.isStale && (
                        <span className="inline-flex items-center gap-1 text-[var(--color-warning-text)] font-medium">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          Perlu konfirmasi ulang
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
                      {rep.title}
                    </h3>

                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                      {rep.what}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                        {rep.region.name}, {rep.region.province}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {rep.verificationLevel === "OFFICIAL" ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                        ) : (
                          <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
                        )}
                        {rep.verificationLevel === "OFFICIAL" ? "Lembaga Resmi" : "Komunitas"} &bull; Skor {rep.trustScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/laporan/${rep.id}`}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white text-xs font-semibold transition-colors w-full lg:w-auto"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

