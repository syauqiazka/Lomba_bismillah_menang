"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  PlusCircle,
  BarChart3,
  Flame,
  TreePine,
  HeartPulse,
  GraduationCap,
  Users,
  Compass,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  EyeOff,
  FileCheck2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { RevealOnScroll, AnimatedProgressBar } from "@/components/landing/RevealOnScroll";

interface EditorialLandingViewProps {
  aggregates: PublicAggregates;
  session?: SessionData | null;
}

export function EditorialLandingView({
  aggregates,
  session,
}: EditorialLandingViewProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col selection:bg-[var(--color-primary)] selection:text-white relative overflow-x-hidden">
      {/* 1. Header Navigasi Melekat (Sticky Navbar) */}
      <Navbar session={session} isSticky />

      {/* ======================================================== */}
      {/* SEKSI 1: HERO EDITORIAL KEMANUSIAAN (INSPIRASI KIN DORA) */}
      {/* ======================================================== */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 bg-white border-b border-[var(--color-border)] overflow-hidden">
        {/* Giant Watermark Typography di Latar Belakang dengan Animasi Mengambang Halus */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 text-[120px] sm:text-[180px] md:text-[250px] font-black text-slate-100 tracking-[0.18em] select-none pointer-events-none -z-0 leading-none opacity-80 animate-watermark"
        >
          TRASEC
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-8 md:space-y-12">
          {/* Header Title & Subtitle Editorial dengan Reveal Halus */}
          <RevealOnScroll direction="up" delayMs={100}>
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--color-forest-bg)] text-[var(--color-primary)] border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Humanitarian Intelligence Platform &bull; Indonesia
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[var(--color-text)] tracking-tight leading-[1.1]">
                Transparansi Kebutuhan &amp; Bantuan Relawan.{" "}
                <span className="text-[var(--color-primary)] block sm:inline">
                  Tanpa Wilayah Terabaikan.
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
                Bukan platform penggalangan dana finansial. TRASEC menghitung dan menyajikan <strong>selisih transparan</strong> antara kebutuhan riil di lapangan dan logistik bantuan fisik terkonfirmasi per lokasi dan per satuan ukur di seluruh nusantara.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/peta"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                >
                  <MapPin className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Lihat Peta Kebutuhan</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/lapor"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Laporkan Kebutuhan (5W+1H)</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl border border-[var(--color-border-strong)] bg-white hover:bg-[var(--color-surface-hover)] text-xs sm:text-sm font-bold text-[var(--color-text)] shadow-2xs transition-all duration-300 hover:-translate-y-0.5"
                >
                  <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Statistik Agregat</span>
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Central Framed Documentary Photo dengan Hover Zoom Halus */}
          <RevealOnScroll direction="scale" delayMs={250}>
            <div className="max-w-4xl mx-auto">
              <div className="group relative rounded-3xl overflow-hidden border-2 border-[var(--color-border-strong)] shadow-lg bg-[var(--color-bg)] transition-all duration-500 hover:shadow-xl">
                <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full overflow-hidden">
                  <Image
                    src="/images/landing/hero/gotong-royong-relawan-sungai.jpg"
                    alt="Aksi gotong royong relawan pemuda terjun langsung membersihkan sampah dan sedimentasi aliran sungai di Jawa Barat"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-1">
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Dokumentasi Lapangan &bull; Lingkungan Hidup</span>
                    </div>
                    <h2 className="text-base sm:text-xl md:text-2xl font-black leading-snug">
                      Aksi Gotong Royong Relawan Membersihkan Sungai &amp; Normalisasi Bantaran
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-2xl">
                      Kerja bersama mensterilkan sampah penyumbat aliran air untuk mencegah banjir luapan di kawasan pemukiman padat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 2: MISI PLATFORM & ASYMMETRIC COLLAGE              */}
      {/* ======================================================== */}
      <section id="misi" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Teks Misi & 2 Pilar (6 Kolom) */}
          <div className="lg:col-span-6 space-y-6">
            <RevealOnScroll direction="up" delayMs={50}>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  Misi Integritas Kemanusiaan
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight leading-tight">
                  Menghentikan Paradoks Penumpukan Bantuan di Titik Tertentu
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={150}>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
                Dalam operasi darurat, informasi logistik sering tersebar di kanal tidak resmi, simpang siur, atau usang. Akibatnya, barang bantuan seperti mie instan dan pakaian bekas menumpuk sia-sia di posko dekat jalan raya utama, sementara posko pelosok kekurangan air bersih, obat-obatan, dan tenda ramah lansia.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <RevealOnScroll direction="up" delayMs={200}>
                <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs space-y-2 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-forest-bg)] text-[var(--color-primary)] flex items-center justify-center font-bold">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-[var(--color-text)]">
                    Perhitungan Selisih Terbuka
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    Menghitung <code>max(0, Kebutuhan - Bantuan)</code> per satuan ukur spesifik, mencegah pengiriman saat kuota terpenuhi.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={300}>
                <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs space-y-2 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--color-secondary)] flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-[var(--color-text)]">
                    Verifikasi Faktual 5W+1H
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                    Semua laporan diverifikasi minimal 2 akun verifikator atau lembaga resmi sebelum dipublikasikan ke peta umum.
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll direction="up" delayMs={350}>
              <div className="pt-2">
                <Link
                  href="/peta"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-all duration-300 shadow-xs hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Buka Peta Operasional Interaktif</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* Kolom Kolase Asimetris 3 Foto (6 Kolom - Sesuai KIN DORA Section 2) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Foto 1 (Lebar di Atas) */}
            <RevealOnScroll direction="scale" delayMs={150}>
              <div className="group relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-strong)] shadow-md aspect-[16/9] w-full bg-gray-100 transition-all duration-500 hover:shadow-xl">
                <Image
                  src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                  alt="Aksi gotong royong massal normalisasi sungai dan pembersihan sampah di Bandung"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 550px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Lingkungan Hidup &bull; Normalisasi Sungai
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    Gotong royong relawan di Sungai Cikapundung Bandung
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Foto 2 & 3 (Dua Kotak Berdampingan di Bawah) */}
            <div className="grid grid-cols-2 gap-4">
              <RevealOnScroll direction="up" delayMs={250}>
                <div className="group relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-strong)] shadow-md aspect-[4/3] w-full bg-gray-100 transition-all duration-500 hover:shadow-xl">
                  <Image
                    src="/images/landing/categories/posyandu-kesehatan-lansia.jpg"
                    alt="Pelayanan kesehatan masyarakat dan pendampingan lansia di Posyandu"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 270px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300">
                      Kesehatan &amp; Lansia
                    </span>
                    <p className="text-[11px] font-bold leading-tight">
                      Layanan Posyandu Pedesaan
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={350}>
                <div className="group relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-strong)] shadow-md aspect-[4/3] w-full bg-gray-100 transition-all duration-500 hover:shadow-xl">
                  <Image
                    src="/images/landing/field-activities/relawan-pmi-karhutla.jpg"
                    alt="Relawan PMI berjibaku memadamkan kebakaran hutan dan lahan gambut"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 270px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-300">
                      Bencana Karhutla
                    </span>
                    <p className="text-[11px] font-bold leading-tight">
                      Aksi Padam Karhutla PMI
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 3: KATEGORI KEBUTUHAN & KARTU SELISIH BER-PROGRESS */}
      {/* ======================================================== */}
      <section id="kategori" className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                Cakupan Kebutuhan Lapangan
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                6 Kategori Penanganan Berbasis Satuan Ukur Riil
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Perhitungan selisih dihitung per satuan ukur logistik spesifik. Sistem dilarang menjumlahkan kuantitas dari satuan yang berbeda.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. BENCANA ALAM */}
            <RevealOnScroll direction="up" delayMs={50}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:border-red-400 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold transition-transform group-hover:scale-110">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase tracking-wider">
                      Urgensi Darurat
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      Bencana Alam
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Gempa bumi, banjir bandang, erupsi, dan kebakaran hutan.
                    </p>
                  </div>
                  {/* Animated Progress Bar Selisih */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-secondary)]">Logistik Terpenuhi</span>
                      <span className="text-[var(--color-primary)] font-black">68%</span>
                    </div>
                    <AnimatedProgressBar percentage={68} barColorClass="bg-red-600" />
                    <span className="text-[10px] text-[var(--color-text-muted)] block">
                      Sisa Selisih: 120 paket tenda &bull; 450 dus logistik pangan
                    </span>
                  </div>
                </div>
                <Link
                  href="/peta"
                  className="pt-3 border-t border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] group-hover:text-red-700 inline-flex items-center justify-between w-full transition-colors"
                >
                  <span>Pantau Titik Bencana di Peta</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>

            {/* 2. LINGKUNGAN HIDUP */}
            <RevealOnScroll direction="up" delayMs={100}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:border-emerald-400 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[var(--color-primary)] flex items-center justify-center font-bold transition-transform group-hover:scale-110">
                      <TreePine className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      Aksi Nyata
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      Lingkungan Hidup
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Normalisasi sungai, bersih pesisir pantai, dan konservasi alam.
                    </p>
                  </div>
                  {/* Animated Progress Bar Selisih */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-secondary)]">Logistik Terpenuhi</span>
                      <span className="text-[var(--color-primary)] font-black">45%</span>
                    </div>
                    <AnimatedProgressBar percentage={45} barColorClass="bg-emerald-600" />
                    <span className="text-[10px] text-[var(--color-text-muted)] block">
                      Sisa Selisih: 500 karung sampah &bull; 80 APD relawan
                    </span>
                  </div>
                </div>
                <Link
                  href="/peta"
                  className="pt-3 border-t border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] group-hover:text-emerald-700 inline-flex items-center justify-between w-full transition-colors"
                >
                  <span>Pantau Aksi Lingkungan di Peta</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>

            {/* 3. PENDAMPINGAN LANSIA */}
            <RevealOnScroll direction="up" delayMs={150}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:border-amber-400 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold transition-transform group-hover:scale-110">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                      Data Sensitif
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      Pendampingan Lansia
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Panti jompo, lansia sebatang kara, dan nutrisi khusus.
                    </p>
                  </div>
                  {/* Animated Progress Bar Selisih */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-secondary)]">Logistik Terpenuhi</span>
                      <span className="text-[var(--color-primary)] font-black">82%</span>
                    </div>
                    <AnimatedProgressBar percentage={82} barColorClass="bg-amber-600" />
                    <span className="text-[10px] text-[var(--color-text-muted)] block">
                      Sisa Selisih: 45 paket popok dewasa &bull; 4 kursi roda
                    </span>
                  </div>
                </div>
                <Link
                  href="/peta"
                  className="pt-3 border-t border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] group-hover:text-amber-800 inline-flex items-center justify-between w-full transition-colors"
                >
                  <span>Pantau Dukungan Lansia di Peta</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>

            {/* 4. FASILITAS KESEHATAN */}
            <RevealOnScroll direction="up" delayMs={200}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:border-teal-400 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold transition-transform group-hover:scale-110">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                      Data Sensitif
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      Fasilitas Kesehatan
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Layanan Posyandu marjinal, perban steril, dan obat darurat.
                    </p>
                  </div>
                  {/* Animated Progress Bar Selisih */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-secondary)]">Logistik Terpenuhi</span>
                      <span className="text-[var(--color-primary)] font-black">54%</span>
                    </div>
                    <AnimatedProgressBar percentage={54} barColorClass="bg-teal-600" />
                    <span className="text-[10px] text-[var(--color-text-muted)] block">
                      Sisa Selisih: 180 kotak obat esensial &bull; 60 kg kaporit
                    </span>
                  </div>
                </div>
                <Link
                  href="/peta"
                  className="pt-3 border-t border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] group-hover:text-teal-800 inline-flex items-center justify-between w-full transition-colors"
                >
                  <span>Pantau Posko Kesehatan di Peta</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>

            {/* 5. DUKUNGAN PENDIDIKAN */}
            <RevealOnScroll direction="up" delayMs={250}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:border-indigo-400 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold transition-transform group-hover:scale-110">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                      Terencana
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      Dukungan Pendidikan
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Sekolah darurat, buku pengganti banjir, dan seragam siswa.
                    </p>
                  </div>
                  {/* Animated Progress Bar Selisih */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-secondary)]">Logistik Terpenuhi</span>
                      <span className="text-[var(--color-primary)] font-black">35%</span>
                    </div>
                    <AnimatedProgressBar percentage={35} barColorClass="bg-indigo-600" />
                    <span className="text-[10px] text-[var(--color-text-muted)] block">
                      Sisa Selisih: 250 set buku sekolah &bull; 120 seragam
                    </span>
                  </div>
                </div>
                <Link
                  href="/peta"
                  className="pt-3 border-t border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] group-hover:text-indigo-800 inline-flex items-center justify-between w-full transition-colors"
                >
                  <span>Pantau Titik Pendidikan di Peta</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>

            {/* 6. SOSIAL LAINNYA */}
            <RevealOnScroll direction="up" delayMs={300}>
              <div className="group h-full p-6 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:border-slate-400 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold transition-transform group-hover:scale-110">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 uppercase tracking-wider">
                      Komunitas
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-text)]">
                      Sosial &amp; Dapur Umum
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Dapur umum mandiri warga, penampungan sementara, dan logistik beras.
                    </p>
                  </div>
                  {/* Animated Progress Bar Selisih */}
                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[var(--color-text-secondary)]">Logistik Terpenuhi</span>
                      <span className="text-[var(--color-primary)] font-black">72%</span>
                    </div>
                    <AnimatedProgressBar percentage={72} barColorClass="bg-slate-700" />
                    <span className="text-[10px] text-[var(--color-text-muted)] block">
                      Sisa Selisih: 400 kg beras dapur umum &bull; 15 tabung gas
                    </span>
                  </div>
                </div>
                <Link
                  href="/peta"
                  className="pt-3 border-t border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] group-hover:text-slate-800 inline-flex items-center justify-between w-full transition-colors"
                >
                  <span>Pantau Dapur Umum di Peta</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 4: ETIKA KEMANUSIAAN & PENGABURAN PRIVASI          */}
      {/* ======================================================== */}
      <section id="etika" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Teks Etika (6 Kolom) */}
          <div className="lg:col-span-6 space-y-6">
            <RevealOnScroll direction="up">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  Etika Kemanusiaan &amp; Keamanan Data
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                  Perlindungan Privasi Korban &amp; Kebebasan dari Komersialisasi
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={100}>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
                TRASEC dirancang bukan untuk mengekspos penderitaan, melainkan untuk mempercepat penyelesaian masalah logistik secara bermartabat.
              </p>
            </RevealOnScroll>

            <div className="space-y-4">
              <RevealOnScroll direction="up" delayMs={150}>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs hover:-translate-y-0.5 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                      100% Non-Finansial
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Tidak memungut biaya, tidak membuka dompet digital, dan tidak memproses donasi uang. Murni agregasi logistik fisik.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={250}>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs hover:-translate-y-0.5 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[var(--color-secondary)] flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                      Pengaburan Koordinat Sensitif
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Kategori LANSIA dan KESEHATAN dibulatkan koordinatnya ke 2 desimal (~1,1 km radius) di level server untuk melindungi lokasi tempat tinggal warga rentan.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={350}>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs hover:-translate-y-0.5 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)]">
                      Penanda Laporan Basi (&gt; 7 Hari)
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Laporan yang tidak memiliki konfirmasi terbaru selama lebih dari 7 hari otomatis diberi lencana peringatan agar relawan mengonfirmasi ulang.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll direction="up" delayMs={400}>
              <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Integritas Finansial
                  </span>
                  <div className="text-base sm:text-lg font-black text-[var(--color-primary)]">
                    0 Rupiah Dikelola &bull; 100% Non-Profit
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-[var(--color-primary)] border border-emerald-200 text-xs font-bold">
                  Traspac 2026
                </span>
              </div>
            </RevealOnScroll>
          </div>

          {/* Kolom Visual Konservasi Satwa (6 Kolom) */}
          <div className="lg:col-span-6">
            <RevealOnScroll direction="scale" delayMs={200}>
              <div className="group relative rounded-3xl overflow-hidden border-2 border-[var(--color-border-strong)] shadow-lg bg-white transition-all duration-500 hover:shadow-xl">
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/konservasi-lingkungan-orangutan.jpg"
                    alt="Petugas penyelamat dan dokter hewan mengevakuasi satwa liar orangutan dari habitat hutan yang terbakar"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold">
                    <span className="uppercase text-amber-700 font-bold">Konservasi Lingkungan &amp; Satwa</span>
                    <span>Kalimantan, Indonesia</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] leading-snug">
                    Penyelamatan Keanekaragaman Hayati dari Ancaman Kebakaran Hutan
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Evakuasi medis intensif satwa endemik terlindungi yang terancam karhutla gambut sebelum dipindahkan ke habitat konservasi permanen yang aman.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 5: GALERI AKSI NYATA RELAWAN NUSANTARA             */}
      {/* ======================================================== */}
      <section id="galeri" className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <RevealOnScroll direction="up">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                  Dokumentasi Lapangan Nyata
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                  Galeri Aksi Kemanusiaan &amp; Gotong Royong
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  Dokumentasi otentik partisipasi relawan dan masyarakat Indonesia dalam mengatasi krisis kemanusiaan dan merawat lingkungan hidup.
                </p>
              </div>

              <Link
                href="/peta"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline shrink-0"
              >
                <span>Buka Lokasi di Peta</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kartu Galeri 1: Gotong Royong Sungai */}
            <RevealOnScroll direction="up" delayMs={50}>
              <div className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]/40 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                    alt="Aksi gotong royong relawan membersihkan sampah sungai Cikapundung Bandung"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Lingkungan &bull; Bandung
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)] leading-snug">
                      Normalisasi Aliran Sungai Cikapundung
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                      Pengangkatan sedimentasi dan limbah liar untuk mencegah banjir luapan.
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] block">
                    Dokumentasi Aksi Bersih Sungai Indonesia
                  </span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Kartu Galeri 2: Aksi Tanam & Penghijauan (FOTO BARU) */}
            <RevealOnScroll direction="up" delayMs={100}>
              <div className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]/40 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/field-activities/relawan-tanam-penghijauan-lingkungan.jpg"
                    alt="Aksi relawan pemuda gotong royong menanam bibit penghijauan lingkungan"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Lingkungan &bull; Konservasi
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)] leading-snug">
                      Gerakan Penghijauan &amp; Penanaman Bibit
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                      Relawan muda bergotong royong menanam bibit pohon pelindung di zona tangkapan air.
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] block">
                    Dokumentasi Inisiatif Relawan Hijau
                  </span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Kartu Galeri 3: Posko Tenda Pengungsian PMI (FOTO BARU) */}
            <RevealOnScroll direction="up" delayMs={150}>
              <div className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]/40 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                    alt="Suasana posko kemanusiaan dan tenda pengungsian PMI ramah keluarga"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                      Bencana &bull; Posko Pengungsian
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text)] leading-snug">
                      Tenda Darurat Pengungsian Ramah Lansia &amp; Balita
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                      Relawan PMI mendampingi warga dan memastikan ketersediaan alas tidur serta kebutuhan pokok.
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] block">
                    Dokumentasi Operasi Posko PMI Indonesia
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 6: BANNER KOMITMEN RELAWAN (SESUAI KIN DORA)       */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <RevealOnScroll direction="scale">
          <div className="max-w-6xl mx-auto rounded-3xl bg-[#111921] text-white p-8 sm:p-14 shadow-xl space-y-8 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Integritas &amp; Transparansi Bantuan
              </span>

              <blockquote className="text-xl sm:text-2xl md:text-3xl font-black leading-snug text-gray-100">
                &ldquo;Bantuan terbaik bukanlah bantuan yang paling banyak menumpuk di jalan utama, melainkan logistik yang tepat jumlah dan tepat waktu tiba di posko yang paling membutuhkan.&rdquo;
              </blockquote>

              <p className="text-xs sm:text-sm text-gray-300">
                Platform operasional terbuka yang menghubungkan relawan lapangan, verifikator komunitas, dan posko koordinasi logistik di seluruh Indonesia.
              </p>
            </div>

            {/* 4 Counter Statistik Aktual */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-800">
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-emerald-500/50 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Laporan Terverifikasi
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-numbers mt-1">
                  {aggregates.totalVerifiedReports}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Lolos uji 5W+1H
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/50 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Logistik Terkonfirmasi
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 tabular-numbers mt-1">
                  {aggregates.totalConfirmedAidItems}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Tervalidasi di posko
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-amber-500/50 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Wilayah Koordinasi
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-numbers mt-1">
                  {aggregates.totalActiveRegions}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Titik aktif Indonesia
                </span>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 hover:border-white/50 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Audit Selisih Terbuka
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tabular-numbers mt-1">
                  100%
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Bebas donasi uang
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 7: TICKER MARQUEE DENGAN ANIMASI LOOP HALUS        */}
      {/* ======================================================== */}
      <div className="py-3.5 bg-[var(--color-primary)] text-white overflow-hidden select-none border-y border-emerald-700 shadow-inner">
        <div className="animate-marquee">
          <div className="flex items-center gap-8 whitespace-nowrap text-xs font-black uppercase tracking-widest pr-8">
            <span>&bull; TRANSPARANSI KEMANUSIAAN INDONESIA</span>
            <span>&bull; BEBAS DONASI UANG FINANSIAL</span>
            <span>&bull; PERHITUNGAN SELISIH LOGISTIK RIIL</span>
            <span>&bull; STANDAR FORMULIR 5W+1H</span>
            <span>&bull; PENGABURAN KOORDINAT SENSITIF</span>
            <span>&bull; ANTISIPASI DATA BASI 7 HARI</span>
            <span>&bull; DUKUNGAN ANTREAN OFFLINE-FIRST</span>
            <span>&bull; TRASEC HUMANITARIAN PLATFORM</span>
          </div>
          {/* Duplikasi konten untuk loop animasi mulus tanpa jeda */}
          <div className="flex items-center gap-8 whitespace-nowrap text-xs font-black uppercase tracking-widest pr-8" aria-hidden="true">
            <span>&bull; TRANSPARANSI KEMANUSIAAN INDONESIA</span>
            <span>&bull; BEBAS DONASI UANG FINANSIAL</span>
            <span>&bull; PERHITUNGAN SELISIH LOGISTIK RIIL</span>
            <span>&bull; STANDAR FORMULIR 5W+1H</span>
            <span>&bull; PENGABURAN KOORDINAT SENSITIF</span>
            <span>&bull; ANTISIPASI DATA BASI 7 HARI</span>
            <span>&bull; DUKUNGAN ANTREAN OFFLINE-FIRST</span>
            <span>&bull; TRASEC HUMANITARIAN PLATFORM</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SEKSI 8: BERITA & DOKUMENTASI OPERASI LAPANGAN           */}
      {/* ======================================================== */}
      <section id="berita" className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <RevealOnScroll direction="up">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                Kabar Operasi Terkini
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                Catatan Lapangan &amp; Verifikasi Posko
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Laporan faktual kegiatan gotong royong dan pemenuhan kuota kebutuhan logistik langsung dari tim relawan.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Berita Utama Kiri: Distribusi Hygiene Kit (FOTO BARU) */}
            <div className="lg:col-span-7">
              <RevealOnScroll direction="scale" delayMs={50}>
                <div className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]/40 shadow-xs hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src="/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg"
                      alt="Penyaluran bantuan logistik paket kebersihan Hygiene Kit bersama relawan dan warga"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 650px"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] font-semibold">
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                        SANITASI &amp; KESEHATAN
                      </span>
                      <span>19 November 2026</span>
                      <span>Posko Lapangan</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[var(--color-text)] leading-snug">
                      Penyaluran 250 Ember Hygiene Kit Menutup Kebutuhan Sanitasi Warga
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Kolaborasi relawan dan pengurus posko mendistribusikan ember sabun, disinfektan, dan perlengkapan mandi keluarga. Kuota terverifikasi 100% dan pengiriman berikutnya dialihkan ke dusun terpencil.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/peta"
                        className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
                      >
                        <span>Buka Rincian di Peta Kebutuhan</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Daftar Berita Kanan (5 Kolom Stacked - Sesuai KIN DORA Section 9) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {/* Item 1: Tenda Pengungsian PMI */}
              <RevealOnScroll direction="up" delayMs={100}>
                <div className="group p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                      alt="Tenda pengungsian posko darurat PMI"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                      BENCANA &bull; 17 NOV 2026
                    </span>
                    <h4 className="text-xs font-bold text-[var(--color-text)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                      Pemasangan Tenda Darurat Ramah Lansia &amp; Balita
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                      Kebutuhan 12 tenda peleton tervalidasi dan disetujui 2 verifikator.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Item 2: Karhutla PMI */}
              <RevealOnScroll direction="up" delayMs={200}>
                <div className="group p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src="/images/landing/field-activities/relawan-pmi-karhutla.jpg"
                      alt="Relawan PMI memadamkan karhutla"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                      BENCANA &bull; 15 NOV 2026
                    </span>
                    <h4 className="text-xs font-bold text-[var(--color-text)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                      Penyaluran Masker Tabung Oksigen di Posko Karhutla
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                      Kuota masker respirator tervalidasi 100% di posko garis depan.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Item 3: Aksi Tanam & Penghijauan */}
              <RevealOnScroll direction="up" delayMs={300}>
                <div className="group p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src="/images/landing/field-activities/relawan-tanam-penghijauan-lingkungan.jpg"
                      alt="Relawan tanam bibit lingkungan"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      LINGKUNGAN &bull; 10 NOV 2026
                    </span>
                    <h4 className="text-xs font-bold text-[var(--color-text)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                      Aksi Bersama Menanam 500 Bibit Pohon di Hulu Sungai
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                      Pemenuhan bibit tanaman pelindung selesai melalui gotong royong.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={400}>
                <div className="pt-2">
                  <Link
                    href="/peta"
                    className="w-full py-2.5 px-4 rounded-xl border border-[var(--color-border-strong)] bg-white hover:bg-[var(--color-surface-hover)] text-xs font-bold text-center block transition-colors"
                  >
                    Lihat Seluruh Laporan di Peta Interaktif
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 9: CTA PENUTUP KEMANUSIAAN                        */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-[var(--color-bg)] border-t border-[var(--color-border)]">
        <RevealOnScroll direction="up">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--color-forest-bg)] text-[var(--color-primary)]">
              Bersama Menghentikan Ketimpangan Bantuan
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight">
              Mulai Pantau Selisih &amp; Laporkan Kebutuhan Riil
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Setiap data kebutuhan yang terverifikasi dan bantuan yang dicatat membantu menyelamatkan logistik dari penumpukan sia-sia dan mengantarkannya tepat ke tangan warga yang paling membutuhkan.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/peta"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                <MapPin className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Jelajahi Peta Kebutuhan</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Laporkan Kebutuhan Baru</span>
              </Link>

              <Link
                href="/darurat"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs sm:text-sm font-bold text-red-700 transition-all duration-300 hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Nomor Kontak Darurat</span>
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 10: DEEP DARK FOOTER (SESUAI KIN DORA)             */}
      {/* ======================================================== */}
      <footer className="mt-auto py-16 px-4 sm:px-6 bg-[#0d141c] text-gray-400 text-xs border-t border-gray-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Kolom 1: Brand & Keterangan (2 Kolom) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm tracking-wider">
                  TR
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-white tracking-tight leading-none">
                    TRASEC
                  </span>
                  <span className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">
                    Humanitarian Intelligence Platform
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                Platform transparansi logistik kemanusiaan di Indonesia. Bebas donasi finansial, berfokus pada akurasi selisih kebutuhan vs bantuan riil per wilayah dan verifikasi terbuka.
              </p>
              <div className="text-[11px] text-gray-500">
                Dikembangkan untuk Traspac Competition 2026.
              </div>
            </div>

            {/* Kolom 2: Navigasi Platform */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Platform
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Peta Kebutuhan
                  </Link>
                </li>
                <li>
                  <Link href="/lapor" className="hover:text-emerald-400 transition-colors">
                    Laporkan Kebutuhan
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                    Statistik Nasional
                  </Link>
                </li>
                <li>
                  <Link href="/antrean" className="hover:text-emerald-400 transition-colors">
                    Antrean Luring (Offline)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition-colors">
                    Masuk Akun Relawan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Kategori Isu */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Kategori Isu
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Bencana Alam
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Lingkungan Hidup
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Pendampingan Lansia
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Fasilitas Kesehatan
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Dukungan Pendidikan
                  </Link>
                </li>
                <li>
                  <Link href="/peta" className="hover:text-emerald-400 transition-colors">
                    Sosial &amp; Dapur Umum
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Nomor Darurat Nasional */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Panggilan Darurat
              </span>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between">
                  <span>Panggilan Darurat Terpadu</span>
                  <span className="font-bold text-red-400">112</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Basarnas (SAR)</span>
                  <span className="font-bold text-amber-400">115</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>BNPB (Bencana)</span>
                  <span className="font-bold text-amber-400">117</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Kemenkes (Ambulans)</span>
                  <span className="font-bold text-emerald-400">119</span>
                </li>
                <li className="pt-1">
                  <Link
                    href="/darurat"
                    className="text-xs font-bold text-red-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Daftar Kontak Posko Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <span>
              Peta spasial didukung oleh &copy;{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                OpenStreetMap
              </a>{" "}
              contributors.
            </span>
            <span>
              TRASEC &bull; Humanitarian Intelligence Platform &bull; Hak Cipta Terpelihara 2026.
            </span>
          </div>
        </div>
      </footer>

      {/* Tombol Akses Cepat Darurat Mengambang */}
      <FloatingEmergencyButton />
    </div>
  );
}
