import { getPublicMapReports, getPublicAggregates } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { StoryFirstHomeView } from "@/components/home/StoryFirstHomeView";
import { FALLBACK_REPORTS, FALLBACK_AGGREGATES } from "@/lib/fallback-data";

export const metadata = {
  title: "TILARA | Environmental & Humanitarian Intelligence Platform",
  description:
    "Ketahui apa yang terjadi dan pahami dampaknya. Informasi lapangan, kondisi lingkungan, dan selisih kebutuhan masyarakat Indonesia secara transparan dan terverifikasi.",
};

export default async function HomePage() {
  let reports = FALLBACK_REPORTS;
  let aggregates = FALLBACK_AGGREGATES;
  let session = null;
  let isDemoMode = true;

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
        isDemoMode = false;
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
    <StoryFirstHomeView
      reports={reports}
      aggregates={aggregates}
      session={session}
      isDemoMode={isDemoMode}
    />
  );
}
