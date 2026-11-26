"use client";

import Link from "next/link";
import Image from "next/image";
import { Activity, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 bg-[#F5F1E6] overflow-hidden">
      {/* Giant Watermark Typography di Latar Belakang */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] sm:text-[180px] md:text-[260px] font-black text-[#E8E3D5] tracking-[0.2em] select-none pointer-events-none -z-0 leading-none"
      >
        TILARA
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">
        {/* Header Title Tengah: Bold, Uppercase Editorial dengan Aksen Serif */}
        <RevealOnScroll direction="up" delayMs={50}>
          <div className="text-center max-w-4xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white border border-[#E0DBD0] text-[#172B3A] shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Humanitarian Intelligence Platform &bull; Indonesia
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] uppercase">
              PANTAU KEBUTUHAN RIIL &amp;{" "}
              <span className="font-serif italic font-normal text-amber-500 block sm:inline">
                Salurkan Bantuan
              </span>{" "}
              Tanpa Penumpukan
            </h1>
          </div>
        </RevealOnScroll>

        {/* 3-Column Hero Layout (Kiri: Teks & CTA, Tengah: Foto Vertikal ber-Checker Corner, Kanan: Kutipan Faktual) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Kolom Kiri: Penjelasan Kunci & Tombol Masuk Peta (4 Kolom) */}
          <div className="lg:col-span-4 space-y-4 text-left order-2 lg:order-1">
            <RevealOnScroll direction="up" delayMs={100}>
              <div className="space-y-3.5 p-5 rounded-2xl bg-white border border-[#E3DFD5] shadow-xs hover-lift">
                <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Real-time Logistik</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Bukan platform donasi uang. TILARA menghitung dan menampilkan <strong>selisih terbuka</strong> antara kebutuhan warga di lapangan dan bantuan fisik terkonfirmasi per satuan barang dan relawan.
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <Link
                    href="/peta"
                    className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F2A22] hover:bg-[#16382E] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <MapPin className="w-4 h-4 text-amber-400 transition-transform group-hover:scale-110" />
                    <span>Jelajahi Peta Kebutuhan</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/lapor"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-[#D9D3C7] text-xs font-bold transition-colors"
                  >
                    <span>Lapor Kebutuhan (5W+1H)</span>
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Kolom Tengah: Framed Documentary Hero Photo dengan Ornamen Checkerboard Khas KIN DORA (5 Kolom) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <RevealOnScroll direction="scale" delayMs={200}>
              <div className="relative group max-w-sm sm:max-w-md mx-auto">
                {/* Ornamen Checkerboard Geometris Sudut Khas KIN DORA */}
                <div aria-hidden="true" className="absolute -top-3 -right-3 w-16 h-16 checker-pattern-gold rounded-tr-2xl z-20 pointer-events-none" />
                <div aria-hidden="true" className="absolute -bottom-3 -left-3 w-16 h-16 checker-pattern rounded-bl-2xl z-20 pointer-events-none" />

                <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white aspect-[4/5] sm:aspect-[3/4]">
                  <Image
                    src="/images/landing/hero/gotong-royong-relawan-sungai.jpg"
                    alt="Aksi gotong royong relawan pemuda terjun langsung membersihkan sampah dan sedimentasi aliran sungai di Jawa Barat"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-xs border border-white/20">
                      Dokumentasi Lapangan &bull; Lingkungan
                    </span>
                    <h3 className="text-sm sm:text-base font-bold leading-tight text-white drop-shadow-sm">
                      Gotong Royong Normalisasi Aliran Sungai di Jawa Barat
                    </h3>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Kolom Kanan: Peringatan Paradoks & Standar 5W+1H (3 Kolom) */}
          <div className="lg:col-span-3 space-y-4 text-left order-3">
            <RevealOnScroll direction="up" delayMs={300}>
              <div className="p-4 rounded-2xl bg-white border border-[#E3DFD5] shadow-xs space-y-2 hover-lift">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Integritas Terbuka</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Setiap bantuan yang masuk dikonfirmasi di posko. Bantuan yang sudah cukup langsung dialihkan ke titik lain yang membutuhkan.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>Audit 5W+1H</span>
                  <span className="text-emerald-700 font-bold">100% Bebas AI Rekayasa</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Tepi Sobekan Kertas (Torn Paper Edge Bottom) */}
      <div className="torn-divider-cream-bottom" aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 sm:h-10 torn-svg-fill-white">
          <path d="M0,0 L35,28 L78,8 L130,34 L185,12 L240,32 L295,16 L355,30 L420,10 L480,28 L540,8 L610,32 L680,14 L750,30 L810,12 L875,32 L935,16 L995,30 L1060,10 L1120,28 L1175,8 L1200,24 L1200,40 L0,40 Z"></path>
        </svg>
      </div>
    </section>
  );
}

