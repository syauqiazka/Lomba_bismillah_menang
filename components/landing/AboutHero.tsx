import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, ShieldCheck, FileText } from "lucide-react";

export function AboutHero() {
  return (
    <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Kolom Kiri: Identitas & Nilai Utama */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-border)]">
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Humanitarian Intelligence Platform &bull; Non-Finansial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[var(--color-text)] tracking-tight leading-[1.15]">
            Transparansi Kebutuhan Lapangan &amp; Selisih Bantuan Relawan
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            TRASEC bukan situs penggalangan dana. Platform ini menghitung dan menampilkan{" "}
            <strong className="text-[var(--color-text)]">selisih riil</strong> antara kebutuhan yang dilaporkan dan bantuan fisik terkonfirmasi per lokasi dan per satuan, agar bantuan tidak menumpuk di satu posko sementara titik lain terabaikan.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/"
              className="min-h-[44px] px-5 py-2.5 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 transition-colors"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Buka Peta Operasional</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="/lapor"
              className="min-h-[44px] px-5 py-2.5 rounded bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-secondary)] border border-[var(--color-secondary)] text-sm font-semibold inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 transition-colors"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Buat Laporan 5W+1H</span>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Dokumentasi Lapangan Nyata */}
        <div className="lg:col-span-5">
          <figure className="rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="relative aspect-[4/3] w-full bg-[var(--color-surface-hover)]">
              <Image
                src="/images/landing/hero/gotong-royong-relawan-sungai.jpg"
                alt="Relawan membersihkan sedimentasi dan sampah aliran sungai di Jawa Barat"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
            <figcaption className="px-4 py-3 text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border)]">
              <strong className="text-[var(--color-text)]">Dokumentasi Lapangan:</strong> Koordinasi gotong royong normalisasi aliran sungai dan pemetaan kebutuhan peralatan relawan.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
