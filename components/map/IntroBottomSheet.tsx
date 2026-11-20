"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, BookOpen, ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";

interface IntroBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepItem {
  targetSelector: string;
  title: string;
  description: string;
  tips: string;
}

const TOUR_STEPS: StepItem[] = [
  {
    targetSelector: '[data-tour="brand-logo"]',
    title: "Misi & Intelijen Logistik Kemanusiaan",
    description:
      "TRASEC adalah platform intelijen kemanusiaan terbuka yang memetakan kebutuhan nyata lapangan dengan bantuan fisik terkonfirmasi. Platform ini 100% bebas donasi uang untuk mencegah penumpukan bantuan di satu titik.",
    tips: "Klik logo TRASEC kapan saja untuk kembali ke halaman utama ringkasan editorial.",
  },
  {
    targetSelector: '[data-tour="map-filters"]',
    title: "Filter Kategori & Skala Selisih",
    description:
      "Saring titik pantauan berdasarkan 6 kategori resmi (Bencana, Lingkungan, Lansia, Kesehatan, Pendidikan, Sosial) dan skala keparahan defisit logistik secara real-time.",
    tips: "Pilih 'Kekurangan Besar (>50%)' untuk memprioritaskan bantuan logistik ke wilayah yang paling kritis.",
  },
  {
    targetSelector: '[data-tour="nav-emergency"]',
    title: "Akses Kontak Darurat Nasional",
    description:
      "Hubungi layanan darurat resmi negara (112 Terpadu, 115 Basarnas, 117 BNPB, 119 Ambulans) dan posko lokal yang siap pakai secara luring saat situasi genting.",
    tips: "Akses nomor darurat ini tetap dapat dibuka tanpa sambungan internet melalui cache lokal.",
  },
  {
    targetSelector: '[data-tour="nav-report"]',
    title: "Formulir Pelaporan 5W+1H",
    description:
      "Ajukan kebutuhan logistik atau pemantauan lingkungan dengan standar What, Who, Where, When, Why, How yang diverifikasi komunitas dan lembaga resmi.",
    tips: "Fitur pelaporan mendukung antrean luring (offline-queue) jika Anda berada di area blank spot sinyal.",
  },
  {
    targetSelector: '[data-tour="nav-panduan"]',
    title: "Buka Ulang Panduan Kapan Saja",
    description:
      "Anda dapat membuka kembali tur langkah-demi-langkah (Spotlight Walkthrough) ini kapan saja dengan menekan tombol Panduan di bilah atas.",
    tips: "Gunakan tombol 'Daftar Teks' di sampingnya jika membutuhkan format tabel yang ringan dan hemat kuota data.",
  },
];

