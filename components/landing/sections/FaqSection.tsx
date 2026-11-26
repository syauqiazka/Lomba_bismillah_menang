"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function FaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana selisih kebutuhan vs bantuan dihitung di TILARA?",
      a: "Sistem menghitung selisih secara deterministik menggunakan rumus: Selisih = max(0, Total Kebutuhan Tercatat - Total Bantuan Fisik Terkonfirmasi) per pasangan kategori dan satuan ukur spesifik (misal: karung, dus, orang). Bantuan berstatus pending atau ditolak tidak mengurangi angka selisih resmi.",
    },
    {
      q: "Mengapa TILARA 100% tidak menerima donasi uang atau transaksi finansial?",
      a: "TILARA dirancang khusus sebagai Humanitarian Intelligence Platform untuk mengurai ketimpangan penumpukan logistik fisik dan tenaga relawan di posko lapangan. Kami tidak memproses uang, tidak memungut komisi, dan tidak menjadi kompetitor penggalangan dana.",
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
  );
}

