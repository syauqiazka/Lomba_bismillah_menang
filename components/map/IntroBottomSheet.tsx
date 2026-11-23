"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, ArrowRight, ShieldCheck, Layers, AlertCircle, Compass } from "lucide-react";

interface IntroBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntroBottomSheet({ isOpen, onClose }: IntroBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Tangani penutupan dengan tombol Escape dan pemulihan fokus ke tombol Panduan
  const handleDismiss = useCallback(() => {
    onClose();
    // Kembalikan fokus keyboard ke tombol panduan navigasi secara sopan
    setTimeout(() => {
      const triggerBtn = document.getElementById("nav-panduan");
      if (triggerBtn) {
        triggerBtn.focus();
      }
    }, 50);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleDismiss]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Halus (Hanya di layar ponsel <768px, tidak memblokir desktop) */}
      <div
        className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-[1090] transition-opacity"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Kontainer Bottom Sheet (Opsi C: Fixed Bottom di Mobile, Floating Card di Desktop Kiri Bawah) */}
      <section
        ref={sheetRef}
        role="region"
        aria-label="Pengantar Platform"
        className="fixed z-[1100] transition-all duration-300 ease-out
          bottom-0 left-0 right-0 max-h-[60vh] md:max-h-none md:bottom-6 md:left-6 md:right-auto md:w-[410px]
          bg-white border-t md:border border-slate-200/90 rounded-t-2xl md:rounded-2xl
          shadow-2xl md:shadow-xl overflow-hidden flex flex-col"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Pegangan Geser (Drag Handle) untuk Ponsel */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center cursor-pointer" onClick={handleDismiss}>
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Konten Utama Sheet */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Header & Tombol Tutup */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                <Compass className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Humanitarian Intelligence
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Transparansi Selisih Logistik
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors"
              aria-label="Tutup pengantar platform"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ringkasan Singkat & Pernyataan Integritas */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Platform terbuka pemetaan kebutuhan riil dan penyaluran bantuan logistik di Indonesia.{" "}
            <strong className="text-slate-900 font-semibold">
              100% bebas donasi uang
            </strong>{" "}
            untuk mencegah penumpukan bantuan di satu lokasi sementara titik lain terabaikan.
          </p>

          {/* 3 Poin Panduan Cepat (Terbaca dalam 3 Detik) */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <div className="w-5 h-5 rounded-md bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-3 h-3 text-red-600" />
              </div>
              <p className="leading-snug">
                <strong className="text-slate-900">Pin Merah (&gt;50%)</strong>: Titik darurat dengan kekurangan logistik besar.
              </p>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-3 h-3 text-amber-700" />
              </div>
              <p className="leading-snug">
                <strong className="text-slate-900">Pin Kuning (10–50%)</strong>: Kekurangan sedang, bantuan sedang disalurkan.
              </p>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
              </div>
              <p className="leading-snug">
                <strong className="text-slate-900">Pin Hijau (&lt;10%)</strong>: Kebutuhan hampir terpenuhi, cegah over-supply.
              </p>
            </div>
          </div>

          {/* Tombol Aksi Utama */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              <span>Jelajahi Peta Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Tekan tombol <strong className="text-slate-600">Panduan</strong> di bilah atas untuk membuka ringkasan ini kapan saja.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
