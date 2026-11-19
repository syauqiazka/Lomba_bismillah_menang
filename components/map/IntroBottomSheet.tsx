"use client";

import { useEffect, useRef } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

interface IntroBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntroBottomSheet({ isOpen, onClose }: IntroBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Tangani penutupan via tombol Escape
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

  return (
    <div
      ref={sheetRef}
      role="region"
      aria-label="Pengantar Platform Humanitarian Intelligence"
      className={`fixed z-[1100] transition-all duration-300 ease-out
        /* Mobile layout: Bottom sheet menempel di bawah */
        inset-x-0 bottom-0 max-h-[75vh] md:max-h-[60vh]
        /* Desktop layout (>=1024px): Floating panel di kiri bawah */
        lg:inset-x-auto lg:left-6 lg:bottom-6 lg:w-[420px] lg:max-h-[85vh]
        bg-[var(--color-surface)] border border-[var(--color-border)]
        rounded-t-2xl lg:rounded-xl flex flex-col overflow-hidden
      `}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      {/* Mobile Drag Handle */}
      <div className="flex lg:hidden justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
        <div className="w-9 h-1 rounded-full bg-[var(--color-border-strong)] opacity-60" />
      </div>

      {/* Header Panel */}
      <div className="flex items-start justify-between px-5 pt-3 pb-2 border-b border-[var(--color-border)]">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-primary)]">
            Panduan Cepat 3 Detik
          </span>
          <h2 className="text-base md:text-lg font-bold text-[var(--color-text)] leading-tight">
            Humanitarian Intelligence Platform
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
          aria-label="Tutup pengantar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body / Konten Orientasi */}
      <div className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm text-[var(--color-text-secondary)]">
        <p className="leading-relaxed">
          Platform operasional untuk memetakan kebutuhan kemanusiaan dan menghitung{" "}
          <strong className="text-[var(--color-text)]">selisih transparan</strong> antara
          kebutuhan lapangan dengan bantuan yang telah terkonfirmasi.{" "}
          <span className="text-[var(--color-text-muted)] italic">
            Bukan situs donasi finansial atau crowdfunding.
          </span>
        </p>

        {/* 3 Butir Panduan Cepat */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Skala Penanda Peta */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
            <div className="flex flex-col gap-1 items-center shrink-0 pt-0.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#B83E37] border-2 border-white shadow-xs" title="Kekurangan Besar" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#E5A13A] border-2 border-white shadow-xs" title="Kekurangan Sedang" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#246B50] border-2 border-white shadow-xs" title="Hampir Terpenuhi" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text)] text-xs mb-0.5">
                1. Skala Selisih Logistik
              </h3>
              <p className="text-[11px] leading-normal text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[#B83E37]">Merah</span>: Selisih &gt;50%
                &bull; <span className="font-semibold text-[#8A5A00]">Kuning</span>: 10%–50%
                &bull; <span className="font-semibold text-[#1B5440]">Hijau</span>: &lt;10%
                terpenuhi.
              </p>
            </div>
          </div>

          {/* 2. Selisih Terhitung Terbuka */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
            <div className="w-6 h-6 rounded bg-[var(--color-info-bg)] text-[var(--color-info-text)] flex items-center justify-center shrink-0 font-bold text-xs">
              &Delta;
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text)] text-xs mb-0.5">
                2. Selisih Terhitung Terbuka
              </h3>
              <p className="text-[11px] leading-normal text-[var(--color-text-secondary)]">
                Selisih dihitung per satuan (kotak, karung, orang). Bantuan hanya dihitung jika
                berstatus <code className="px-1 py-0.5 rounded bg-gray-200 text-[10px]">CONFIRMED</code>.
              </p>
            </div>
          </div>

          {/* 3. Verifikasi & Privasi */}
          <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
            <div className="w-6 h-6 rounded bg-[var(--color-success-bg)] text-[var(--color-success-text)] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text)] text-xs mb-0.5">
                3. Verifikasi Faktual & Privasi
              </h3>
              <p className="text-[11px] leading-normal text-[var(--color-text-secondary)]">
                Semua titik peta telah berstatus <strong className="text-[var(--color-text)]">VERIFIED</strong>.
                Koordinat kelompok rentan (lansia/kesehatan) disamarkan untuk privasi keluarga.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Tombol Aksi Penutup */}
      <div className="p-4 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex items-center justify-between gap-3">
        <span className="text-[11px] text-[var(--color-text-muted)]">
          Tekan <kbd className="px-1 py-0.5 rounded bg-white border border-gray-300 text-[10px]">Esc</kbd> untuk menutup
        </span>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shadow-sm cursor-pointer"
        >
          <span>Jelajahi Peta Langsung</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
