"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function VerifiersAuditSection() {
  return (
    <section id="metodologi" className="py-20 sm:py-28 px-4 sm:px-6 bg-white border-b border-[#E5E0D8]">
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
              Proses audit terbuka: Setiap persetujuan atau revisi logistik wajib mencantumkan catatan verifikator dan skor kepercayaan transparan.
            </p>
          </div>
        </RevealOnScroll>

        {/* 4 Feedback / Verification Review Cards (Bebas Bintang E-Commerce) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <RevealOnScroll direction="up" delayMs={50}>
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DFD5] shadow-xs space-y-3 flex flex-col justify-between h-full hover-lift">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    DISUTUJUI
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Skor: 85/100</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;Foto kerusakan tanggul dan koordinat GPS di Jawa Barat telah dicocokkan dengan laporan warga lokal. Kuota 500 karung disetujui.&rdquo;
                </p>
                <div className="text-[10px] text-slate-500 font-medium bg-white p-2 rounded-lg border border-slate-200">
                  Foto GPS (+30) &bull; Pelapor Terpercaya (+20) &bull; 5W+1H Lengkap (+15)
                </div>
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
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AID CONFIRMED
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Skor: 90/100</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;Bantuan paket hygiene kit telah tiba di posko balai desa dan diserahterimakan kepada keluarga pengungsi sesuai daftar.&rdquo;
                </p>
                <div className="text-[10px] text-slate-500 font-medium bg-white p-2 rounded-lg border border-slate-200">
                  Tanda Terima (+30) &bull; Koordinator Valid (+20) &bull; Kuota Pas (+20)
                </div>
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
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-black">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    OFFICIAL
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Skor: 95/100</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;Data panti jompo telah diverifikasi. Koordinat presisi disamarkan ~1,1 km di API publik demi kenyamanan dan perlindungan lansia.&rdquo;
                </p>
                <div className="text-[10px] text-slate-500 font-medium bg-white p-2 rounded-lg border border-slate-200">
                  Lembaga Terakreditasi (+40) &bull; Sensitif Dikaburkan (+25)
                </div>
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
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SYSTEM AUDIT
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">SERIALIZABLE</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;Transaksi serializable berhasil mengunci kuota 120 tenda secara konkuren. Tidak ada double-allocation saat posko penuh.&rdquo;
                </p>
                <div className="text-[10px] text-slate-500 font-medium bg-white p-2 rounded-lg border border-slate-200">
                  Isolasi Transaksi DB &bull; Race-Condition Safe &bull; 0 Over-supply
                </div>
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
  );
}

