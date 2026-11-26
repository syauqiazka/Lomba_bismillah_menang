import { getPublicMapReports } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { FALLBACK_REPORTS } from "@/lib/fallback-data";
<<<<<<< HEAD
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
=======
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { PublicReportListView } from "@/components/report/PublicReportListView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Laporan Kebutuhan Terverifikasi | TRASEC",
  description:
    "Daftar lengkap laporan kebutuhan logistik dan pemantauan kemanusiaan yang telah terverifikasi di Indonesia.",
  robots: { index: true, follow: true },
};

export default async function LaporanListPage() {
  let reports = FALLBACK_REPORTS;
  let session = null;
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3

  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  try {
    if (!isPlaceholderDb) {
      const dbReports = await getPublicMapReports().catch(() => null);
      if (dbReports && dbReports.length > 0) {
        reports = dbReports;
<<<<<<< HEAD
        isDemoMode = false;
=======
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
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
<<<<<<< HEAD
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
=======
  } catch {
    // Gunakan data fallback demonstrasi jika DB belum tersedia
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar session={session} isSticky />
      <main id="main-content" className="flex-1 pt-20 pb-16 px-4 sm:px-6">
        <PublicReportListView reports={reports} />
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
