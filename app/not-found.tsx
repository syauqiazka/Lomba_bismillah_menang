import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-white border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-4"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text-secondary)] flex items-center justify-center mx-auto border border-[var(--color-border)]">
          <SearchX className="w-7 h-7 text-[var(--color-text-muted)]" />
        </div>

        <div>
          <span className="text-xs font-black tracking-wider uppercase text-[#B83E37]">
            Status HTTP 404
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text)] mt-1">
            Data atau Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
            Laporan kemanusiaan atau halaman yang Anda tuju tidak tersedia, belum berstatus terverifikasi publik, atau tautan telah kedaluwarsa.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta Operasional</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

