"use client";

import Link from "next/link";
import { Sprout, Receipt, Users } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function CoreValuesSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F5F1E6]">
      {/* Torn Edge Top */}
      <div className="torn-divider-cream-top" aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 sm:h-10 torn-svg-fill-white rotate-180">
          <path d="M0,0 L35,28 L78,8 L130,34 L185,12 L240,32 L295,16 L355,30 L420,10 L480,28 L540,8 L610,32 L680,14 L750,30 L810,12 L875,32 L935,16 L995,30 L1060,10 L1120,28 L1175,8 L1200,24 L1200,40 L0,40 Z"></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-800 bg-white border border-[#E0DBD0] px-3 py-1 rounded-md mb-2">
              Pilar Integritas Operasional
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Tiga Nilai Inti TILARA
            </h2>
          </div>
        </RevealOnScroll>

        {/* 3 Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E3DFD5] shadow-xs hover-lift">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-6">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-slate-900 mb-3">Transparansi Selisih</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Menghitung dan mempublikasikan selisih kuota logistik riil per lokasi. Bantuan yang cukup langsung dialihkan agar posko lain tidak terabaikan.
            </p>
            <Link href="/peta" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#0F2A22] hover:text-amber-600 transition-colors">
              Pantau Selisih di Peta &rarr;
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E3DFD5] shadow-xs hover-lift">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
              <Receipt className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-slate-900 mb-3">Verifikasi Dua Lapis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Proses audit terbuka: Setiap persetujuan atau revisi laporan lapangan wajib divalidasi minimal 2 relawan komunitas independen atau lembaga resmi.
            </p>
            <Link href="/verifikasi" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#0F2A22] hover:text-amber-600 transition-colors">
              Antrean Verifikasi &rarr;
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 border border-[#E3DFD5] shadow-xs hover-lift">
            <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-slate-900 mb-3">Gotong Royong Merata</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Kolaborasi aktif lintas komunitas, posko mandiri warga, dan lembaga kemanusiaan tanpa tumpang tindih alokasi barang dan tenaga.
            </p>
            <Link href="/darurat" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#0F2A22] hover:text-amber-600 transition-colors">
              Direktori Kontak Posko &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Torn Edge Bottom */}
      <div className="torn-divider-cream-bottom" aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 sm:h-10 torn-svg-fill-white">
          <path d="M0,0 L35,28 L78,8 L130,34 L185,12 L240,32 L295,16 L355,30 L420,10 L480,28 L540,8 L610,32 L680,14 L750,30 L810,12 L875,32 L935,16 L995,30 L1060,10 L1120,28 L1175,8 L1200,24 L1200,40 L0,40 Z"></path>
        </svg>
      </div>
    </section>
  );
}

