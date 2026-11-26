"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import type { PublicAggregates } from "@/lib/public-queries";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

interface VolunteerImpactSectionProps {
  aggregates: PublicAggregates;
}

export function VolunteerImpactSection({ aggregates }: VolunteerImpactSectionProps) {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#0F2A22] text-white relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <RevealOnScroll direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400 bg-white/10 px-3 py-1 rounded-md mb-3">
                Gerakan Solidaritas Lapangan
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Relawan Bergerak, <br className="hidden sm:inline" />
                <span className="font-serif italic font-normal text-amber-400">
                  Data Berbicara
                </span>
              </h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-6 py-4 rounded-2xl">
              <span className="block font-heading text-3xl sm:text-4xl font-extrabold text-amber-400">
                100%
              </span>
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium">
                Data Terverifikasi Lapangan
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Showcase Dokumentasi Lapangan Nyata (Bebas Tombol Play Palsu) */}
        <RevealOnScroll direction="scale" delayMs={150}>
          <div className="relative rounded-3xl overflow-hidden border border-white/20 aspect-[16/9] md:aspect-[21/9] shadow-2xl">
            <Image
              src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
              alt="Relawan PMI berkoordinasi di posko pengungsian"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white shadow-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Audit Lapangan Terbuka
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-xs sm:text-sm text-white font-medium bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-xs inline-flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Dokumentasi Posko: Transparansi Alokasi Logistik Kemanusiaan
                </span>
                <p className="text-[11px] text-white/70 hidden sm:block max-w-xl pl-2">
                  Mencegah penumpukan logistik fisik di jalan raya dan mengalirkan bantuan ke posko terpencil.
                </p>
              </div>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 bg-[#F5B800] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-full shadow transition-colors shrink-0"
              >
                <span>Lihat Selisih Terbuka</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        {/* 4 Counter Aktual Database (Semua Data Riil) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">Laporan Terverifikasi</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-numbers mt-0.5">
              {aggregates.totalVerifiedReports}
            </div>
            <span className="text-[10px] text-white/60">Standar 5W+1H</span>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">Logistik Terkonfirmasi</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-numbers mt-0.5">
              {aggregates.totalConfirmedAidItems}
            </div>
            <span className="text-[10px] text-white/60">Tervalidasi posko</span>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">Wilayah Koordinasi</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-numbers mt-0.5">
              {aggregates.totalActiveRegions}
            </div>
            <span className="text-[10px] text-white/60">Titik administratif</span>
          </div>

          <div className="p-4 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">Sistem Transparansi</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-numbers mt-0.5">
              100%
            </div>
            <span className="text-[10px] text-white/60">Bebas komisi &amp; donasi uang</span>
          </div>
        </div>
      </div>
    </section>
  );
}

