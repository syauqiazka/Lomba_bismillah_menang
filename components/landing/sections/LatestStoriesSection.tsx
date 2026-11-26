"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LatestStoriesSection() {
  return (
    <section id="berita" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto space-y-10">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
              Kabar Operasi Terkini
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Catatan Lapangan &amp; Berita Terbaru
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Berita Utama Kiri (7 Kolom) */}
          <div className="lg:col-span-7">
            <RevealOnScroll direction="scale" delayMs={50}>
              <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-[#FAF8F5] shadow-xs hover-lift flex flex-col justify-between h-full">
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                    alt="Gotong royong sungai"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 650px"
                  />
                </div>
                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                      LINGKUNGAN
                    </span>
                    <span>18 November 2026</span>
                    <span>Jawa Barat</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    Normalisasi Aliran Sungai Berhasil Mereduksi Titik Genangan Banjir
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Ratusan relawan gabungan bersama warga menuntaskan pengangkatan sampah pemicu sumbatan air. Sistem menandai kuota karung dan relawan telah tercapai dan mengarahkan relawan baru ke titik berikutnya.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/peta"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
                    >
                      <span>Lihat Rincian Posko</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* 3 Berita Stacked Kanan (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Item 1 */}
            <RevealOnScroll direction="up" delayMs={100}>
              <div className="group p-4 rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] hover:border-amber-400 hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                    alt="Tenda darurat"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="80px"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-red-700 uppercase tracking-wider">
                    BENCANA &bull; 17 NOV 2026
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                    Penyaluran Tenda Pengungsian Ramah Lansia &amp; Balita
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                    Kebutuhan 12 tenda peleton tervalidasi 2 verifikator.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Item 2 */}
            <RevealOnScroll direction="up" delayMs={200}>
              <div className="group p-4 rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] hover:border-amber-400 hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src="/images/landing/field-activities/relawan-tanam-penghijauan-lingkungan.jpg"
                    alt="Penanaman pohon"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="80px"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                    LINGKUNGAN &bull; 15 NOV 2026
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                    Gotong Royong Menanam 500 Bibit Pohon di Hulu Sungai
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                    Partisipasi pemuda relawan berhasil menutup target bibit.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Item 3 */}
            <RevealOnScroll direction="up" delayMs={300}>
              <div className="group p-4 rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] hover:border-amber-400 hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src="/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg"
                    alt="Distribusi hygiene kit"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="80px"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-teal-700 uppercase tracking-wider">
                    SANITASI &bull; 12 NOV 2026
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                    Penyaluran Paket Sanitasi Ember Hygiene Kit ke Posko
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                    Kebutuhan sabun dan disinfektan tercukupi di 3 posko.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={350}>
              <div className="pt-2">
                <Link
                  href="/peta"
                  className="w-full py-2.5 px-4 rounded-xl border border-[#D9D3C7] bg-[#FAF8F5] hover:bg-white text-slate-900 text-xs font-bold text-center block transition-colors shadow-2xs"
                >
                  Buka Seluruh Laporan di Peta Interaktif
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

