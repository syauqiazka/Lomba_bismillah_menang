"use client";

import Link from "next/link";
import { PhoneCall, ArrowRight, BarChart3 } from "lucide-react";

export function EditorialFooter() {
  return (
    <footer className="mt-auto bg-[#0A0E13] text-gray-400 text-xs pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Baris Atas Footer: Logo + Tombol Aksi Kanan */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base tracking-wider shadow-sm">
              TR
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-tight leading-none">
                TILARA
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase mt-0.5">
                Humanitarian Intelligence Platform
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/darurat"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900 text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Panggilan Darurat: 112 / 115</span>
            </Link>
            <Link
              href="/peta"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-200 text-slate-950 text-xs font-black transition-colors"
            >
              <span>Buka Peta Operasional</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Kolom Navigasi Khas KIN DORA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1: Kategori Kebutuhan */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Kategori Isu
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Bencana Alam (Darurat)
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Lingkungan Hidup &amp; Konservasi
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Pendampingan Lansia (Sensitif)
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Fasilitas Kesehatan &amp; Sanitasi
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Dukungan Pendidikan Darurat
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Sosial &amp; Dapur Umum
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Platform & Fitur */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Platform
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/peta" className="hover:text-amber-400 transition-colors">
                  Peta Selisih Logistik
                </Link>
              </li>
              <li>
                <Link href="/lapor" className="hover:text-amber-400 transition-colors">
                  Formulir Pelaporan 5W+1H
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
                  Dashboard Statistik Nasional
                </Link>
              </li>
              <li>
                <Link href="/antrean" className="hover:text-amber-400 transition-colors">
                  Antrean Luring (Offline-First)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Portal Akun Relawan / Verifikator
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Posko Darurat */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Layanan Darurat Resmi
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-gray-300">
                <span>Darurat Terpadu</span>
                <span className="font-bold text-red-400">112</span>
              </li>
              <li className="flex items-center justify-between text-gray-300">
                <span>Basarnas (SAR)</span>
                <span className="font-bold text-amber-400">115</span>
              </li>
              <li className="flex items-center justify-between text-gray-300">
                <span>BNPB (Bencana)</span>
                <span className="font-bold text-amber-400">117</span>
              </li>
              <li className="flex items-center justify-between text-gray-300">
                <span>Kemenkes (Ambulans)</span>
                <span className="font-bold text-emerald-400">119</span>
              </li>
              <li className="pt-1">
                <Link href="/darurat" className="text-amber-400 hover:underline font-bold">
                  Daftar Kontak Posko &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Transparansi & Rekapitulasi Data */}
          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Integritas &amp; Rekap Data
            </span>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pantau rekapitulasi data selisih kebutuhan vs bantuan fisik lapangan secara terbuka dan teragregasi.
            </p>
            <div className="pt-1">
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-amber-400 border border-gray-800 text-xs font-bold transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Buka Dashboard Statistik</span>
              </Link>
              <p className="text-[10px] text-gray-500 mt-2">
                100% data transparan tanpa komisi dan tanpa donasi finansial.
              </p>
            </div>
          </div>
        </div>

        {/* Baris Hak Cipta & Prinsip Integritas */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} TILARA. Platform Transparansi Kebutuhan &amp; Bantuan Relawan Indonesia. 100% Non-Finansial.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/tentang" className="hover:text-gray-300 transition-colors">
              Tentang Platform
            </Link>
            <Link href="/darurat" className="hover:text-gray-300 transition-colors">
              Prosedur Darurat
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
              Integritas Data
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

