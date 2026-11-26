"use client";

<<<<<<< HEAD
import { useEffect, useRef, useCallback } from "react";
import { X, ArrowRight, ShieldCheck, Layers, AlertCircle, Compass } from "lucide-react";
=======
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, MapPin, Scale, ShieldCheck, ArrowRight } from "lucide-react";
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3

interface IntroBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

<<<<<<< HEAD
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

=======
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
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
<<<<<<< HEAD
        e.preventDefault();
        handleDismiss();
=======
        closeTriggerRef.current = "escape";
        onClose();
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
<<<<<<< HEAD
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
=======
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
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
  );
}
