import { getPublicAggregates } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { EditorialLandingView } from "@/components/landing/EditorialLandingView";
import { FALLBACK_AGGREGATES } from "@/lib/fallback-data";

export const metadata = {
  title: "Tentang Platform Kemanusiaan | TILARA",
  description:
    "Transparansi kebutuhan dan bantuan relawan di Indonesia. Menghubungkan informasi kebutuhan, bantuan terkonfirmasi, dan proses verifikasi berlapis.",
};

export default async function TentangPage() {
  let aggregates = FALLBACK_AGGREGATES;
  let session = null;

  try {
    const dbAggregates = await getPublicAggregates().catch(() => null);
    if (dbAggregates) {
      aggregates = dbAggregates;
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

  return <EditorialLandingView aggregates={aggregates} session={session} />;
}

