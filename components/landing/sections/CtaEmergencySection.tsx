"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";

export function CtaEmergencySection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 bg-[#0F2A22] text-white relative">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="max-w-2xl space-y-4 text-left">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400 bg-white/10 px-3 py-1 rounded-md">
            Aksi Kemanusiaan Nyata
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Ingin Menutup Selisih Logistik Hari Ini?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-medium">
            Laporkan kebutuhan lapangan terverifikasi atau salurkan logistik fisik dan tenaga ke posko yang masih mengalami kekurangan riil.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/lapor"
              className="px-6 py-3.5 rounded-full bg-[#F5B800] hover:bg-amber-400 text-slate-950 text-xs font-black uppercase shadow-lg transition-all"
            >
              Laporkan Kebutuhan (5W+1H)
            </Link>
            <Link
              href="/peta"
              className="px-6 py-3.5 rounded-full border border-white/30 hover:border-white text-white text-xs font-bold uppercase transition-colors"
            >
              Jelajahi Peta Selisih
            </Link>
          </div>
        </div>

        {/* Hotline Posko Darurat Card */}
        <div className="bg-[#091B15] border border-white/15 p-6 sm:p-8 rounded-3xl shadow-xl w-full lg:w-auto shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5B800] flex items-center justify-center text-slate-950">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-white/60 uppercase font-semibold block">Posko Darurat Nasional</span>
              <span className="font-heading text-2xl font-bold text-white">
                112 &bull; 115 &bull; 119
              </span>
            </div>
          </div>
          <p className="text-xs text-white/70 max-w-xs leading-normal">
            Akses cepat sambungan darurat terpadu, SAR Basarnas, dan ambulans Kemenkes.
          </p>
        </div>
      </div>
    </section>
  );
}

