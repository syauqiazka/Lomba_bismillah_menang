"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  ArrowRight,
  Maximize2,
  PhoneCall,
  Activity,
} from "lucide-react";
import type { PublicReportItem, PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { Navbar } from "@/components/common/Navbar";
import { MapWrapper } from "@/components/map/MapWrapper";
import { ReportDetailDrawer } from "@/components/map/ReportDetailDrawer";
import { TextTableView } from "@/components/map/TextTableView";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";

interface LandingPageViewProps {
  initialReports: PublicReportItem[];
  aggregates: PublicAggregates;
  session?: SessionData | null;
}

export function LandingPageView({
  initialReports,
  aggregates,
  session,
}: LandingPageViewProps) {
  const [selectedReport, setSelectedReport] = useState<PublicReportItem | null>(null);
  const [isTextViewOpen, setIsTextViewOpen] = useState(false);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col selection:bg-[var(--color-primary)] selection:text-white">
      {/* 1. Header Navigasi Melekat (Sticky Navbar) */}
      <Navbar
        session={session}
        isSticky
        onToggleTextView={() => setIsTextViewOpen((prev) => !prev)}
        isTextViewOpen={isTextViewOpen}
      />

      {/* 2. HERO SECTION: Pengantar Utama Nilai Produk */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 bg-gradient-to-b from-white via-white to-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          {/* Badge Pengenal Produk */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--color-forest-bg)] text-[var(--color-primary)] border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              Platform Intelijen Kemanusiaan Indonesia
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)] font-semibold">
              Bukan Crowdfunding Finansial &bull; Bebas Donasi Uang
            </span>
          </div>

          {/* Judul Utama & Subjudul */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight leading-[1.15]">
              Transparansi Kebutuhan &amp; Bantuan Relawan.{" "}
              <span className="text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 decoration-wavy decoration-2">
                Tanpa Simpang Siur
              </span>
              , Tanpa Yang Terabaikan.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              TRASEC menghitung dan menampilkan <strong>selisih transparan</strong> antara kebutuhan riil korban di lapangan dan bantuan fisik terkonfirmasi per lokasi dan satuan ukur logistik di seluruh Indonesia.
            </p>
          </div>

          {/* Bar Aksi Utama (CTAs) */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("peta")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Jelajahi Peta Operasional</span>
            </button>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Laporkan Kebutuhan (5W+1H)</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border-strong)] bg-white hover:bg-[var(--color-surface-hover)] text-xs sm:text-sm font-bold text-[var(--color-text)] shadow-2xs transition-all"
            >
              <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Dashboard Statistik</span>
            </Link>

            <Link
              href="/darurat"
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs sm:text-sm font-bold text-red-700 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Posko Darurat</span>
            </Link>
          </div>

          {/* 4 Kartu Metrik Ringkasan Faktual */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                Laporan Terverifikasi
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[var(--color-primary)] tabular-numbers">
                {aggregates.totalVerifiedReports}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] mt-1 block">
                Validasi 5W+1H berlapis
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                Bantuan Terkonfirmasi
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[var(--color-secondary)] tabular-numbers">
                {aggregates.totalConfirmedAidItems}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] mt-1 block">
                Tercatat resmi di posko
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                Wilayah Prioritas
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tabular-numbers">
                {aggregates.totalActiveRegions}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] mt-1 block">
                Titik administratif aktif
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                Kesiapan Blank Spot
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 flex items-center gap-1.5">
                <WifiOff className="w-5 h-5 text-amber-600" />
                <span>100%</span>
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] mt-1 block">
                Antrean draf luring aktif
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MASALAH NYATA DI LAPANGAN VS SOLUSI TRASEC */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Masalah Nyata di Indonesia
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              Mengapa Isu Selisih Logistik Sangat Mendesak?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Dalam setiap bencana atau situasi darurat, terjadi paradoks bantuan: logistik mie instan atau pakaian bekas menumpuk di posko pinggir jalan, sementara posko pedalaman kekurangan air bersih, obat-obatan, dan tenda darurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Penumpukan vs Pengabaian
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Tanpa data selisih riil, donatur mengirim barang yang sama berulang kali ke posko yang paling mudah diakses. Akibatnya terjadi pembusukan logistik sementara posko terpencil terisolasi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Informasi Basi &amp; Simpang Siur
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Pesan berantai WhatsApp sering tidak memuat tanggal kejadian, nama kontak penanggung jawab, atau patokan lokasi aman. Bantuan dikirim berdasarkan data yang sudah basi berhari-hari.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/20 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Solusi Selisih Transparan TRASEC
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Menghitung selisih matematis: <code>Kebutuhan - Bantuan Terkonfirmasi</code> per satuan unik. Jika kuota terpenuhi, sistem memperingatkan relawan agar mengalihkan bantuan ke titik lain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3 PILAR PEMBEDA UTAMA TRASEC */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Pembeda Produk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              3 Pilar Keunggulan Platform
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Dirancang dengan standar teknis ketat untuk menjamin keandalan data dan kenyamanan relawan lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 p-6 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-secondary)] text-white flex items-center justify-center font-extrabold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Perhitungan Selisih Terisolasi Satuan
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Dilarang menjumlahkan satuan yang berbeda. 50 karung beras tidak dicampur dengan 100 paket sembako. Perhitungan selisih dikunci dengan isolasi transaksi database Serializable untuk mencegah alokasi ganda (*race condition*).
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-extrabold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Kerangka 5W+1H &amp; Skor Kepercayaan
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Setiap laporan wajib lolos 6 elemen (What, Who, Where, When, Why, How). Skor kepercayaan dihitung matematis secara transparan (+30 foto lapangan, +20 verifikasi relawan) dengan daftar alasan penentu yang dipaparkan terbuka.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)]">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-extrabold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Dukungan Luring Siap Blank Spot
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Saat jaringan komunikasi terputus di area bencana, relawan tetap dapat menyimpan laporan dan bantuan di antrean lokal IndexedDB perangkat, dan otomatis tersinkronisasi saat sinyal pulih tanpa duplikasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CARA KERJA SISTEM (4 LANGKAH SEDERHANA) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Alur Kerja Faktual
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              Bagaimana TRASEC Bekerja?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-[var(--color-border)] space-y-2 shadow-2xs">
              <span className="text-xs font-extrabold text-[var(--color-primary)]">Langkah 1</span>
              <h3 className="text-xs font-bold text-[var(--color-text)]">
                Pelaporan Cepat 5W+1H
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Relawan menulis kebutuhan, melampirkan foto bukti (metadata EXIF disanitasi), atau merapikan pesan WhatsApp dengan Asisten AI.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[var(--color-border)] space-y-2 shadow-2xs">
              <span className="text-xs font-extrabold text-[var(--color-secondary)]">Langkah 2</span>
              <h3 className="text-xs font-bold text-[var(--color-text)]">
                Verifikasi Transparan
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Verifikator komunitas (minimal 2 persetujuan) atau lembaga terakreditasi memeriksa kebenaran data dan catatan alasan.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[var(--color-border)] space-y-2 shadow-2xs">
              <span className="text-xs font-extrabold text-[var(--color-primary)]">Langkah 3</span>
              <h3 className="text-xs font-bold text-[var(--color-text)]">
                Pemetaan Selisih Publik
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Hanya data yang telah terverifikasi tampil di peta publik dengan visualisasi selisih kekurangan merah, kuning, atau hijau.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[var(--color-border)] space-y-2 shadow-2xs">
              <span className="text-xs font-extrabold text-emerald-700">Langkah 4</span>
              <h3 className="text-xs font-bold text-[var(--color-text)]">
                Penyaluran Tepat Sasaran
              </h3>
              <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                Relawan mencatat barang yang dikirim. Kuota berkurang seketika, mencegah penumpukan bantuan di satu titik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BAGIAN PETA OPERASIONAL INTERAKTIF (id="peta") */}
      <section id="peta" className="py-12 px-4 sm:px-6 bg-white border-t border-[var(--color-border)] scroll-mt-14">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                  Peta Operasional Langsung
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text)] tracking-tight">
                Sebaran Kebutuhan &amp; Bantuan Relawan Terverifikasi
              </h2>
              <span className="text-xs text-[var(--color-text-secondary)] block mt-0.5">
                Klik pada lingkaran penanda untuk meninjau rincian selisih logistik atau mencatat penyaluran bantuan.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/peta"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs font-bold transition-colors shadow-2xs"
                title="Buka peta memenuhi seluruh layar peramban"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Mode Layar Penuh</span>
              </Link>
            </div>
          </div>

          {/* Kontainer Peta Leaflet */}
          <div className="relative w-full h-[580px] sm:h-[640px] rounded-2xl overflow-hidden border border-[var(--color-border-strong)] shadow-sm">
            <MapWrapper
              reports={initialReports}
              onSelectReport={(rep) => setSelectedReport(rep)}
              selectedReportId={selectedReport?.id}
            />

            {/* Panel Ringkasan Samping jika pin dipilih */}
            {selectedReport && (
              <ReportDetailDrawer
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
              />
            )}

            {/* Alternatif Tabel Teks Aksesibel */}
            <TextTableView
              isOpen={isTextViewOpen}
              reports={initialReports}
              onClose={() => setIsTextViewOpen(false)}
            />
          </div>
        </div>
      </section>

      {/* 7. KOTAK INFORMASI PENJURIAN LOMBA (EASY DEVELOPMENT) */}
      <section className="py-12 px-4 sm:px-6 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 uppercase">
                Traspac Competition 2026 &bull; Evaluasi Juri
              </span>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Uji Coba 4 Peran Pengguna dengan 1-Klik
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                Penilai dan juri dapat menguji seluruh alur kerja sistem tanpa konfigurasi rumit. Masuk ke halaman login untuk memilih akun demo instan: <code>Publik</code>, <code>Relawan</code>, <code>Verifikator</code>, atau <code>Admin</code>.
              </p>
            </div>

            <Link
              href="/login"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Buka Demo Pemilihan Peran</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER KEMANUSIAAN */}
      <footer className="mt-auto py-8 px-4 sm:px-6 bg-white border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-bold text-[var(--color-text)]">
              TRASEC &bull; Humanitarian Intelligence Platform
            </div>
            <div>
              Platform transparansi logistik kemanusiaan di Indonesia. Bebas donasi uang, fokus pada selisih bantuan riil.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-[var(--color-text-secondary)]">
            <Link href="/peta" className="hover:text-[var(--color-primary)]">
              Peta Layar Penuh
            </Link>
            <Link href="/dashboard" className="hover:text-[var(--color-primary)]">
              Dashboard Statistik
            </Link>
            <Link href="/darurat" className="hover:text-[var(--color-primary)]">
              Nomor Darurat
            </Link>
            <Link href="/antrean" className="hover:text-[var(--color-primary)]">
              Antrean Luring
            </Link>
            <Link href="/login" className="hover:text-[var(--color-primary)]">
              Masuk / Demo
            </Link>
          </div>
        </div>
      </footer>

      {/* Tombol Akses Cepat Darurat Mengambang */}
      <FloatingEmergencyButton />
    </div>
  );
}

