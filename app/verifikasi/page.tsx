import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { canVerify } from "@/lib/access";
import { getVerificationQueue, getVerifierOrgStatus } from "@/lib/verification-queries";
import { VerificationQueueView } from "@/components/verification/VerificationQueueView";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Antrean Verifikasi Laporan Kemanusiaan | TILARA",
  description: "Antrean kurasi dan validasi faktual laporan kemanusiaan serta konfirmasi catatan bantuan relawan.",
  robots: { index: false, follow: false },
};

export default async function VerificationPage() {
  const session = await getSession().catch(() => null);

  // 1. Anonim dialihkan ke login
  if (!session || !session.userId) {
    redirect("/login?next=/verifikasi");
  }

  // 2. Akses ditolak jika peran pengguna bukan VERIFIKATOR atau ADMIN
  if (!canVerify(session)) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] flex items-center justify-center mb-4">
          <span className="text-xl font-bold">403</span>
        </div>
        <h1 className="text-lg font-bold text-[var(--color-text-main)] mb-2">
          Akses Ditolak (403 Forbidden)
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mb-6">
          Modul ini khusus untuk peran <strong>VERIFIKATOR</strong> dan <strong>ADMIN</strong>. Akun Anda terdaftar sebagai <strong>{session.role}</strong>.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors"
        >
          Kembali ke Peta Beranda
        </Link>
      </div>
    );
  }

  const [queue, verifierOrgInfo] = await Promise.all([
    getVerificationQueue(session),
    getVerifierOrgStatus(session.userId, session.email),
  ]);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] flex flex-col">
      <Navbar session={session} />
      <main id="main-content" className="pt-14 flex-1 flex flex-col">
        <VerificationQueueView
          initialQueue={queue}
          currentUser={session}
          verifierOrgInfo={verifierOrgInfo}
        />
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}