interface RectState {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function IntroBottomSheet({ isOpen, onClose }: IntroBottomSheetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [targetRect, setTargetRect] = useState<RectState | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const totalSteps = TOUR_STEPS.length;
  const currentData = TOUR_STEPS[currentStep - 1];

  // Perbarui posisi koordinat target element (Spotlight Cutout)
  const updateTargetRect = useCallback(() => {
    if (!isOpen) return;

    const selector = currentData.targetSelector;
    const el = document.querySelector(selector);

    if (el) {
      // Pastikan target tampak di layar (scroll jika di luar viewport)
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

      const clientRect = el.getBoundingClientRect();
      const PADDING = 6;

      setTargetRect({
        top: Math.max(0, clientRect.top - PADDING),
        left: Math.max(0, clientRect.left - PADDING),
        width: clientRect.width + PADDING * 2,
        height: clientRect.height + PADDING * 2,
        bottom: clientRect.bottom + PADDING,
        right: clientRect.right + PADDING,
      });
    } else {
      // Jika elemen tidak ditemukan (misal di mobile tertentu), fallback ke modal tengah
      setTargetRect(null);
    }
  }, [isOpen, currentData]);

  // Listener saat step berubah, resize jendela, atau scroll halaman
  useEffect(() => {
    if (!isOpen) return;

    // Tunggu render DOM selesai
    const timer = setTimeout(updateTargetRect, 50);

    const handleResizeOrScroll = () => {
      updateTargetRect();
    };

    window.addEventListener("resize", handleResizeOrScroll, { passive: true });
    window.addEventListener("scroll", handleResizeOrScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [isOpen, currentStep, updateTargetRect]);

  // Keyboard navigation (Escape, ArrowRight, ArrowLeft)
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (currentStep < totalSteps) {
          setCurrentStep((prev) => prev + 1);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 1) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, totalSteps, onClose]);

  if (!isOpen) return null;

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

  // Hitung posisi Tooltip Card relatif terhadap target spotlight
  const computeCardStyle = (): React.CSSProperties => {
    if (typeof window === "undefined") return {};

    const CARD_WIDTH = Math.min(420, window.innerWidth - 32);
    const CARD_HEIGHT_ESTIMATE = 290;
    const SPACING = 14;

    if (!targetRect) {
      // Posisi di tengah layar (Fallback)
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${CARD_WIDTH}px`,
        maxWidth: "92vw",
        zIndex: 1250,
      };
    }

    // Penentuan posisi vertikal: di bawah elemen jika muat, atau di atas elemen
    let top = targetRect.bottom + SPACING;

    if (top + CARD_HEIGHT_ESTIMATE > window.innerHeight) {
      // Coba taruh di atas elemen
      const topAbove = targetRect.top - CARD_HEIGHT_ESTIMATE - SPACING;
      if (topAbove >= 12) {
        top = topAbove;
      } else {
        // Jika kedua sisi sempit, posisikan di tengah vertikal yang paling lega
        top = Math.max(12, Math.min(window.innerHeight - CARD_HEIGHT_ESTIMATE - 16, top));
      }
    }

    // Penentuan posisi horizontal: sejajar tengah target, diapit tepi layar (clamped)
    const targetCenterX = targetRect.left + targetRect.width / 2;
    let left = targetCenterX - CARD_WIDTH / 2;
    left = Math.max(16, Math.min(window.innerWidth - CARD_WIDTH - 16, left));

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${CARD_WIDTH}px`,
      maxWidth: "92vw",
      zIndex: 1250,
      transition: "top 0.3s cubic-bezier(0.16, 1, 0.3, 1), left 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    };
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tur Panduan Langkah-demi-Langkah Platform"
      className="fixed inset-0 z-[1200] overflow-hidden select-none"
    >
      {/* ======================================================== */}
      {/* 1. OVERLAY MASK & SPOTLIGHT CUT-OUT (EFEK SPOTLIGHT)      */}
      {/* ======================================================== */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-[1200]"
        aria-hidden="true"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* Latar putih solid: seluruh layar ditutupi warna gelap */}
            <rect width="100%" height="100%" fill="white" />

            {/* Lubang tembus pandang hitam (Spotlight Cutout) */}
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="10"
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>

        {/* Latar belakang gelap berbayang (Overlay Mask) */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(8, 14, 22, 0.72)"
          mask="url(#tour-spotlight-mask)"
          className="pointer-events-auto cursor-pointer"
          onClick={onClose}
        />
      </svg>

      {/* ======================================================== */}
      {/* 2. BINGKAI HIGHLIGHT SPOTLIGHT MENYOROT ELEMEN TARGET     */}
      {/* ======================================================== */}
      {targetRect && (
        <div
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            borderRadius: "10px",
          }}
          className="fixed z-[1220] pointer-events-none border-2 border-white ring-4 ring-emerald-500/60 shadow-[0_0_35px_rgba(255,255,255,0.7)] transition-all duration-300 ease-out animate-pulse"
        />
      )}

      {/* ======================================================== */}
      {/* 3. KOTAK PANDUAN (TOOLTIP CARD) PERSIS GAMBAR REFERENSI   */}
      {/* ======================================================== */}
      <div
        ref={cardRef}
        style={computeCardStyle()}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-4 animate-scale-in text-slate-900 pointer-events-auto"
        style-shadow="0 25px 50px -12px rgba(0, 0, 0, 0.35)"
      >
        {/* Baris Atas: Indikator Langkah + Tombol Silang */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-primary)]">
            <BookOpen className="w-4 h-4" />
            <span>
              Langkah {currentStep} dari {totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Konten Langkah Terfokus */}
        <div className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
            {currentData.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentData.description}
          </p>

          {/* Kotak Tips Khas Gambar Referensi */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tips:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal pl-5">
              {currentData.tips}
            </p>
          </div>
        </div>

        {/* Baris Bawah: Navigasi (Lewati - Titik Paginasi - Tombol Kembali & Lanjut) */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Tombol Lewati di Kiri */}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Lewati
          </button>

          {/* Titik Paginasi (Dots) di Tengah */}
          <div className="flex items-center gap-1.5" aria-label="Indikator langkah tur">
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
                />
              );
            })}
          </div>

          {/* Tombol Navigasi Kanan (Kembali & Lanjut/Selesai) */}
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                aria-label="Langkah sebelumnya"
                title="Langkah sebelumnya"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span>{currentStep === totalSteps ? "Selesai" : "Lanjut"}</span>
              {currentStep === totalSteps ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
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
