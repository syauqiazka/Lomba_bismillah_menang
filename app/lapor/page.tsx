import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAvailableRegions } from "@/lib/region-queries";
import { ReportForm } from "@/components/report/ReportForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Laporan Kemanusiaan 5W+1H | TRASEC",
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
      <div className="max-w-[680px] mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta Operasional</span>
        </Link>
      </div>

      <ReportForm
        regions={regions}
        userSessionName={session.name || "Relawan Lapangan"}
      />
    </div>
  );
}

