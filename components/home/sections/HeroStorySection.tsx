"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface HeroStorySectionProps {
  isDemoMode: boolean;
  totalVerified: number;
  featuredReport: PublicReportItem | null;
}

export function HeroStorySection({
  isDemoMode,
  totalVerified,
  featuredReport,
}: HeroStorySectionProps) {
  const topNeed =
    featuredReport?.type === "KEBUTUHAN" && featuredReport.itemDeficits.length > 0
      ? featuredReport.itemDeficits[0]
      : null;

  return (
    <section
      aria-label="Pengantar Utama Platform"
      className="gate-reveal relative overflow-hidden bg-[var(--tilara-navy)] text-[#F5F6F3] border-b border-[#2B4457] hero-offset pb-14 sm:pb-20 px-4 sm:px-6"
    >
      {/* Kontur topografi statis (< 2 KB) sebagai tekstur latar gelap */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 500"
        fill="none"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto opacity-[0.07] text-[#F5F6F3]"
      >
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M460 40 C560 35 670 90 710 190 C750 290 690 420 560 455 C430 490 310 410 290 300 C270 190 360 45 460 40 Z" />
          <path d="M465 95 C545 92 630 135 660 215 C690 295 640 390 540 415 C440 440 350 375 335 290 C320 205 385 98 465 95 Z" />
          <path d="M470 155 C525 152 585 185 605 240 C625 295 590 355 520 370 C450 385 390 340 380 280 C370 220 415 158 470 155 Z" />
        </g>
        <circle cx="495" cy="260" r="8" fill="currentColor" />
      </svg>

      <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Kolom Kiri: Pernyataan Prinsip & CTA */}
        <div className="lg:col-span-7 space-y-5 hero-in hero-in--after-gate">
          <div style={{ "--i": 0 } as CSSProperties} className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-white/10 text-[#F5F6F3] border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4FAE86]" aria-hidden="true" />
              <span>Disaster &amp; Humanitarian Aid Transparency Platform</span>
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--status-demo)] text-white">
                DEMO — DATA SAMPEL
              </span>
            )}
          </div>

          <h1
            style={{ "--i": 1 } as CSSProperties}
            className="text-[28px] leading-[36px] sm:text-[44px] sm:leading-[52px] font-bold text-white tracking-tight"
          >
            Ketahui apa yang terjadi. Pahami dampaknya.
          </h1>

          <p
            style={{ "--i": 2 } as CSSProperties}
            className="text-base sm:text-lg leading-relaxed text-[#C9D3DB] max-w-2xl"
          >
            Jangan sampai ada wilayah terdampak yang tidak terlihat hanya karena lokasinya jauh dari pusat distribusi bantuan. TILARA memetakan kebutuhan fisik dan selisih bantuan terkonfirmasi secara terbuka.
          </p>

          <div style={{ "--i": 3 } as CSSProperties} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="#laporan-terbaru"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[var(--tilara-green)] hover:brightness-110 text-white text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--tilara-navy)]"
            >
              <span>Jelajahi Laporan ({totalVerified})</span>
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>

            <Link
              href="/peta"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/25 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--tilara-navy)]"
            >
              <MapPin className="w-4 h-4 text-[#4FAE86]" aria-hidden="true" />
              <span>Buka Peta Operasional</span>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Kartu Kesenjangan Teratas (DESIGN.md 7.2) */}
        <div className="lg:col-span-5">
          {featuredReport && (
            <aside
              aria-label="Ringkasan Kondisi Teratas"
              className="rounded-xl bg-[#1E3547]/95 border border-white/15 p-5 sm:p-6 space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#E5A13A]">
                  Sorotan Terverifikasi
                </span>
                {isDemoMode && (
                  <span className="px-2 py-0.5 rounded-full font-bold bg-[var(--status-demo)] text-white">
                    DEMO
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-[#A9B4BC]">
                  {featuredReport.region.name}, {featuredReport.region.province}
                </p>
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {featuredReport.title}
                </h2>
              </div>

              {topNeed ? (
                <div className="rounded-lg bg-[#172B3A] border border-white/10 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F5F6F3]">{topNeed.itemCategory}</span>
                    <span className="tabular-numbers font-bold text-[#E5A13A]">
                      {topNeed.percentageFulfilled}% Terpenuhi
                    </span>
                  </div>
                  <div
                    className="gap-bar w-full h-2 rounded-full bg-white/15 overflow-hidden"
                    style={{ "--pct": topNeed.percentageFulfilled } as CSSProperties}
                  >
                    <div className="gap-bar__fill h-full rounded-full bg-[#4FAE86]" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <span className="block text-[#A9B4BC]">Kebutuhan</span>
                      <strong className="tabular-numbers text-white">
                        {topNeed.totalNeed} {topNeed.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#A9B4BC]">Diterima</span>
                      <strong className="tabular-numbers text-[#4FAE86]">
                        {topNeed.totalConfirmedAid} {topNeed.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#A9B4BC]">Kekurangan</span>
                      <strong className="tabular-numbers text-[#F28B82]">
                        {topNeed.deficit} {topNeed.unit}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#C9D3DB] line-clamp-3">
                  {featuredReport.what}
                </p>
              )}

              <Link
                href={`/laporan/${featuredReport.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4FAE86] hover:underline"
              >
                <span>Lihat detail kondisi &amp; riwayat</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
