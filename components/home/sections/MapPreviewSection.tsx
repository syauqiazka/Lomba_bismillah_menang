"use client";

import Link from "next/link";
import { MapPin, ArrowRight, EyeOff } from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface MapPreviewSectionProps {
  reports: PublicReportItem[];
}

export function MapPreviewSection({ reports }: MapPreviewSectionProps) {
  return (
    <section
      aria-label="Pratinjau Peta Operasional"
      className="py-10 sm:py-12 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)]"
    >
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Visualisasi Geospasial
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            Pantau Sebaran Titik Kebutuhan di Peta Operasional
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Peta interaktif Leaflet menampilkan seluruh titik laporan terverifikasi lengkap dengan filter kategori, status persentase selisih, penanda data basi, dan alternatif tabel teks ringan untuk koneksi lemah.
          </p>
          <div className="pt-2">
            <Link
              href="/peta"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Buka Peta Operasional (/peta)</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] pb-1 border-b border-[var(--color-border)]">
            Titik Wilayah Terdaftar ({reports.length} Lokasi)
          </div>
          <ul className="divide-y divide-[var(--color-border)] text-xs">
            {reports.slice(0, 4).map((rep) => (
              <li key={rep.id} className="py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <strong className="block text-[var(--color-text)] truncate">
                    {rep.region.name}
                  </strong>
                  <span className="text-[var(--color-text-muted)]">
                    {rep.category} &bull; {rep.type}
                  </span>
                </div>
                <div className="text-right shrink-0 tabular-numbers font-mono text-[11px] text-[var(--color-text-secondary)]">
                  {rep.isLocationBlurred ? (
                    <span className="inline-flex items-center gap-1 text-[var(--color-info-text)]" title="Koordinat disamarkan ~1,1 km">
                      <EyeOff className="w-3 h-3" aria-hidden="true" />
                      {rep.latitude.toFixed(2)}, {rep.longitude.toFixed(2)}
                    </span>
                  ) : (
                    <span>
                      {rep.latitude.toFixed(3)}, {rep.longitude.toFixed(3)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

