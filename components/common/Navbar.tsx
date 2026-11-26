"use client";

import Link from "next/link";
<<<<<<< HEAD
import Image from "next/image";
import { HelpCircle, PlusCircle, List, PhoneCall, User, LogIn, BarChart3, Info, MapPin, FileText } from "lucide-react";
=======
import { HelpCircle, PlusCircle, List, PhoneCall, User, LogIn, BarChart3, Info } from "lucide-react";
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
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
<<<<<<< HEAD
            data-tour="brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] rounded"
            aria-label="TILARA Beranda"
          >
            <Image
              src="/brand/tilara-symbol.svg"
              alt="Logo TILARA"
              width={32}
              height={32}
              className="w-8 h-8 shrink-0"
              priority
            />
            <div className="flex flex-col">
              <span className="font-black text-sm md:text-base text-[var(--tilara-navy)] tracking-[0.18em] leading-none group-hover:text-[var(--tilara-green)] transition-colors">
                TILARA
              </span>
              <span className="text-[9px] md:text-[10px] text-[var(--tilara-green)] tracking-wider font-bold uppercase">
                Visibility for the Unreached
=======
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
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
              </span>
            </div>
          </Link>

<<<<<<< HEAD
          {/* Badge Pengingat Integritas */}
          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            Transparansi Bantuan Fisik
=======
          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-border)]">
            Transparansi Bantuan Riil
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
          </span>
        </div>

        {/* Kontrol & Navigasi */}
        <nav aria-label="Navigasi utama" className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
          {/* Tombol Panduan (Buka Ulang Pengantar) */}
          {onOpenIntro && (
            <button
              ref={panduanButtonRef}
              type="button"
<<<<<<< HEAD
              id="nav-panduan"
              data-tour="nav-panduan"
=======
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
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

<<<<<<< HEAD
          {/* Tautan Peta Operasional */}
          <Link
            href="/peta"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors"
            title="Buka Peta Operasional Selisih Logistik"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Peta</span>
=======
          {/* Tautan Tentang Platform */}
          <Link
            href="/tentang"
            className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-2.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors shrink-0"
            title="Tentang Platform TRASEC"
            aria-label="Tentang TRASEC"
          >
            <Info className="w-4 h-4 text-[var(--color-secondary)]" aria-hidden="true" />
            <span className="hidden md:inline">Tentang</span>
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
          </Link>

          {/* Tautan Direktori Laporan Terverifikasi */}
          <Link
            href="/laporan"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors"
            title="Direktori Laporan Terverifikasi"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden md:inline">Laporan</span>
          </Link>

          {/* Tautan Informasi & Metodologi Platform */}
          <Link
            href="/tentang"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors"
            title="Tentang Misi & Metodologi TILARA"
          >
            <Info className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
            <span className="hidden sm:inline">Tentang</span>
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
<<<<<<< HEAD
              {(session?.role === "RELAWAN" || session?.role === "ADMIN") && (
                <Link
                  href="/antrean"
                  className="px-2 py-1 text-[11px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-[var(--color-text)] transition-colors"
                  title="Antrean Pengiriman Luring"
                >
                  Antrean
                </Link>
              )}
              {(session?.role === "VERIFIKATOR" || session?.role === "ADMIN") && (
=======
              <Link
                href="/antrean"
                className="inline-flex items-center min-h-[44px] px-2.5 text-xs font-semibold rounded bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] text-[var(--color-text)] transition-colors"
                title="Antrean Pengiriman Luring"
              >
                Antrean
              </Link>
              {session?.role === "VERIFIKATOR" && (
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
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
