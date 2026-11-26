"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function ActionGallerySection() {
  return (
    <section id="galeri" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto space-y-10">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
              Dokumentasi Lapangan Nyata
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Aksi Nyata Relawan &amp; Gotong Royong
            </h2>
          </div>
        </RevealOnScroll>

        {/* 5-Card Horizontal Strip Khas KIN DORA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Bersih Sungai */}
          <RevealOnScroll direction="up" delayMs={50}>
            <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-white shadow-xs hover-lift flex flex-col h-full">
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                  alt="Bersih sungai"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Bandung</span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Normalisasi Aliran Sungai</h4>
              </div>
            </div>
          </RevealOnScroll>

          {/* 2. Tanam Pohon */}
          <RevealOnScroll direction="up" delayMs={100}>
            <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-white shadow-xs hover-lift flex flex-col h-full">
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/images/landing/field-activities/relawan-tanam-penghijauan-lingkungan.jpg"
                  alt="Tanam pohon"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Konservasi</span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Penanaman Bibit Pelindung</h4>
              </div>
            </div>
          </RevealOnScroll>

          {/* 3. Tenda Pengungsian */}
          <RevealOnScroll direction="up" delayMs={150}>
            <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-white shadow-xs hover-lift flex flex-col h-full">
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                  alt="Tenda pengungsian"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700">Posko Bencana</span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Tenda Ramah Lansia &amp; Balita</h4>
              </div>
            </div>
          </RevealOnScroll>

          {/* 4. Hygiene Kit */}
          <RevealOnScroll direction="up" delayMs={200}>
            <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-white shadow-xs hover-lift flex flex-col h-full">
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg"
                  alt="Hygiene kit"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-700">Sanitasi</span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Paket Kebersihan Keluarga</h4>
              </div>
            </div>
          </RevealOnScroll>

          {/* 5. Karhutla PMI */}
          <RevealOnScroll direction="up" delayMs={250}>
            <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-white shadow-xs hover-lift flex flex-col h-full">
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/images/landing/field-activities/relawan-pmi-karhutla.jpg"
                  alt="Padam Karhutla"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-red-700">Lahan Gambut</span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Pemadaman Api PMI</h4>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

