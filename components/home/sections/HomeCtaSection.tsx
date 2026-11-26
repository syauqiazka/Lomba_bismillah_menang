"use client";

import Link from "next/link";
import { FilePlus2, PhoneCall } from "lucide-react";

export function HomeCtaSection() {
  return (
    <section
      aria-label="Aksi Pelaporan dan Informasi Darurat"
      className="py-12 px-4 sm:px-6 bg-[var(--color-secondary)] text-white mt-6"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Laporkan Kondisi Lapangan atau Hubungi Layanan Darurat Resmi
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
            Relawan terdaftar dapat mengajukan kebutuhan baru dengan kerangka 5W+1H (mendukung antrean luring untuk area sinyal lemah). Dalam kondisi darurat mengancam keselamatan jiwa, segera hubungi saluran darurat resmi pemerintah.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/lapor"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold transition-colors"
            >
              <FilePlus2 className="w-4 h-4" aria-hidden="true" />
              <span>Buat Laporan 5W+1H</span>
            </Link>
            <Link
              href="/darurat"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded bg-[var(--color-danger-text)] hover:opacity-95 text-white text-sm font-semibold transition-opacity"
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>Buka Direktori Darurat (112 / 115 / 117 / 119)</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white/10 border border-white/15 rounded-lg p-5 space-y-2 text-xs text-white/85">
          <div className="font-semibold uppercase tracking-wider text-white">
            Nomor Rujukan Darurat Nasional
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 tabular-numbers">
            <div>112 — Darurat Terpadu</div>
            <div>115 — BASARNAS (SAR)</div>
            <div>117 — BNPB (Bencana)</div>
            <div>119 — Ambulans Medis</div>
          </div>
          <p className="pt-2 text-[11px] text-white/70">
            Aplikasi ini adalah media transparansi logistik lapangan, bukan pengganti layanan panggilan darurat 112/110/115/119.
          </p>
        </div>
      </div>
    </section>
  );
}

