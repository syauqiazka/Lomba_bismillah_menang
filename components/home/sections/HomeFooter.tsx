"use client";

import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-8 px-4 sm:px-6 text-xs text-[var(--color-text-secondary)]">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <strong className="text-sm text-[var(--color-text)] block">
            TILARA — Visibility for the Unreached
          </strong>
          <p>
            100% transparansi logistik fisik dan tenaga relawan. Tidak memproses transaksi finansial maupun donasi uang.
          </p>
        </div>

        <nav aria-label="Navigasi Footer" className="flex flex-wrap gap-x-5 gap-y-2 font-semibold text-[var(--color-text)]">
          <Link href="/peta" className="hover:text-[var(--color-primary)]">
            Peta Operasional
          </Link>
          <Link href="/tentang" className="hover:text-[var(--color-primary)]">
            Tentang &amp; Metodologi
          </Link>
          <Link href="/dashboard" className="hover:text-[var(--color-primary)]">
            Dashboard Publik
          </Link>
          <Link href="/darurat" className="hover:text-[var(--color-danger-text)]">
            Kontak Darurat
          </Link>
          <Link href="/lapor" className="hover:text-[var(--color-primary)]">
            Lapor 5W+1H
          </Link>
        </nav>
      </div>
    </footer>
  );
}

