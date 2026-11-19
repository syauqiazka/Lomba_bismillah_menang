"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  TreePine,
  HeartPulse,
  GraduationCap,
  Users,
  Compass,
  ArrowRight,
  ExternalLink,
  PhoneCall,
} from "lucide-react";
import type { PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";

interface EditorialLandingViewProps {
  aggregates: PublicAggregates;
  session?: SessionData | null;
}

export function EditorialLandingView({
  aggregates,
  session,
}: EditorialLandingViewProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col selection:bg-[var(--color-primary)] selection:text-white">
      {/* 1. Header Navigasi Melekat (Sticky Navbar) */}
      <Navbar session={session} isSticky />

      {/* ======================================================== */}
      {/* SEKSI 1: HERO EDITORIAL KEMANUSIAAN                     */}
      {/* ======================================================== */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Teks Hero (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--color-forest-bg)] text-[var(--color-primary)] border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Humanitarian Intelligence Platform
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                Indonesia &bull; Non-Finansial
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight leading-[1.12]">
              Transparansi Kebutuhan &amp; Bantuan Relawan.{" "}
              <span className="text-[var(--color-primary)]">
                Bebas Simpang Siur
              </span>
              , Tanpa Wilayah Terabaikan.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Bukan platform penggalangan dana. TRASEC menghitung dan menampilkan <strong>selisih transparan</strong> antara kebutuhan riil korban di lapangan dan bantuan fisik terkonfirmasi per lokasi dan satuan ukur logistik di seluruh Indonesia.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                <MapPin className="w-4 h-4" />
                <span>Lihat Peta Kebutuhan</span>
              </Link>

              <Link
                href="/lapor"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Laporkan Kebutuhan (5W+1H)</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border-strong)] bg-white hover:bg-[var(--color-surface-hover)] text-xs sm:text-sm font-bold text-[var(--color-text)] shadow-2xs transition-all"
              >
                <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Statistik Nasional</span>
              </Link>
            </div>
          </div>

          {/* Kolom Visual Hero Editorial (5 Kolom Asimetris) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-strong)] shadow-md bg-[var(--color-bg)]">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                <Image
                  src="/images/landing/hero/gotong-royong-relawan-sungai.jpg"
                  alt="Dokumentasi relawan pemuda bergotong royong menarik sampah dan limbah di aliran sungai Indonesia"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </div>

              <div className="p-4 bg-white border-t border-[var(--color-border)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold">
                  <span className="uppercase tracking-wider">Aksi Nyata Lapangan</span>
                  <span>Jawa Barat, Indonesia</span>
                </div>
                <p className="text-xs font-bold text-[var(--color-text)] leading-snug">
                  Gotong royong relawan lingkungan mensterilkan aliran sungai dari sumbatan sampah pemicu banjir.
                </p>
                <span className="text-[10px] text-[var(--color-text-muted)] block pt-1">
                  Sumber: Dokumentasi Aksi Relawan Kebersihan Sungai Indonesia &bull; Kategori: LINGKUNGAN
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 2: TENTANG PLATFORM & RUMUS SELISIH               */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Tentang Platform
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
              Menghubungkan Kebutuhan, Bantuan Terkonfirmasi, dan Verifikasi Terbuka
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Dalam operasi kemanusiaan, informasi logistik sering tersebar di kanal tidak resmi, simpang siur, atau basi. Akibatnya terjadi paradoks bantuan: logistik mie instan atau pakaian bekas menumpuk di posko dekat jalan raya utama, sementara posko pedalaman kekurangan air bersih, selimut lansia, dan tenda darurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Kebutuhan Riil Tercatat
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Relawan mendata rincian kebutuhan per satuan pengukuran spesifik (misal: <code>kotak</code>, <code>karung</code>, <code>liter</code>, <code>orang</code>). Sistem dilarang menjumlahkan kuantitas dari satuan yang berbeda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[var(--color-secondary)] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Bantuan Terkonfirmasi (CONFIRMED)
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Bantuan fisik yang masuk diverifikasi di posko. Bantuan hanya memotong selisih jika berstatus <code>CONFIRMED</code>, diproteksi transaksi serializable untuk mencegah alokasi ganda (*race condition*).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-emerald-300 bg-emerald-50/20 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Selisih Transparan Real-Time
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Rumus selisih: <code>Selisih = max(0, Kebutuhan - Bantuan Terkonfirmasi)</code>. Begitu kuota terpenuhi (selisih = 0), sistem memperingatkan agar bantuan dialihkan ke lokasi lain yang kekurangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 3: ENAM KATEGORI KEBUTUHAN (AGENTS.md)            */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Cakupan Isu
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
              6 Kategori Penanganan Lapangan
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Bukan hanya bencana alam darurat, TRASEC juga menjangkau kerusakan lingkungan hidup dan kebutuhan sosial sehari-hari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Kategori 1: BENCANA */}
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[var(--color-text)]">
                BENCANA ALAM
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Gempa bumi, banjir bandang, tanah longsor, erupsi gunung api, dan kebakaran hutan. Fokus pada tenda hunian, makanan darurat, air bersih, dan evakuasi jiwa.
              </p>
            </div>

            {/* Kategori 2: LINGKUNGAN */}
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[var(--color-primary)] flex items-center justify-center">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[var(--color-text)]">
                LINGKUNGAN HIDUP
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Pembersihan sedimentasi sungai, aksi bersih sampah pesisir pantai, penanaman mangrove, dan konservasi satwa terdampak kebakaran lahan.
              </p>
            </div>

            {/* Kategori 3: LANSIA */}
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-[var(--color-text)]">
                  PENDAMPINGAN LANSIA
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Sensitif
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Dukungan popok dewasa, kursi roda, dan nutrisi khusus panti lansia terpencil. Koordinat GPS presisi otomatis dikaburkan di server demi perlindungan privasi keluarga.
              </p>
            </div>

            {/* Kategori 4: KESEHATAN */}
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-[var(--color-text)]">
                  FASILITAS KESEHATAN
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Sensitif
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Stok obat-obatan esensial, layanan Posyandu pelosok, perban steril, kaporit disinfeksi, dan dukungan nakes relawan. Alamat presisi disamarkan untuk umum.
              </p>
            </div>

            {/* Kategori 5: PENDIDIKAN */}
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[var(--color-text)]">
                DUKUNGAN PENDIDIKAN
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Sekolah darurat pascabencana, buku pelajaran pengganti yang hanyut, seragam siswa kurang mampu, dan relawan pengajar komunitas pedalaman.
              </p>
            </div>

            {/* Kategori 6: SOSIAL LAINNYA */}
            <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[var(--color-text)]">
                SOSIAL LAINNYA
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Bantuan kerentanan komunitas marjinal, dukungan dapur umum darurat mandiri warga, dan logistik posko penampungan sementara.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 4: SOROTAN AKSI LINGKUNGAN HIDUP                   */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                Sorotan Aksi Riil Indonesia
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
                Lingkungan Hidup &amp; Konservasi Alam
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Menampilkan inisiatif nyata gotong royong membersihkan ekosistem dan melindungi keanekaragaman hayati nusantara, bukan hanya merespons bencana saat terjadi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu Lingkungan 1: Bersih Sungai Cikapundung */}
            <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white shadow-xs flex flex-col">
              <div className="relative aspect-[16/10] w-full bg-gray-100">
                <Image
                  src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                  alt="Aksi gotong royong relawan dan warga membersihkan sampah di Sungai Cikapundung Bandung"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold mb-1">
                    <span className="uppercase text-[var(--color-primary)] font-bold">Sungai Cikapundung &bull; Bandung</span>
                    <span>Aksi Gotong Royong</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] leading-snug">
                    Pembersihan Sampah Massal &amp; Normalisasi Bantaran Sungai
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                    Petugas kebersihan bersama ratusan relawan pemuda terjun langsung membersihkan sumbatan sampah plastik dan gulma air untuk mengembalikan daya tampung sungai dan mencegah luapan air di pemukiman padat.
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                  <span>Kategori: LINGKUNGAN</span>
                  <span>Dokumentasi Relawan Jawa Barat</span>
                </div>
              </div>
            </div>

            {/* Kartu Lingkungan 2: Konservasi Satwa Terdampak Karhutla */}
            <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white shadow-xs flex flex-col">
              <div className="relative aspect-[16/10] w-full bg-gray-100">
                <Image
                  src="/images/landing/categories/konservasi-lingkungan-orangutan.jpg"
                  alt="Petugas penyelamat dan dokter hewan mengevakuasi orangutan dari habitat hutan yang terbakar"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold mb-1">
                    <span className="uppercase text-amber-700 font-bold">Kalimantan &bull; Konservasi Satwa</span>
                    <span>Evakuasi Karhutla</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] leading-snug">
                    Penyelamatan Satwa Liar dari Kebakaran Hutan &amp; Lahan
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                    Tim rescue konservasi dan dokter hewan bergotong royong mengevakuasi satwa terlindungi yang terancam kepunahan akibat kebakaran hutan gambut, memberikan perawatan medis intensif, dan merelokasi ke zona aman.
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                  <span>Kategori: LINGKUNGAN / KONSERVASI</span>
                  <span>Dokumentasi Penyelamatan Satwa Liar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 5: CARA KERJA & VERIFIKASI BERLAPIS               */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Integritas &amp; Verifikasi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
              Alur Kerja Faktual &amp; Standar 5W+1H
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Memastikan tidak ada laporan palsu yang dipublikasikan. Hanya laporan yang telah lolos verifikasi ketat yang berhak tampil di peta publik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)] space-y-3">
              <span className="text-xs font-black text-[var(--color-primary)] uppercase tracking-wider">
                Tahap 01
              </span>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Pengajuan 5W+1H
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Relawan mengisi 6 elemen wajib (What, Who, Where, When, Why, How), melampirkan foto bukti (metadata GPS disanitasi di browser), atau memanfaatkan asisten AI.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)] space-y-3">
              <span className="text-xs font-black text-[var(--color-secondary)] uppercase tracking-wider">
                Tahap 02
              </span>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Verifikasi Berlapis
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Ditelaah di modul <code>/verifikasi</code>. Pilihan tingkat: <strong>Komunitas</strong> (minimal 2 persetujuan verifikator independen) atau <strong>Lembaga Resmi</strong> terakreditasi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)] space-y-3">
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                Tahap 03
              </span>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Publikasi Peta Selisih
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Laporan berstatus <code>VERIFIED</code> tampil di peta publik. Kategori rentan disamarkan koordinatnya, dan data basi (&gt;7 hari) otomatis ditandai peringatan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/60 border border-[var(--color-border)] space-y-3">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                Tahap 04
              </span>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Pencatatan Bantuan Tepat
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Relawan mencatat logistik yang disalurkan. Transaksi serializable mengunci kuota agar tidak terjadi alokasi berlebih di satu posko.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 6: PETA TRANSPARANSI (PRATINJAU KE ROOT /)         */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto p-6 sm:p-10 rounded-3xl bg-white border-2 border-[var(--color-border-strong)] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-forest-bg)] text-[var(--color-primary)]">
                Peta Operasional Terbuka
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--color-text)] tracking-tight">
                Peta Spasial Selisih Logistik Seluruh Indonesia
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Peta interaktif Leaflet OpenStreetMap menyajikan status kekurangan besar (merah), kekurangan sedang (kuning), dan hampir terpenuhi (hijau) per wilayah koordinasi.
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
            >
              <MapPin className="w-4 h-4" />
              <span>Buka Peta Operasional Interaktif</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Kartu Pratinjau Editorial Peta (Bukan instance peta kedua) */}
          <div className="p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <strong className="block text-sm text-[var(--color-text)] font-extrabold">
                Fitur Peta di Halaman Utama (<code>/</code>):
              </strong>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[var(--color-text-secondary)]">
                <span className="px-2 py-1 rounded bg-white border border-gray-300">
                  &bull; Ubin OpenStreetMap Bebas Watermark
                </span>
                <span className="px-2 py-1 rounded bg-white border border-gray-300">
                  &bull; Filter Status Selisih &amp; Kategori
                </span>
                <span className="px-2 py-1 rounded bg-white border border-gray-300">
                  &bull; Pelacak Laporan Basi (&gt; 7 Hari)
                </span>
                <span className="px-2 py-1 rounded bg-white border border-gray-300">
                  &bull; Alternatif Tabel Teks Aksesibel
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Jelajahi Sekarang</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 7: STATISTIK AKTUAL DARI DATABASE                */}
      {/* ======================================================== */}
      <section className="py-12 px-4 sm:px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Statistik Faktual Terkini
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              Data Nyata dari Database Kemanusiaan
            </h3>
            <span className="text-xs text-[var(--color-text-secondary)] block">
              Hanya menyajikan angka terverifikasi resmi, tanpa statistik dekoratif palsu.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/50 border border-[var(--color-border)] text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Laporan Terverifikasi Publik
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[var(--color-primary)] tabular-numbers">
                {aggregates.totalVerifiedReports}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] block">
                Memenuhi standar 5W+1H
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/50 border border-[var(--color-border)] text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Catatan Bantuan Terkonfirmasi
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[var(--color-secondary)] tabular-numbers">
                {aggregates.totalConfirmedAidItems}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] block">
                Tervalidasi di posko
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-bg)]/50 border border-[var(--color-border)] text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Wilayah Koordinasi Aktif
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-700 tabular-numbers">
                {aggregates.totalActiveRegions}
              </div>
              <span className="text-[11px] text-[var(--color-text-secondary)] block">
                Titik administratif Indonesia
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 8: DOKUMENTASI & KREDIT ASET FOTO                */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-1 max-w-2xl">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
              Dokumentasi Aksi Lapangan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              Galeri Kemanusiaan &amp; Gotong Royong
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Seluruh aset foto mendokumentasikan aksi masyarakat dan relawan Indonesia secara bermartabat sesuai etika kemanusiaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Foto Dokumentasi 1: Relawan PMI Karhutla */}
            <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white shadow-2xs flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                <Image
                  src="/images/landing/field-activities/relawan-pmi-karhutla.jpg"
                  alt="Relawan Palang Merah Indonesia berjibaku memadamkan kebakaran hutan dan lahan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                    BENCANA / LINGKUNGAN
                  </span>
                  <h3 className="text-xs font-bold text-[var(--color-text)] leading-snug">
                    Pemadaman Karhutla oleh Relawan PMI
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                    Anggota relawan PMI memadamkan kobaran api lahan gambut di bawah kabut asap pekat.
                  </p>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] block">
                  Kredit: Dokumentasi Operasi Karhutla PMI
                </span>
              </div>
            </div>

            {/* Foto Dokumentasi 2: Layanan Posyandu & Lansia */}
            <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white shadow-2xs flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                <Image
                  src="/images/landing/categories/posyandu-kesehatan-lansia.jpg"
                  alt="Tenaga kesehatan dan kader Posyandu melayani lansia dan warga di balai desa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    KESEHATAN / LANSIA
                  </span>
                  <h3 className="text-xs font-bold text-[var(--color-text)] leading-snug">
                    Layanan Posyandu &amp; Pemeriksaan Lansia
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                    Kader kesehatan desa memberikan pendampingan medis rutin bagi kelompok rentan lansia.
                  </p>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] block">
                  Kredit: Dokumentasi Layanan Posyandu Desa
                </span>
              </div>
            </div>

            {/* Foto Dokumentasi 3: Evakuasi Gempa Bumi */}
            <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white shadow-2xs flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                <Image
                  src="/images/landing/categories/evakuasi-bencana-gempa.png"
                  alt="Tim relawan SAR dan warga mengevakuasi korban pascabencana gempa bumi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    BENCANA ALAM
                  </span>
                  <h3 className="text-xs font-bold text-[var(--color-text)] leading-snug">
                    Evakuasi Pascagempa Bumi
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                    Tim SAR gabungan dan warga bergotong royong membuka akses dan menyalurkan logistik darurat.
                  </p>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)] block">
                  Kredit: Dokumentasi Tanggap Bencana SAR Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 9: CTA PENUTUP KEMANUSIAAN                        */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-[var(--color-bg)] border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[var(--color-forest-bg)] text-[var(--color-primary)]">
            Bersama Menghilangkan Ketimpangan Bantuan
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--color-text)] tracking-tight">
            Mulai Pantau Selisih &amp; Laporkan Kebutuhan Riil
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Setiap data kebutuhan yang terverifikasi dan bantuan yang dicatat membantu menyelamatkan logistik dari penumpukan sia-sia dan mengantarkannya ke tangan yang paling membutuhkan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
            >
              <MapPin className="w-4 h-4" />
              <span>Jelajahi Peta Kebutuhan</span>
            </Link>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs sm:text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Laporkan Kebutuhan Baru</span>
            </Link>

            <Link
              href="/darurat"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs sm:text-sm font-bold text-red-700 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Nomor Kontak Darurat</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 10: FOOTER KEMANUSIAAN                            */}
      {/* ======================================================== */}
      <footer className="mt-auto py-10 px-4 sm:px-6 bg-white border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-extrabold text-sm text-[var(--color-text)] tracking-tight">
                TRASEC &bull; Humanitarian Intelligence Platform
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-lg">
                Platform transparansi logistik kemanusiaan di Indonesia. Bebas donasi uang, fokus pada akurasi selisih bantuan riil dan verifikasi terbuka.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--color-text-secondary)]">
              <Link href="/" className="hover:text-[var(--color-primary)]">
                Peta Kebutuhan
              </Link>
              <Link href="/tentang" className="text-[var(--color-primary)] font-bold">
                Tentang Platform
              </Link>
              <Link href="/dashboard" className="hover:text-[var(--color-primary)]">
                Statistik
              </Link>
              <Link href="/darurat" className="hover:text-[var(--color-primary)]">
                Posko Darurat
              </Link>
              <Link href="/antrean" className="hover:text-[var(--color-primary)]">
                Antrean Luring
              </Link>
              <Link href="/login" className="hover:text-[var(--color-primary)]">
                Masuk / Demo
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <span>
              Peta dasar oleh &copy;{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--color-text)]"
              >
                OpenStreetMap
              </a>{" "}
              contributors.
            </span>
            <span>
              Traspac Competition 2026 &bull; Kepatuhan Aturan Bisnis &amp; Privasi Terjaga.
            </span>
          </div>
        </div>
      </footer>

      {/* Tombol Akses Cepat Darurat Mengambang */}
      <FloatingEmergencyButton />
    </div>
  );
}

