"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Info,
} from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";
import { getThematicDocumentaryImage } from "@/lib/featured-incident";

interface FeaturedIncidentSectionProps {
  report: PublicReportItem | null;
  isDemoMode: boolean;
}

const URGENCY_LABELS: Record<string, { label: string; style: string }> = {
  DARURAT: {
    label: "URGENT: DARURAT",
    style: "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] border-[var(--color-danger-text)]/30",
  },
  MENDESAK: {
    label: "MENDESAK",
    style: "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-text)]/30",
  },
  TERENCANA: {
    label: "TERENCANA",
    style: "bg-[var(--color-info-bg)] text-[var(--color-info-text)] border-[var(--color-info-text)]/30",
  },
};

export function FeaturedIncidentSection({
  report,
  isDemoMode,
}: FeaturedIncidentSectionProps) {
  if (!report) {
    return (
      <section
        aria-label="Sorotan Kejadian Utama"
        className="py-12 px-4 sm:px-6 max-w-[1200px] mx-auto"
      >
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 text-center space-y-3">
          <Info className="w-8 h-8 text-[var(--color-text-muted)] mx-auto" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Belum Ada Laporan Terverifikasi
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
            Saat ini belum terdapat laporan berstatus VERIFIED pada sistem publik. Relawan terdaftar dapat mengajukan laporan baru melalui standar 5W+1H.
          </p>
          <div className="pt-2">
            <Link
              href="/lapor"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded bg-[var(--color-primary)] text-white text-sm font-semibold"
            >
              Ajukan Laporan Lapangan
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const urgencyMeta = URGENCY_LABELS[report.urgency] ?? URGENCY_LABELS.TERENCANA;
  const asset = getThematicDocumentaryImage(report.category);
  const formattedDate = new Date(report.when).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      aria-label="Sorotan Kejadian Utama"
      className="py-10 sm:py-14 px-4 sm:px-6 max-w-[1200px] mx-auto"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Sorotan Kejadian Utama (Prioritas Terverifikasi)
        </span>
        {isDemoMode && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--status-demo)] text-white">
            DEMO
          </span>
        )}
      </div>

      <article
        data-gsap="featured-card"
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-[var(--shadow-elevated)] grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Visual Dokumenter Tematik Terkurasi (5 Kolom) */}
        <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-[var(--color-surface-hover)] border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
          <div className="absolute bottom-0 inset-x-0 bg-[var(--color-secondary)]/90 text-white px-3 py-2 text-xs">
            <span className="block font-medium">{asset.attribution}</span>
          </div>
        </div>

        {/* Ringkasan Faktual Kejadian (7 Kolom) */}
        <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Lencana Status & Kategori */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border ${urgencyMeta.style}`}>
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                {urgencyMeta.label}
              </span>

              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]">
                {report.category}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-primary)]/30">
                {report.verificationLevel === "OFFICIAL" ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Diverifikasi Lembaga Resmi</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Diverifikasi Komunitas (2 Verifikator)</span>
                  </>
                )}
              </span>

              {report.isStale && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Data perlu konfirmasi ulang (&gt;7 hari)</span>
                </span>
              )}
            </div>

            {/* Judul & Wilayah */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] leading-snug">
                {report.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                  {report.region.name}, {report.region.province}
                </span>
                <span className="tabular-numbers">
                  Waktu Kejadian: {formattedDate} WIB
                </span>
              </div>
            </div>

            {/* Apa & Siapa Terdampak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Kejadian Tercatat (What)
                </h3>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {report.what}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Kelompok Terdampak (Who)
                </h3>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {report.who}
                </p>
              </div>
            </div>
          </div>

          {/* Tautan Aksi */}
          <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--color-text-secondary)] tabular-numbers">
              Skor Kepercayaan: <strong className="text-[var(--color-text)]">{report.trustScore}/100</strong>
            </span>
            <Link
              href={`/laporan/${report.id}`}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded bg-[var(--color-secondary)] hover:opacity-90 text-white text-sm font-semibold transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2"
            >
              <span>Baca Detail &amp; Riwayat Verifikasi</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

