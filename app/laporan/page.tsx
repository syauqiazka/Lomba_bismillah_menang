import { getPublicMapReports } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { FALLBACK_REPORTS } from "@/lib/fallback-data";
import { sortReportsDeterministically } from "@/lib/featured-incident";
import SiteHeader from "@/components/layout/SiteHeader";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { PublicReportsDirectory } from "@/components/report/PublicReportsDirectory";
import MotionInit from "@/components/motion/MotionInit";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Direktori Laporan Terverifikasi | TILARA",
  description:
    "Daftar lengkap laporan kondisi bencana, lingkungan, dan selisih kebutuhan bantuan fisik berstatus VERIFIED di Indonesia.",
  robots: { index: true, follow: true },
};

export default async function LaporanDirectoryPage() {
  let reports = FALLBACK_REPORTS;
  let session = null;
  let isDemoMode = true;

  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  try {
    if (!isPlaceholderDb) {
      const dbReports = await getPublicMapReports().catch(() => null);
      if (dbReports && dbReports.length > 0) {
        reports = dbReports;
        isDemoMode = false;
      }
    }

    const currentSession = await getSession().catch(() => null);
    if (currentSession && currentSession.userId) {
      session = {
        userId: currentSession.userId,
        name: currentSession.name,
        email: currentSession.email,
        role: currentSession.role,
        isVerifiedVolunteer: currentSession.isVerifiedVolunteer,
      };
    }
  } catch (err) {
    console.warn("Menggunakan data demonstrasi fallback untuk direktori laporan:", err);
  }

  // Pastikan hanya laporan VERIFIED yang dikirim ke client (server-side filter)
  const verifiedReports = sortReportsDeterministically(reports);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <MotionInit />
      <SiteHeader variant="solid" isAuthenticated={Boolean(session?.userId)} />
      <main id="main-content" className="page-offset flex-1 pb-16 px-4 sm:px-6 max-w-[1200px] w-full mx-auto pt-8">
        <PublicReportsDirectory
          reports={verifiedReports}
          isDemoMode={isDemoMode}
        />
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}

