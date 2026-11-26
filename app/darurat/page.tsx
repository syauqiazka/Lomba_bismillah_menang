import { getEmergencyContacts } from "@/lib/emergency-queries";
import { getSession } from "@/lib/session";
import { EmergencyDirectoryView } from "@/components/emergency/EmergencyDirectoryView";
import SiteHeader from "@/components/layout/SiteHeader";
import MotionInit from "@/components/motion/MotionInit";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak Darurat Nasional & Posko Bencana | TILARA",
  description:
    "Direktori kontak darurat resmi penanggulangan bencana nasional (117 BNPB, 115 BASARNAS, 112, 119) dan posko siaga daerah yang siap dihubungi secara luring.",
  robots: { index: true, follow: true },
};

export default async function DaruratPage() {
  const [contacts, session] = await Promise.all([
    getEmergencyContacts(),
    getSession().catch(() => null),
  ]);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] flex flex-col">
      <MotionInit />
      <SiteHeader variant="solid" isAuthenticated={Boolean(session?.userId)} />
      <div className="page-offset flex-1">
        <EmergencyDirectoryView contacts={contacts} />
      </div>
      <FloatingEmergencyButton />
    </div>
  );
}

