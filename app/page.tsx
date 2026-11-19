import { getPublicAggregates } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { EditorialLandingView } from "@/components/landing/EditorialLandingView";
import { FALLBACK_AGGREGATES } from "@/lib/fallback-data";

export const metadata = {
  title: "TRASEC | Humanitarian Intelligence Platform Indonesia",
  description:
    "Platform transparansi kebutuhan dan bantuan relawan di Indonesia. Menghitung dan menampilkan selisih riil logistik per lokasi dan per satuan tanpa penumpukan.",
};

export default async function HomePage() {
  let aggregates = FALLBACK_AGGREGATES;
  let session = null;

  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  try {
    if (!isPlaceholderDb) {
      const dbAggregates = await getPublicAggregates().catch(() => null);
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
    <EditorialLandingView
      aggregates={aggregates}
      session={session}
    />
  );
}
