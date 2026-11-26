"use client";

import Link from "next/link";
import Image from "next/image";
import { HelpCircle, PlusCircle, List, PhoneCall, User, LogIn, BarChart3, Info, MapPin, FileText } from "lucide-react";
import type { SessionData } from "@/lib/session-options";

interface NavbarProps {
  session?: SessionData | null;
  onOpenIntro?: () => void;
  onToggleTextView?: () => void;
  isTextViewOpen?: boolean;
  isSticky?: boolean;
}

export function Navbar({
  session,
  onOpenIntro,
  onToggleTextView,
  isTextViewOpen = false,
  isSticky = false,
}: NavbarProps) {
  const isLoggedIn = Boolean(session && session.userId);

  return (
    <header
      role="banner"
      className={`${isSticky ? "fixed" : "absolute"} top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-2.5 transition-colors`}
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Identifier */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
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
              </span>
            </div>
          </Link>

          {/* Badge Pengingat Integritas */}
          <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            Transparansi Bantuan Fisik
          </span>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Tombol Panduan (Mekanisme Buka Ulang Opsi C) */}
          {onOpenIntro && (
            <button
              type="button"
              id="nav-panduan"
              data-tour="nav-panduan"
              onClick={onOpenIntro}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors cursor-pointer"
              aria-label="Buka Panduan Platform"
              title="Panduan Membaca Peta & Selisih"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span className="hidden sm:inline">Panduan</span>
            </button>
          )}

          {/* Tombol Alternatif Tabel Teks (Aksesibilitas / Sinyal Lambat) */}
          {onToggleTextView && (
            <button
              type="button"
              data-tour="nav-text-view"
              onClick={onToggleTextView}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] ${
                isTextViewOpen
                  ? "bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border-[var(--color-border)]"
              }`}
              aria-label="Tampilkan data peta dalam format tabel teks"
              title="Daftar Teks Aksesibel"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Daftar Teks</span>
            </button>
          )}

          {/* Tautan Peta Operasional */}
          <Link
            href="/peta"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors"
            title="Buka Peta Operasional Selisih Logistik"
          >
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Peta</span>
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
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors"
            title="Dashboard Statistik Agregat Nasional"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Statistik</span>
          </Link>

          {/* Tautan Kontak Darurat */}
          <Link
            href="/darurat"
            data-tour="nav-emergency"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 border border-red-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            title="Nomor Darurat Nasional & Posko"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Darurat</span>
          </Link>

          {/* Tombol Buat Laporan */}
          <Link
            href="/lapor"
            data-tour="nav-report"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Lapor</span>
          </Link>

          {/* Status Sesi & Masuk */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-[var(--color-border)]">
              <span
                className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-surface-hover)] text-[var(--color-text)]"
                title={`Masuk sebagai ${session?.name} (${session?.role})`}
              >
                <User className="w-3 h-3 text-[var(--color-text-muted)]" />
                <span className="max-w-[100px] truncate">{session?.name}</span>
              </span>
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
                <Link
                  href="/verifikasi"
                  className="px-2 py-1 text-[11px] font-bold rounded bg-[var(--color-info-bg)] text-[var(--color-info-text)] hover:underline"
                >
                  Verifikasi
                </Link>
              )}
              {session?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-2 py-1 text-[11px] font-bold rounded bg-purple-100 text-purple-900 hover:underline"
                >
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

