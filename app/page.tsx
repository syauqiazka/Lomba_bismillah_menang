import { getPublicMapReports, getPublicAggregates } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { LandingPageView } from "@/components/landing/LandingPageView";
import { FALLBACK_REPORTS, FALLBACK_AGGREGATES } from "@/lib/fallback-data";

export const metadata = {
  title: "TRASEC | Humanitarian Intelligence Platform Indonesia",
  description:
    "Transparansi kebutuhan dan bantuan relawan di Indonesia. Menghitung dan menampilkan selisih riil logistik per lokasi dan per satuan tanpa penumpukan.",
};

export default async function HomePage() {
  let reports = FALLBACK_REPORTS;
  let aggregates = FALLBACK_AGGREGATES;
  let session = null;

  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  try {
    if (!isPlaceholderDb) {
      const [dbReports, dbAggregates] = await Promise.all([
        getPublicMapReports().catch(() => null),
        getPublicAggregates().catch(() => null),
      ]);

      if (dbReports && dbReports.length > 0) {
        reports = dbReports;
      }
      if (dbAggregates) {
        aggregates = dbAggregates;
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
    console.warn("Menggunakan data demonstrasi kemanusiaan fallback:", err);
  }

  return (
    <LandingPageView
      initialReports={reports}
      aggregates={aggregates}
      session={session}
    />
  );
}
