import type { PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { AboutHero } from "@/components/landing/AboutHero";
import { AboutMechanism } from "@/components/landing/AboutMechanism";
import { AboutAggregatesAndFaq } from "@/components/landing/AboutAggregatesAndFaq";

interface EditorialLandingViewProps {
  aggregates: PublicAggregates;
  session?: SessionData | null;
}

export function EditorialLandingView({
  aggregates,
  session,
}: EditorialLandingViewProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-sans">
      <Navbar session={session} isSticky />

      <main id="main-content" className="flex-1 flex flex-col">
        <AboutHero />
        <AboutMechanism />
        <AboutAggregatesAndFaq aggregates={aggregates} />
      </main>

      <FloatingEmergencyButton />
    </div>
  );
}
