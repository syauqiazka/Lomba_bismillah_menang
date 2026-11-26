import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { canVerify } from "@/lib/access";
import { getOperationalNeedsData } from "@/lib/operational-queries";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { NeedsMonitorView } from "@/components/operational/NeedsMonitorView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pemantauan Kebutuhan Bantuan | TILARA",
  robots: { index: false, follow: false },
};

export default async function KebutuhanPage() {
  const session = await getSession().catch(() => null);
  if (!session || !session.userId) {
    redirect("/login?next=/kebutuhan");
  }

  const data = await getOperationalNeedsData();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Navbar session={session} isSticky />
      <main className="flex-1 pt-14">
        <NeedsMonitorView data={data} canDistribute={canVerify(session)} />
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}

