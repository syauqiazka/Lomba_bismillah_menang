"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  BarChart3,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  EyeOff,
  FileCheck2,
  Clock,
  CheckCircle2,
  Send,
  Activity,
  Play,
  X,
  ChevronDown,
  Star,
  Users,
  Sprout,
  Receipt,
  Film,
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
  const [activeTab, setActiveTab] = useState<"misi" | "visi">("misi");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setSubscribeStatus("success");
      setSubscribedEmail("");
      setTimeout(() => setSubscribeStatus("idle"), 4000);
    }
  };

  const faqs = [
    {
      q: "Bagaimana selisih kebutuhan vs bantuan dihitung di TRASEC?",
      a: "Sistem menghitung selisih secara deterministik menggunakan rumus: Selisih = max(0, Total Kebutuhan Tercatat - Total Bantuan Fisik Terkonfirmasi) per pasangan kategori dan satuan ukur spesifik (misal: karung, dus, orang). Bantuan berstatus pending atau ditolak tidak mengurangi angka selisih resmi.",
    },
    {
      q: "Mengapa TRASEC 100% tidak menerima donasi uang atau transaksi finansial?",
      a: "TRASEC dirancang khusus sebagai Humanitarian Intelligence Platform untuk mengurai ketimpangan penumpukan logistik fisik dan tenaga relawan di posko lapangan. Kami tidak memproses uang, tidak memungut komisi, dan tidak menjadi kompetitor penggalangan dana.",
    },
    {
      q: "Bagaimana mekanisme verifikasi dua lapis (komunitas dan lembaga) bekerja?",
      a: "Setiap laporan lapangan wajib divalidasi minimal oleh 2 akun verifikator komunitas yang berbeda (dan bukan pembuat laporan), atau disetujui langsung oleh verifikator dari lembaga resmi terakreditasi (tingkat OFFICIAL) sebelum data kebutuhan dipublikasikan ke peta publik.",
    },
    {
      q: "Bagaimana privasi dan pengaburan lokasi kategori rentan (lansia & kesehatan) dilindungi?",
      a: "Laporan pada kategori LANSIA dan KESEHATAN secara otomatis dikaburkan titik koordinat GPS-nya di lapisan server (~1,1 km radius) serta rincian alamat rumah dihilangkan dari respon publik guna melindungi privasi keluarga penerima manfaat.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E6] text-[#172B3A] flex flex-col selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden font-sans">
      {/* 1. Header Navigasi Melekat (Fixed Navbar) */}
      <Navbar session={session} isSticky />

      {/* ======================================================== */}
      {/* SEKSI 1: HERO EDITORIAL KEMANUSIAAN (PERSIS KIN DORA)    */}
      {/* ======================================================== */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 bg-[#F5F1E6] overflow-hidden">
        {/* Giant Watermark Typography di Latar Belakang */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] sm:text-[180px] md:text-[260px] font-black text-[#E8E3D5] tracking-[0.2em] select-none pointer-events-none -z-0 leading-none"
        >
          TRASEC
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-10">
          {/* Header Title Tengah: Bold, Uppercase Editorial dengan Aksen Serif */}
          <RevealOnScroll direction="up" delayMs={50}>
            <div className="text-center max-w-4xl mx-auto space-y-3.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-white border border-[#E0DBD0] text-[#172B3A] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Humanitarian Intelligence Platform &bull; Indonesia
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] uppercase">
                PANTAU KEBUTUHAN RIIL &amp;{" "}
                <span className="font-serif italic font-normal text-amber-500 block sm:inline">
                  Salurkan Bantuan
                </span>{" "}
                Tanpa Penumpukan
              </h1>
            </div>
          </RevealOnScroll>

          {/* 3-Column Hero Layout (Kiri: Teks & CTA, Tengah: Foto Vertikal ber-Checker Corner, Kanan: Kutipan Faktual) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Kolom Kiri: Penjelasan Kunci & Tombol Masuk Peta (4 Kolom) */}
            <div className="lg:col-span-4 space-y-4 text-left order-2 lg:order-1">
              <RevealOnScroll direction="up" delayMs={100}>
                <div className="space-y-3.5 p-5 rounded-2xl bg-white border border-[#E3DFD5] shadow-xs hover-lift">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span>Real-time Logistik</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Bukan platform donasi uang. TRASEC menghitung dan menampilkan <strong>selisih terbuka</strong> antara kebutuhan warga di lapangan dan bantuan fisik terkonfirmasi per satuan barang dan relawan.
                  </p>
                  <div className="pt-1 flex flex-col gap-2">
                    <Link
                      href="/peta"
                      className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F2A22] hover:bg-[#16382E] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <MapPin className="w-4 h-4 text-amber-400 transition-transform group-hover:scale-110" />
                      <span>Jelajahi Peta Kebutuhan</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/lapor"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-[#D9D3C7] text-xs font-bold transition-colors"
                    >
                      <span>Lapor Kebutuhan (5W+1H)</span>
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Kolom Tengah: Framed Documentary Hero Photo dengan Ornamen Checkerboard Khas KIN DORA (5 Kolom) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <RevealOnScroll direction="scale" delayMs={200}>
                <div className="relative group max-w-sm sm:max-w-md mx-auto">
                  {/* Ornamen Checkerboard Geometris Sudut Khas KIN DORA */}
                  <div aria-hidden="true" className="absolute -top-3 -right-3 w-16 h-16 checker-pattern-gold rounded-tr-2xl z-20 pointer-events-none" />
                  <div aria-hidden="true" className="absolute -bottom-3 -left-3 w-16 h-16 checker-pattern rounded-bl-2xl z-20 pointer-events-none" />

                  <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white aspect-[4/5] sm:aspect-[3/4]">
                    <Image
                      src="/images/landing/hero/gotong-royong-relawan-sungai.jpg"
                      alt="Aksi gotong royong relawan pemuda terjun langsung membersihkan sampah dan sedimentasi aliran sungai di Jawa Barat"
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-xs border border-white/20">
                        Dokumentasi Lapangan &bull; Lingkungan
                      </span>
                      <h3 className="text-sm sm:text-base font-bold leading-tight text-white drop-shadow-sm">
                        Gotong Royong Normalisasi Aliran Sungai di Jawa Barat
                      </h3>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Kolom Kanan: Peringatan Paradoks & Standar 5W+1H (3 Kolom) */}
            <div className="lg:col-span-3 space-y-4 text-left order-3">
              <RevealOnScroll direction="up" delayMs={300}>
                <div className="p-4 rounded-2xl bg-white border border-[#E3DFD5] shadow-xs space-y-2 hover-lift">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Integritas Terbuka</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    Setiap bantuan yang masuk dikonfirmasi di posko. Bantuan yang sudah cukup langsung dialihkan ke titik lain yang membutuhkan.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Audit 5W+1H</span>
                    <span className="text-emerald-700 font-bold">100% Bebas AI Rekayasa</span>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>

        {/* Tepi Sobekan Kertas (Torn Paper Edge Bottom) */}
        <div className="torn-divider-cream-bottom" aria-hidden="true">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 sm:h-10 torn-svg-fill-white">
            <path d="M0,0 L35,28 L78,8 L130,34 L185,12 L240,32 L295,16 L355,30 L420,10 L480,28 L540,8 L610,32 L680,14 L750,30 L810,12 L875,32 L935,16 L995,30 L1060,10 L1120,28 L1175,8 L1200,24 L1200,40 L0,40 Z"></path>
          </svg>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 2: MISI PLATFORM & ASYMMETRIC 3-PHOTO COLLAGE      */}
      {/* ======================================================== */}
      <section id="misi" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Kiri: Teks Misi / Visi Switcher & 2 Pilar (6 Kolom) */}
          <div className="lg:col-span-6 space-y-6">
            <RevealOnScroll direction="up">
              <div className="space-y-3">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
                  Misi Penyaluran Terukur
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                  Menghentikan Ketimpangan <br />
                  <span className="font-serif italic font-normal text-amber-500">
                    Bantuan Kemanusiaan
                  </span>
                </h2>
              </div>
            </RevealOnScroll>

            {/* Interactive Tabs Switcher (Our Mission vs Our Vision) */}
            <div className="inline-flex p-1.5 bg-[#FAF8F5] rounded-full border border-[#E3DFD5]">
              <button
                onClick={() => setActiveTab("misi")}
                className={`px-5 py-2 rounded-full font-heading text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === "misi"
                    ? "bg-[#F5B800] text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Misi Operasional
              </button>
              <button
                onClick={() => setActiveTab("visi")}
                className={`px-5 py-2 rounded-full font-heading text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === "visi"
                    ? "bg-[#F5B800] text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Visi Kemanusiaan
              </button>
            </div>

            <RevealOnScroll direction="up" delayMs={100}>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed min-h-[72px]">
                {activeTab === "misi"
                  ? "Di banyak operasi bencana dan kerentanan lingkungan, logistik sering menumpuk berlebih di posko dekat jalan raya utama, sementara posko pelosok kekurangan air bersih, obat-obatan, dan tenda ramah lansia. TRASEC hadir menghadirkan transparansi selisih riil secara terbuka per satuan barang dan tenaga relawan."
                  : "Mewujudkan Indonesia yang berdaya tahan tangguh di mana setiap posko bencana dan komunitas rentan menerima bantuan tepat sasaran, tepat kuantitas, dan tepat waktu tanpa pemborosan logistik satu barang pun."}
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <RevealOnScroll direction="up" delayMs={200}>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-2 hover-lift">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Transparansi Selisih
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Menghitung <code>max(0, Kebutuhan - Bantuan)</code> per satuan ukur spesifik, mencegah pengiriman saat kuota terpenuhi.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={300}>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-2 hover-lift">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Verifikasi 2 Lapis
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Setiap laporan divalidasi minimal 2 verifikator komunitas atau lembaga resmi sebelum tampil ke publik.
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            <RevealOnScroll direction="up" delayMs={350}>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/peta"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0F2A22] hover:bg-[#16382E] text-white text-xs font-bold transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Jelajahi Peta Operasional</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  100% Non-Finansial
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Kolom Kanan: Kolase Asimetris 3 Foto (Sesuai KIN DORA Section 2) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Foto 1: Lebar di Atas */}
            <RevealOnScroll direction="scale" delayMs={150}>
              <div className="group relative rounded-2xl overflow-hidden border-2 border-[#D9D3C7] shadow-md aspect-[16/9] w-full bg-gray-100 transition-all duration-500 hover:shadow-xl">
                <Image
                  src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                  alt="Aksi gotong royong massal normalisasi sungai dan pembersihan sampah di Bandung"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 550px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300 px-2 py-0.5 rounded bg-black/40">
                    Lingkungan Hidup &bull; Bandung
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-tight mt-1 text-white">
                    Pembersihan Sampah Sungai &amp; Normalisasi Bantaran
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Foto 2 & 3: Dua Kotak Berdampingan di Bawah */}
            <div className="grid grid-cols-2 gap-4">
              <RevealOnScroll direction="up" delayMs={250}>
                <div className="group relative rounded-2xl overflow-hidden border-2 border-[#D9D3C7] shadow-md aspect-[4/3] w-full bg-gray-100 transition-all duration-500 hover:shadow-xl">
                  <Image
                    src="/images/landing/categories/posyandu-kesehatan-lansia.jpg"
                    alt="Pelayanan kesehatan masyarakat dan pendampingan lansia di Posyandu"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 270px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                      Kesehatan Lansia
                    </span>
                    <p className="text-[11px] font-bold leading-tight text-white">
                      Layanan Posyandu Pedesaan
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={350}>
                <div className="group relative rounded-2xl overflow-hidden border-2 border-[#D9D3C7] shadow-md aspect-[4/3] w-full bg-gray-100 transition-all duration-500 hover:shadow-xl">
                  <Image
                    src="/images/landing/field-activities/relawan-pmi-karhutla.jpg"
                    alt="Relawan PMI berjibaku memadamkan kebakaran hutan dan lahan gambut"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 270px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-300">
                      Bencana Karhutla
                    </span>
                    <p className="text-[11px] font-bold leading-tight text-white">
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
      {/* SEKSI 3: CORE VALUES (3 KARTU DI BACKGROUND KREM TORN)   */}
      {/* ======================================================== */}
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
                Tiga Nilai Inti TRASEC
              </h2>
            </div>
          </RevealOnScroll>

          {/* 3 Core Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3DFD5] shadow-xs hover-lift reveal-on-scroll">
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
            <div className="bg-white rounded-2xl p-8 border border-[#E3DFD5] shadow-xs hover-lift reveal-on-scroll delay-100">
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
            <div className="bg-white rounded-2xl p-8 border border-[#E3DFD5] shadow-xs hover-lift reveal-on-scroll delay-200">
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

      {/* ======================================================== */}
      {/* SEKSI 4: KATEGORI KEBUTUHAN & KARTU BER-PROGRESS (KIN DORA)*/}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* SEKSI 5: ETIKA KEMANUSIAAN & PENGABURAN SENSITIF         */}
      {/* ======================================================== */}
      <section id="etika" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F5F1E6] border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Kolom Teks Etika (6 Kolom) */}
          <div className="lg:col-span-6 space-y-6">
            <RevealOnScroll direction="up">
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                  Etika &amp; Keamanan Privasi
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                  Perlindungan Privasi Korban &amp;{" "}
                  <span className="font-serif italic font-normal text-amber-500">
                    Etika Non-Finansial
                  </span>
                </h2>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delayMs={100}>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                TRASEC dirancang bukan untuk mengekspos penderitaan secara sensasional, melainkan untuk mempercepat penyelesaian logistik nyata secara bermartabat.
              </p>
            </RevealOnScroll>

            <div className="space-y-3">
              <RevealOnScroll direction="up" delayMs={150}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E3DFD5] hover-lift">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      100% Bebas Donasi Uang
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Tidak menggalang dana, tidak memungut komisi, murni transparansi logistik fisik dan tenaga relawan.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={250}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E3DFD5] hover-lift">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Pengaburan Koordinat Radius ~1,1 km
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Laporan kategori LANSIA dan KESEHATAN dibulatkan koordinat GPS-nya di server untuk menjaga privasi tempat tinggal.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={350}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E3DFD5] hover-lift">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Penanda Laporan Basi (&gt; 7 Hari)
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Laporan yang tidak memiliki pembaruan selama lebih dari 7 hari otomatis diberi penanda agar relawan memverifikasi ulang.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Kolom Visual Konservasi Satwa (6 Kolom) */}
          <div className="lg:col-span-6">
            <RevealOnScroll direction="scale" delayMs={200}>
              <div className="group relative rounded-3xl overflow-hidden border-2 border-[#D9D3C7] shadow-lg bg-white transition-all duration-500 hover:shadow-xl">
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src="/images/landing/categories/konservasi-lingkungan-orangutan.jpg"
                    alt="Petugas penyelamat mengevakuasi satwa terlindungi dari karhutla"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 550px"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span className="uppercase text-amber-700 font-bold">Konservasi Satwa &bull; Kalimantan</span>
                    <span>Evakuasi Karhutla</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    Penyelamatan Satwa Liar Terdampak Kebakaran Hutan Gambut
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evakuasi intensif dan rehabilitasi satwa terlindungi sebelum direlokasi kembali ke habitat konservasi permanen.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 6: GALERI AKSI NYATA (5 KARTU STRIP KIN DORA)      */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* SEKSI 7: BANNER RELAWAN DENGAN TOMBOL PLAY & STATISTIK   */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#0F2A22] text-white relative">
        <div className="max-w-6xl mx-auto space-y-10">
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
                  45.000+
                </span>
                <span className="text-xs uppercase tracking-wider text-white/80 font-medium">
                  Relawan Kemanusiaan Terkoneksi
                </span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Video Poster dengan Pulsating Play Button */}
          <RevealOnScroll direction="scale" delayMs={150}>
            <div className="relative rounded-3xl overflow-hidden border border-white/20 aspect-[16/9] md:aspect-[21/9] shadow-2xl">
              <Image
                src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                alt="Relawan PMI berkoordinasi di posko pengungsian"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  aria-label="Tonton Dokumenter Singkat Posko"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F5B800] text-slate-950 flex items-center justify-center pulse-play-btn shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs sm:text-sm text-white font-medium bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-xs">
                  Dokumentasi Operasi Posko: Transparansi Alokasi Logistik Kemanusiaan
                </span>
                <Link
                  href="/peta"
                  className="inline-flex items-center gap-2 bg-[#F5B800] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-full shadow transition-colors"
                >
                  <span>Lihat Selisih Terbuka</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* 4 Counter Aktual Database */}
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">Non-Finansial</span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-numbers mt-0.5">
                100%
              </div>
              <span className="text-[10px] text-white/60">0 rupiah diproses</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 8: WILAYAH PRIORITAS OPERASI (PITA KUNING KIN DORA)*/}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* SEKSI 9: TICKER RIBBON KUNING EMAS MIRING (KIN DORA)     */}
      {/* ======================================================== */}
      <div className="py-4 bg-[#F5B800] text-slate-950 overflow-hidden select-none border-y-2 border-amber-500 transform -skew-y-1 my-4 shadow-sm">
        <div className="animate-marquee">
          <div className="flex items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-black uppercase tracking-widest pr-10">
            <span>&bull; TRANSPARANSI LOGISTIK KEMANUSIAAN RIIL</span>
            <span>&bull; 100% BEBAS TRANSAKSI FINANSIAL</span>
            <span>&bull; SELISIH = MAX(0, KEBUTUHAN - BANTUAN)</span>
            <span>&bull; STANDAR VALIDASI 5W+1H</span>
            <span>&bull; PENGABURAN KOORDINAT LANSIA &amp; KESEHATAN</span>
            <span>&bull; VERIFIKASI DUA LAPIS KOMUNITAS</span>
            <span>&bull; TRASEC HUMANITARIAN PLATFORM INDONESIA</span>
          </div>
          <div className="flex items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-black uppercase tracking-widest pr-10" aria-hidden="true">
            <span>&bull; TRANSPARANSI LOGISTIK KEMANUSIAAN RIIL</span>
            <span>&bull; 100% BEBAS TRANSAKSI FINANSIAL</span>
            <span>&bull; SELISIH = MAX(0, KEBUTUHAN - BANTUAN)</span>
            <span>&bull; STANDAR VALIDASI 5W+1H</span>
            <span>&bull; PENGABURAN KOORDINAT LANSIA &amp; KESEHATAN</span>
            <span>&bull; VERIFIKASI DUA LAPIS KOMUNITAS</span>
            <span>&bull; TRASEC HUMANITARIAN PLATFORM INDONESIA</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SEKSI 10: CATATAN VERIFIKATOR (WHAT SUPPORTERS SAY)      */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto space-y-10">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                Akuntabilitas Lapangan
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
                Catatan Verifikator Lapangan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Proses audit terbuka: Setiap persetujuan atau revisi logistik wajib mencantumkan catatan verifikator yang dapat dipertanggungjawabkan.
              </p>
            </div>
          </RevealOnScroll>

          {/* 4 Feedback / Verification Review Cards Khas KIN DORA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <RevealOnScroll direction="up" delayMs={50}>
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-3 flex flex-col justify-between h-full hover-lift">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 ml-1">5.00</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;Foto kerusakan tanggul dan koordinat GPS di Jawa Barat telah dicocokkan dengan laporan warga lokal. Kuota 500 karung disetujui.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E3DFD5] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                    VK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Verifikator Komunitas</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Relawan Independen</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 2 */}
            <RevealOnScroll direction="up" delayMs={100}>
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-3 flex flex-col justify-between h-full hover-lift">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 ml-1">5.00</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;Bantuan paket hygiene kit telah tiba di posko balai desa dan diserahterimakan kepada keluarga pengungsi sesuai daftar.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E3DFD5] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                    KL
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Koordinator Lapangan</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Posko Bencana PMI</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 3 */}
            <RevealOnScroll direction="up" delayMs={150}>
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-3 flex flex-col justify-between h-full hover-lift">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 ml-1">5.00</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;Data panti jompo telah diverifikasi. Koordinat presisi disamarkan ~1,1 km di API publik demi kenyamanan dan perlindungan lansia.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E3DFD5] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center">
                    VR
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Verifikator Lembaga</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Organisasi Terakreditasi</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 4 */}
            <RevealOnScroll direction="up" delayMs={200}>
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-3 flex flex-col justify-between h-full hover-lift">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 ml-1">5.00</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;Transaksi serializable berhasil mengunci kuota 120 tenda secara konkuren. Tidak ada double-allocation saat posko penuh.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E3DFD5] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                    AD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Administrator Sistem</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Audit Arsitektur Database</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 11: FAQ ACCORDION (PERTANYAAN LAZIM INTERAKTIF)     */}
      {/* ======================================================== */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F5F1E6] border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Kolom Kiri: Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <RevealOnScroll direction="up">
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                  Panduan &amp; Integritas
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
                  Pertanyaan Sering Diajukan
                </h2>
              </div>
            </RevealOnScroll>

            <div className="space-y-4 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E3DFD5] p-5 shadow-xs transition-all duration-200"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-heading text-sm sm:text-base font-bold uppercase text-slate-900 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ml-4 ${
                          isOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Foto Warm Ambience */}
          <div className="lg:col-span-5">
            <RevealOnScroll direction="scale" delayMs={150}>
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-[4/5] bg-white">
                <Image
                  src="/images/landing/hero/gotong-royong-relawan-sungai.jpg"
                  alt="Relawan gotong royong"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-bold uppercase text-amber-300">Gotong Royong Tanpa Pamrih</span>
                  <h4 className="font-heading font-black text-lg uppercase text-white mt-1">
                    Bersama Memastikan Bantuan Sampai ke Titik Tepat
                  </h4>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 12: BERITA & DOKUMENTASI (LATEST NEWS IN KIN DORA) */}
      {/* ======================================================== */}
      <section id="berita" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto space-y-10">
          <RevealOnScroll direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                Kabar Operasi Terkini
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
                Catatan Lapangan &amp; Berita Terbaru
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Berita Utama Kiri (7 Kolom) */}
            <div className="lg:col-span-7">
              <RevealOnScroll direction="scale" delayMs={50}>
                <div className="group rounded-2xl overflow-hidden border border-[#E3DFD5] bg-[#FAF8F5] shadow-xs hover-lift flex flex-col justify-between h-full">
                  <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                    <Image
                      src="/images/landing/field-activities/bersih-sungai-cikapundung.jpg"
                      alt="Gotong royong sungai"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 650px"
                    />
                  </div>
                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                        LINGKUNGAN
                      </span>
                      <span>18 November 2026</span>
                      <span>Jawa Barat</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                      Normalisasi Aliran Sungai Berhasil Mereduksi Titik Genangan Banjir
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      Ratusan relawan gabungan bersama warga menuntaskan pengangkatan sampah pemicu sumbatan air. Sistem menandai kuota karung dan relawan telah tercapai dan mengarahkan relawan baru ke titik berikutnya.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/peta"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
                      >
                        <span>Lihat Rincian Posko</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* 3 Berita Stacked Kanan (5 Kolom) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {/* Item 1 */}
              <RevealOnScroll direction="up" delayMs={100}>
                <div className="group p-4 rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] hover:border-amber-400 hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src="/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg"
                      alt="Tenda darurat"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-red-700 uppercase tracking-wider">
                      BENCANA &bull; 17 NOV 2026
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                      Penyaluran Tenda Pengungsian Ramah Lansia &amp; Balita
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                      Kebutuhan 12 tenda peleton tervalidasi 2 verifikator.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Item 2 */}
              <RevealOnScroll direction="up" delayMs={200}>
                <div className="group p-4 rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] hover:border-amber-400 hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src="/images/landing/field-activities/relawan-tanam-penghijauan-lingkungan.jpg"
                      alt="Penanaman pohon"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                      LINGKUNGAN &bull; 15 NOV 2026
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                      Gotong Royong Menanam 500 Bibit Pohon di Hulu Sungai
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                      Partisipasi pemuda relawan berhasil menutup target bibit.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Item 3 */}
              <RevealOnScroll direction="up" delayMs={300}>
                <div className="group p-4 rounded-xl border border-[#E3DFD5] bg-[#FAF8F5] hover:border-amber-400 hover:shadow-md transition-all duration-300 flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src="/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg"
                      alt="Distribusi hygiene kit"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-teal-700 uppercase tracking-wider">
                      SANITASI &bull; 12 NOV 2026
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                      Penyaluran Paket Sanitasi Ember Hygiene Kit ke Posko
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                      Kebutuhan sabun dan disinfektan tercukupi di 3 posko.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="up" delayMs={350}>
                <div className="pt-2">
                  <Link
                    href="/peta"
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D9D3C7] bg-[#FAF8F5] hover:bg-white text-slate-900 text-xs font-bold text-center block transition-colors shadow-2xs"
                  >
                    Buka Seluruh Laporan di Peta Interaktif
                  </Link>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEKSI 13: CTA SECTION (DARK FOREST GREEN #0F2A22)        */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* SEKSI 14: DEEP BLACK FOOTER (PERSIS KIN DORA FOOTER)     */}
      {/* ======================================================== */}
      <footer className="mt-auto bg-[#0A0E13] text-gray-400 text-xs pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Baris Atas Footer: Logo + Tombol Aksi Kanan (Persis KIN DORA) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base tracking-wider shadow-sm">
                TR
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-white tracking-tight leading-none">
                  TRASEC
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

            {/* Kolom 4: Langganan Informasi Posko */}
            <div className="space-y-3">
              <span className="text-xs font-black text-white uppercase tracking-wider block">
                Buletin Transparansi
              </span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Dapatkan rekapitulasi mingguan selisih kebutuhan posko lapangan di seluruh wilayah koordinasi.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    placeholder="Alamat email Anda..."
                    required
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {subscribeStatus === "success" && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Terima kasih! Email Anda telah terdaftar untuk menerima rekapitulasi data posko.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Baris Hak Cipta & Prinsip Integritas */}
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} TRASEC. Platform Transparansi Kebutuhan &amp; Bantuan Relawan Indonesia. 100% Non-Finansial.
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

      {/* Modal Video Dokumenter (Interactive Simulation) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <div
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />
          <div className="relative bg-black rounded-3xl max-w-3xl w-full aspect-video overflow-hidden shadow-2xl z-10 border border-white/20">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              aria-label="Tutup Video"
              className="absolute top-4 right-4 text-white/80 hover:text-white z-20 bg-black/50 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center bg-neutral-900">
              <div className="w-16 h-16 rounded-full bg-[#F5B800] text-slate-950 flex items-center justify-center mb-4 shadow-lg">
                <Film className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-xl sm:text-2xl font-bold uppercase mb-2">
                Dokumenter Operasi Posko Relawan
              </h4>
              <p className="text-xs text-white/70 max-w-md mb-6 leading-relaxed">
                Melihat langsung bagaimana data selisih terbuka mencegah penumpukan logistik dan mengalirkan bantuan ke posko-posko terpencil di Jawa Barat.
              </p>
              <span className="text-[11px] text-amber-400 uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/10">
                Pratinjau Kemanusiaan 100% Non-Finansial
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Darurat Melayang Cepat */}
      <FloatingEmergencyButton />
    </div>
  );
}
