"use client";

import Link from "next/link";
import Image from "next/image";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function PriorityRegionsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F5F1E6] border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto space-y-10">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
              Titik Koordinasi Aktif
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Wilayah Prioritas Pantauan Lapangan
            </h2>
          </div>
        </RevealOnScroll>

        {/* 3 Kartu dengan Pita Ornamen Kuning Khas KIN DORA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kartu 1: Selat Sunda */}
          <RevealOnScroll direction="up" delayMs={50}>
            <div className="group rounded-2xl overflow-hidden border-2 border-[#D9D3C7] bg-white shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                    alt="Posko Selat Sunda"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      URGENSI DARURAT
                    </span>
                  </div>
                </div>
                {/* Pita Ornamen Kuning Emas Khas KIN DORA */}
                <div className="bg-[#F5B800] p-4 text-slate-950 font-black space-y-1">
                  <span className="text-[10px] tracking-wider uppercase block text-amber-950">Selat Sunda &bull; Banten</span>
                  <h3 className="text-sm font-black leading-tight">Posko Tanggap Banjir Pesisir</h3>
                </div>
                <div className="p-4 space-y-1 text-xs text-slate-600">
                  <p>Sisa Selisih: 45 unit tenda &bull; 120 selimut hangat.</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Buka Titik di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Kartu 2: Cikapundung */}
          <RevealOnScroll direction="up" delayMs={150}>
            <div className="group rounded-2xl overflow-hidden border-2 border-[#D9D3C7] bg-white shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                    alt="Sungai Cikapundung"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      AKSI TERENCANA
                    </span>
                  </div>
                </div>
                {/* Pita Ornamen Kuning Emas Khas KIN DORA */}
                <div className="bg-[#F5B800] p-4 text-slate-950 font-black space-y-1">
                  <span className="text-[10px] tracking-wider uppercase block text-amber-950">Bandung &bull; Jawa Barat</span>
                  <h3 className="text-sm font-black leading-tight">Normalisasi Aliran Sungai</h3>
                </div>
                <div className="p-4 space-y-1 text-xs text-slate-600">
                  <p>Sisa Selisih: 200 karung &bull; 40 pasang sepatu boot.</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Buka Titik di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Kartu 3: Cianjur */}
          <RevealOnScroll direction="up" delayMs={250}>
            <div className="group rounded-2xl overflow-hidden border-2 border-[#D9D3C7] bg-white shadow-xs hover-lift flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/evakuasi-bencana-gempa.png"
                    alt="Cianjur"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      URGENSI MENDESAK
                    </span>
                  </div>
                </div>
                {/* Pita Ornamen Kuning Emas Khas KIN DORA */}
                <div className="bg-[#F5B800] p-4 text-slate-950 font-black space-y-1">
                  <span className="text-[10px] tracking-wider uppercase block text-amber-950">Cianjur &bull; Jawa Barat</span>
                  <h3 className="text-sm font-black leading-tight">Pemulihan Pascagempa</h3>
                </div>
                <div className="p-4 space-y-1 text-xs text-slate-600">
                  <p>Sisa Selisih: 60 paket perban steril &bull; 15 kursi roda.</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href="/peta"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center block transition-colors"
                >
                  Buka Titik di Peta
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

