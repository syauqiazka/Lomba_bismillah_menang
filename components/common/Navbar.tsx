"use client";

import Link from "next/link";
import { HelpCircle, PlusCircle, List, PhoneCall, User, LogIn, BarChart3, Info } from "lucide-react";
import type { SessionData } from "@/lib/session-options";

interface NavbarProps {
  session?: SessionData | null;
  onOpenIntro?: () => void;
  isIntroOpen?: boolean;
  panduanButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onToggleTextView?: () => void;
  isTextViewOpen?: boolean;
  isSticky?: boolean;
}

export function Navbar({
  session,
  onOpenIntro,
  isIntroOpen = false,
  panduanButtonRef,
  onToggleTextView,
  isTextViewOpen = false,
  isSticky = false,
}: NavbarProps) {
  const isLoggedIn = Boolean(session && session.userId);

  return (
    <header
      role="banner"
      className={`${isSticky ? "fixed" : "absolute"} top-0 left-0 right-0 z-[1000] bg-[var(--color-surface)] border-b border-[var(--color-border)] px-3 sm:px-4 py-1.5`}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Identitas Brand (Logo menuju / Peta Operasional) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[44px] pr-1 group focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] rounded"
            aria-label="TRASEC Peta Operasional"
          >
            <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm tracking-wide">
              TR
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm md:text-base text-[var(--color-text)] tracking-tight leading-none group-hover:text-[var(--color-primary)] transition-colors">
                TRASEC
              </span>
              <span className="hidden sm:block text-[11px] text-[var(--color-text-secondary)] font-semibold">
                Humanitarian Intel
              </span>
            </div>
          </Link>

          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-border)]">
            Transparansi Bantuan Riil
          </span>
        </div>

        {/* Kontrol & Navigasi */}
        <nav aria-label="Navigasi utama" className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
          {/* Tombol Panduan (Buka Ulang Pengantar) */}
          {onOpenIntro && (
            <button
              ref={panduanButtonRef}
              type="button"
              onClick={onOpenIntro}
              aria-expanded={isIntroOpen}
              className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors cursor-pointer shrink-0"
              aria-label="Buka panduan peta"
              title="Panduan Membaca Peta & Selisih"
            >
              <HelpCircle className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
              <span className="hidden md:inline">Panduan</span>
            </button>
          )}

          {/* Tombol Alternatif Tabel Teks */}
          {onToggleTextView && (
            <button
              type="button"
              onClick={onToggleTextView}
              aria-expanded={isTextViewOpen}
              className={`inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] shrink-0 ${
                isTextViewOpen
                  ? "bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border-[var(--color-border)]"
              }`}
              aria-label="Tampilkan data peta dalam format tabel teks"
              title="Daftar Teks Aksesibel"
            >
              <List className="w-4 h-4" aria-hidden="true" />
              <span className="hidden lg:inline">Daftar Teks</span>
            </button>
          )}

          {/* Tautan Tentang Platform */}
          <Link
            href="/tentang"
            className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shrink-0"
            title="Tentang Platform TRASEC"
            aria-label="Tentang TRASEC"
          >
            <Info className="w-4 h-4 text-[var(--color-secondary)]" aria-hidden="true" />
            <span className="hidden md:inline">Tentang</span>
          </Link>

          {/* Tautan Dashboard Statistik Publik */}
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shrink-0"
            title="Dashboard Statistik Agregat Nasional"
            aria-label="Statistik Publik"
          >
            <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
            <span className="hidden lg:inline">Statistik</span>
          </Link>

          {/* Tautan Kontak Darurat */}
          <Link
            href="/darurat"
            className="hidden sm:inline-flex items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded text-white bg-[var(--color-danger-text)] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-opacity shrink-0"
            title="Nomor Darurat Nasional & Posko"
            aria-label="Direktori Darurat"
          >
            <PhoneCall className="w-4 h-4" aria-hidden="true" />
            <span className="hidden lg:inline">Darurat</span>
          </Link>

          {/* Tombol Buat Laporan */}
          <Link
            href="/lapor"
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 text-xs font-semibold rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Lapor</span>
          </Link>

          {/* Status Sesi & Masuk */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[var(--color-border)] shrink-0">
              <span
                className="hidden xl:inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                title={`Masuk sebagai ${session?.name} (${session?.role})`}
              >
                <User className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" aria-hidden="true" />
                <span className="max-w-[100px] truncate">{session?.name}</span>
              </span>
              <Link
                href="/antrean"
                className="inline-flex items-center min-h-[44px] px-2.5 text-xs font-semibold rounded bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-[var(--color-text)] transition-colors"
                title="Antrean Pengiriman Luring"
              >
                Antrean
              </Link>
              {session?.role === "VERIFIKATOR" && (
                <Link
                  href="/verifikasi"
                  className="inline-flex items-center min-h-[44px] px-2.5 text-xs font-semibold rounded bg-[var(--color-info-bg)] text-[var(--color-info-text)] hover:underline"
                >
                  Verifikasi
                </Link>
              )}
              {session?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center min-h-[44px] px-2.5 text-xs font-semibold rounded bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] hover:underline"
                >
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shrink-0"
              aria-label="Masuk akun relawan"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Masuk</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
