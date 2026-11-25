import { getPublicMapReports } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { FALLBACK_REPORTS } from "@/lib/fallback-data";
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

  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  try {
    if (!isPlaceholderDb) {
      const dbReports = await getPublicMapReports().catch(() => null);
      if (dbReports && dbReports.length > 0) {
        reports = dbReports;
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
  } catch {
    // Gunakan data fallback demonstrasi jika DB belum tersedia
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar session={session} isSticky />
      <main id="main-content" className="flex-1 pt-20 pb-16 px-4 sm:px-6">
        <PublicReportListView reports={reports} />
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}
