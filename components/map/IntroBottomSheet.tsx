"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, MapPin, Scale, ShieldCheck, ArrowRight } from "lucide-react";

interface IntroBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Bottom Sheet Pengantar Operasional (Opsi C — DESIGN.md Bagian 8.1).
 * Bersifat non-modal agar kanvas peta tetap dapat dioperasikan di luar area sheet.
 */
export function IntroBottomSheet({
  isOpen,
  onClose,
  returnFocusRef,
}: IntroBottomSheetProps) {
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const closeTriggerRef = useRef<"escape" | "action" | null>(null);

  // Tutup dengan tombol Escape dan kembalikan fokus ke tombol pemicu Panduan
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeTriggerRef.current = "escape";
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && closeTriggerRef.current === "escape") {
      closeTriggerRef.current = null;
      returnFocusRef?.current?.focus();
    }
  }, [isOpen, returnFocusRef]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffsetY > 72) {
      setDragOffsetY(0);
      touchStartYRef.current = null;
      onClose();
      return;
    }
    setDragOffsetY(0);
    touchStartYRef.current = null;
  };

  return (
    <section
      role="region"
      aria-label="Pengantar Platform"
      style={{
        boxShadow: "var(--shadow-elevated)",
        transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
      }}
      className="fixed z-[1100] bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:w-[400px] md:max-w-[calc(100vw-48px)] max-h-[55vh] md:max-h-[calc(100vh-110px)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-xl md:rounded-lg flex flex-col overflow-hidden transition-transform duration-200 ease-out"
    >
      {/* Bilah Pegangan Geser (Khusus Mobile) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="md:hidden pt-2.5 pb-1 flex justify-center touch-none cursor-grab"
        aria-hidden="true"
      >
        <span className="w-9 h-1 rounded-full bg-[var(--color-border-strong)]" />
      </div>

      {/* Header Sheet */}
      <div className="px-4 pt-2 pb-3 md:pt-4 border-b border-[var(--color-border)] flex items-start justify-between gap-3">
        <div>
          <span className="inline-block px-2 py-0.5 mb-1.5 rounded text-[11px] font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)]">
            Transparansi Logistik Lapangan
          </span>
          <h2 className="text-lg font-semibold text-[var(--color-text)] leading-snug">
            Humanitarian Intelligence Platform
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] -mt-1 -mr-2 flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors cursor-pointer"
          aria-label="Tutup pengantar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Isi Konten Scrollable */}
      <div className="px-4 py-3 overflow-y-auto space-y-3 text-sm text-[var(--color-text-secondary)] pb-[max(12px,env(safe-area-inset-bottom))]">
        <p className="leading-relaxed text-[var(--color-text)]">
          Alat transparansi selisih kebutuhan dan bantuan relawan per lokasi dan per satuan. Bukan situs penggalangan dana.
        </p>

        {/* Panduan 3 Detik */}
        <ul className="space-y-2.5 pt-1" aria-label="Panduan 3 detik membaca peta">
          <li className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-primary)]" aria-hidden="true" />
            <div>
              <strong className="text-[var(--color-text)] block text-xs">
                Peta Kebutuhan
              </strong>
              <span className="text-xs leading-snug block">
                Warna pin menunjukkan selisih logistik:{" "}
                <span className="font-semibold text-[#B83E37]">Merah (&gt;50%)</span>,{" "}
                <span className="font-semibold text-[var(--color-warning-text)]">Kuning (10%–50%)</span>,{" "}
                <span className="font-semibold text-[var(--color-success-text)]">Hijau (&lt;10%)</span>.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <Scale className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-primary)]" aria-hidden="true" />
            <div>
              <strong className="text-[var(--color-text)] block text-xs">
                Selisih Transparan
              </strong>
              <span className="text-xs leading-snug block">
                Menghitung kebutuhan dikurangi bantuan terkonfirmasi per satuan barang atau tenaga agar tidak menumpuk di satu titik.
              </span>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-primary)]" aria-hidden="true" />
            <div>
              <strong className="text-[var(--color-text)] block text-xs">
                Verifikasi Faktual
              </strong>
              <span className="text-xs leading-snug block">
                Setiap laporan dikurasi relawan terverifikasi atau lembaga resmi beserta rincian skor kepercayaan.
              </span>
            </div>
          </li>
        </ul>

        {/* Tombol Aksi */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 transition-colors cursor-pointer"
          >
            <span>Jelajahi Peta Langsung</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <Link
            href="/tentang"
            className="min-h-[44px] px-3 py-2.5 rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-surface-hover)] text-sm font-semibold inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 transition-colors"
          >
            Tentang
          </Link>
        </div>
      </div>
    </section>
  );
}
