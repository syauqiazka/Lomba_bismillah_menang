"use client";

import Link from "next/link";
import Image from "next/image";
import { RevealOnScroll, AnimatedProgressBar } from "@/components/landing/RevealOnScroll";

export function DeficitCategoriesSection() {
  return (
    <section id="kategori" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto space-y-12">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
              Cakupan Isu &amp; Kebutuhan Lapangan
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              6 Kategori Penanganan Logistik Riil
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Menghitung selisih kuota logistik per kategori tanpa mencampuradukkan satuan ukur yang berbeda.
            </p>
          </div>
        </RevealOnScroll>

        {/* 4 Kartu Kategori Utama Khas KIN DORA dengan Progress Bar & Thumbnail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Kartu 1: BENCANA ALAM */}
          <RevealOnScroll direction="up" delayMs={50}>
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-[#E3DFD5] shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                    alt="Tenda pengungsian darurat PMI"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                      BENCANA ALAM
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    Tenda Pengungsian &amp; Evakuasi
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Kebutuhan mendesak tenda peleton, selimut hangat, dan makanan darurat.
                  </p>
                  {/* Animated Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Terpenuhi</span>
                      <span className="text-slate-900 font-black">68%</span>
                    </div>
                    <AnimatedProgressBar percentage={68} barColorClass="bg-amber-500" />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-medium">
                      <span>Target: 180 unit</span>
                      <span>Sisa: 58 unit</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Pantau di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Kartu 2: LINGKUNGAN HIDUP */}
          <RevealOnScroll direction="up" delayMs={100}>
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-[#E3DFD5] shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/field-activities/relawan-tanam-penghijauan-lingkungan.jpg"
                    alt="Aksi tanam pohon relawan"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                      LINGKUNGAN
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    Normalisasi Sungai &amp; Bibit
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Pengadaan karung sedimentasi, cangkul relawan, dan bibit mangrove.
                  </p>
                  {/* Animated Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Terpenuhi</span>
                      <span className="text-slate-900 font-black">45%</span>
                    </div>
                    <AnimatedProgressBar percentage={45} barColorClass="bg-amber-500" />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-medium">
                      <span>Target: 500 karung</span>
                      <span>Sisa: 275 karung</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Pantau di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Kartu 3: PENDAMPINGAN LANSIA */}
          <RevealOnScroll direction="up" delayMs={150}>
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-[#E3DFD5] shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/posyandu-kesehatan-lansia.jpg"
                    alt="Pendampingan lansia"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                      LANSIA &bull; SENSITIF
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    Dukungan Nutrisi &amp; Kursi Roda
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Popok dewasa, kursi roda, dan obat tensi. Koordinat dikaburkan demi privasi.
                  </p>
                  {/* Animated Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Terpenuhi</span>
                      <span className="text-slate-900 font-black">82%</span>
                    </div>
                    <AnimatedProgressBar percentage={82} barColorClass="bg-amber-500" />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-medium">
                      <span>Target: 50 paket</span>
                      <span>Sisa: 9 paket</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Pantau di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Kartu 4: KESEHATAN & SANITASI */}
          <RevealOnScroll direction="up" delayMs={200}>
            <div className="group h-full bg-white rounded-2xl overflow-hidden border border-[#E3DFD5] shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg"
                    alt="Distribusi hygiene kit"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 250px"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-xs">
                      KESEHATAN &bull; SENSITIF
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    Paket Sanitasi Hygiene Kit
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Ember disinfektan, perban steril, dan obat-obatan posko darurat.
                  </p>
                  {/* Animated Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Terpenuhi</span>
                      <span className="text-slate-900 font-black">54%</span>
                    </div>
                    <AnimatedProgressBar percentage={54} barColorClass="bg-amber-500" />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-medium">
                      <span>Target: 250 dus</span>
                      <span>Sisa: 115 dus</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Pantau di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

