"use client";

import { useState, useEffect } from "react";
import { X, BookOpen, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";

interface IntroBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepItem {
  title: string;
  description: string;
  tips: string;
}

const TOUR_STEPS: StepItem[] = [
  {
    title: "Misi & Intelijen Logistik Kemanusiaan",
    description:
      "TRASEC adalah platform intelijen kemanusiaan terbuka yang memetakan kebutuhan nyata korban bencana dan kerentanan lingkungan dengan bantuan fisik terkonfirmasi. Platform ini 100% bebas donasi finansial dan bebas penumpukan bantuan.",
    tips: "Gunakan peta interaktif ini untuk melihat sebaran posko bantuan dan mengidentifikasi titik wilayah yang belum tersentuh bantuan.",
  },
  {
    title: "Memahami Skala Warna Marker Peta",
    description:
      "Warna setiap titik di peta mencerminkan persentase selisih kebutuhan logistik: Merah (Kekurangan Besar >50%), Kuning (Kekurangan Sedang 10%–50%), dan Hijau (Hampir Terpenuhi / Sisa <10%).",
    tips: "Klik pin merah terlebih dahulu untuk memprioritaskan bantuan logistik ke lokasi yang paling membutuhkan.",
  },
  {
    title: "Perhitungan Selisih Terbuka: max(0, Need - Aid)",
    description:
      "Sistem menghitung selisih matematis: max(0, Kebutuhan - Bantuan Terkonfirmasi) per satuan ukur spesifik tanpa mencampuradukkan satuan. Begitu kuota terpenuhi (selisih = 0), bantuan dialihkan ke lokasi lain.",
    tips: "Setiap catatan bantuan yang berstatus CONFIRMED langsung memotong sisa selisih secara otomatis dan real-time.",
  },
  {
    title: "Etika & Pengaburan Lokasi Korban Rentan",
    description:
      "Demi menjaga privasi dan keamanan warga lansia serta fasilitas kesehatan marjinal, titik koordinat GPS secara otomatis dikaburkan radius ~1,1 km di level server publik.",
    tips: "Alamat presisi dan kontak koordinator lapangan hanya dapat diakses oleh relawan yang telah terverifikasi resmi.",
  },
  {
    title: "Verifikasi 2 Lapis & Standar 5W+1H",
    description:
      "Laporan divalidasi dengan standar 5W+1H dan memerlukan minimal 2 verifikator independen (Komunitas) atau verifikator lembaga resmi (seperti PMI) sebelum dipublikasikan ke peta umum.",
    tips: "Anda dapat berpartisipasi dengan menekan tombol 'Lapor' untuk mengajukan kebutuhan baru atau 'Masuk' sebagai relawan posko.",
  },
];

export function IntroBottomSheet({ isOpen, onClose }: IntroBottomSheetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = TOUR_STEPS.length;

  // Tangani penutupan via tombol Escape dan reset step saat dibuka
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentData = TOUR_STEPS[currentStep - 1];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Langkah demi Langkah Platform"
      className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Modal Card Berfokus Langkah demi Langkah (Persis Gambar Referensi 3) */}
      <div
        className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-scale-in relative text-slate-900"
        style={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Baris Atas: Indikator Langkah + Tombol Tutup */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-primary)]">
            <BookOpen className="w-4 h-4" />
            <span>Langkah {currentStep} dari {totalSteps}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Langkah Terfokus */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
            {currentData.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentData.description}
          </p>

          {/* Kotak Tips Khas Gambar Referensi 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tips Penggunaan:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal pl-5">
              {currentData.tips}
            </p>
          </div>
        </div>

        {/* Baris Bawah: Navigasi (Lewati - Titik Paginasi - Tombol Kembali & Lanjut) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Tombol Lewati di Kiri */}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Lewati
          </button>

          {/* Titik Paginasi (Dots) di Tengah */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => {
              const stepNumber = idx + 1;
              const isActive = currentStep === stepNumber;
              return (
                <button
                  key={stepNumber}
                  type="button"
                  onClick={() => setCurrentStep(stepNumber)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-6 bg-[var(--color-primary)]"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Lompat ke langkah ${stepNumber}`}
                  aria-current={isActive ? "step" : undefined}
                />
              );
            })}
          </div>

          {/* Tombol Aksi di Kanan (Kembali & Lanjut/Selesai) */}
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                aria-label="Langkah sebelumnya"
                title="Langkah sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-black shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentStep === totalSteps ? "Selesai" : "Lanjut"}</span>
              {currentStep === totalSteps ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
