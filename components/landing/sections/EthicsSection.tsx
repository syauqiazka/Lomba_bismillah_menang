"use client";

import Image from "next/image";
import { ShieldCheck, EyeOff, Clock } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function EthicsSection() {
  return (
    <section id="etika" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F5F1E6] border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Kolom Teks Etika (6 Kolom) */}
        <div className="lg:col-span-6 space-y-6">
          <RevealOnScroll direction="up">
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                Etika &amp; Keamanan Privasi
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                Perlindungan Privasi Korban &amp;{" "}
                <span className="font-serif italic font-normal text-amber-500">
                  Etika Non-Finansial
                </span>
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delayMs={100}>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
              TILARA dirancang bukan untuk mengekspos penderitaan secara sensasional, melainkan untuk mempercepat penyelesaian logistik nyata secara bermartabat.
            </p>
          </RevealOnScroll>

          <div className="space-y-3">
            <RevealOnScroll direction="up" delayMs={150}>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E3DFD5] hover-lift">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    100% Bebas Donasi Uang
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Tidak menggalang dana, tidak memungut komisi, murni transparansi logistik fisik dan tenaga relawan.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={250}>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E3DFD5] hover-lift">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Pengaburan Koordinat Radius ~1,1 km
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Laporan kategori LANSIA dan KESEHATAN dibulatkan koordinat GPS-nya di server untuk menjaga privasi tempat tinggal.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={350}>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E3DFD5] hover-lift">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Penanda Laporan Basi (&gt; 7 Hari)
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Laporan yang tidak memiliki pembaruan selama lebih dari 7 hari otomatis diberi penanda agar relawan memverifikasi ulang.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Kolom Visual Konservasi Satwa (6 Kolom) */}
        <div className="lg:col-span-6">
          <RevealOnScroll direction="scale" delayMs={200}>
            <div className="group relative rounded-3xl overflow-hidden border-2 border-[#D9D3C7] shadow-lg bg-white transition-all duration-500 hover:shadow-xl">
              <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/images/landing/categories/konservasi-lingkungan-orangutan.jpg"
                  alt="Petugas penyelamat mengevakuasi satwa terlindungi dari karhutla"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 550px"
                />
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="uppercase text-amber-700 font-bold">Konservasi Satwa &bull; Kalimantan</span>
                  <span>Evakuasi Karhutla</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Penyelamatan Satwa Liar Terdampak Kebakaran Hutan Gambut
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evakuasi intensif dan rehabilitasi satwa terlindungi sebelum direlokasi kembali ke habitat konservasi permanen.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

