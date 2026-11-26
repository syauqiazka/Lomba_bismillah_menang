"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, FileCheck2, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function MissionVisionSection() {
  const [activeTab, setActiveTab] = useState<"misi" | "visi">("misi");

  return (
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
                ? "Di banyak operasi bencana dan kerentanan lingkungan, logistik sering menumpuk berlebih di posko dekat jalan raya utama, sementara posko pelosok kekurangan air bersih, obat-obatan, dan tenda ramah lansia. TILARA hadir menghadirkan transparansi selisih riil secara terbuka per satuan barang dan tenaga relawan."
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
  );
}

