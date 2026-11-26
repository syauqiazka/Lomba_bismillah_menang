import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { canVerify } from "@/lib/access";
import { getOperationalNeedsData } from "@/lib/operational-queries";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { DistributionView } from "@/components/operational/DistributionView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pencatatan & Konfirmasi Distribusi | TILARA",
  robots: { index: false, follow: false },
};

export default async function DistribusiPage() {
  const session = await getSession().catch(() => null);
  if (!session || !session.userId) {
    redirect("/login?next=/distribusi");
  }

  if (!canVerify(session)) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Navbar session={session} isSticky />
        <main className="flex-1 pt-24 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 text-center space-y-3">
            <h1 className="text-lg font-bold text-[var(--status-attention)]">
              Akses Ditolak (403)
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Hanya Verifikator / Koordinator atau Administrator yang berhak mengelola pencatatan dan konfirmasi distribusi bantuan.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-[var(--forest-700)] text-white text-xs font-semibold"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const data = await getOperationalNeedsData();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Navbar session={session} isSticky />
      <main className="flex-1 pt-14">
        <DistributionView data={data} />
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}

