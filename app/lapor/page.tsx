import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAvailableRegions } from "@/lib/region-queries";
import { ReportForm } from "@/components/report/ReportForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Laporan Kemanusiaan 5W+1H | TILARA",
  robots: { index: false, follow: false },
};

export default async function LaporPage() {
  const session = await getSession().catch(() => null);

  if (!session || !session.userId) {
    redirect("/login?next=/lapor");
  }

  const regions = await getAvailableRegions();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-[680px] mx-auto mb-4 flex items-center justify-between gap-2">
        <Link
<<<<<<< HEAD
          href="/peta"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
=======
          href="/"
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Peta Operasional</span>
        </Link>
        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-border)]">
          Formulir Standar 5W+1H
        </span>
      </div>

      <main id="main-content">
        <ReportForm
          regions={regions}
          userId={session.userId}
          userSessionName={session.name || "Relawan Lapangan"}
        />
      </main>
    </div>
  );
}
