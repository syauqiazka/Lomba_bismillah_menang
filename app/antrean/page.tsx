import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { OfflineQueueView } from "@/components/offline/OfflineQueueView";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Antrean Pengiriman Luring (Offline Queue) | TILARA",
  description:
    "Manajemen antrean draf laporan dan catatan bantuan tersimpan di perangkat lokal untuk sinkronisasi saat sinyal kembali.",
  robots: { index: false, follow: false },
};

export default async function AntreanPage() {
  const session = await getSession().catch(() => null);

  if (!session || !session.userId) {
    redirect("/login?next=/antrean");
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] flex flex-col">
      <Navbar session={session} />
      <div className="pt-14 flex-1">
        <OfflineQueueView currentUser={session} />
      </div>
      <FloatingEmergencyButton />
    </div>
  );
}

