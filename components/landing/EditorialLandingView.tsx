"use client";

import type { PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import SiteHeader from "@/components/layout/SiteHeader";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import MotionInit from "@/components/motion/MotionInit";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { MissionVisionSection } from "@/components/landing/sections/MissionVisionSection";
import { CoreValuesSection } from "@/components/landing/sections/CoreValuesSection";
import { DeficitCategoriesSection } from "@/components/landing/sections/DeficitCategoriesSection";
import { EthicsSection } from "@/components/landing/sections/EthicsSection";
import { ActionGallerySection } from "@/components/landing/sections/ActionGallerySection";
import { VolunteerImpactSection } from "@/components/landing/sections/VolunteerImpactSection";
import { PriorityRegionsSection } from "@/components/landing/sections/PriorityRegionsSection";
import { TickerRibbonSection } from "@/components/landing/sections/TickerRibbonSection";
import { VerifiersAuditSection } from "@/components/landing/sections/VerifiersAuditSection";
import { FaqSection } from "@/components/landing/sections/FaqSection";
import { LatestStoriesSection } from "@/components/landing/sections/LatestStoriesSection";
import { CtaEmergencySection } from "@/components/landing/sections/CtaEmergencySection";
import { EditorialFooter } from "@/components/landing/sections/EditorialFooter";

interface EditorialLandingViewProps {
  aggregates: PublicAggregates;
  session?: SessionData | null;
}

export function EditorialLandingView({
  aggregates,
  session,
}: EditorialLandingViewProps) {
  return (
    <div className="min-h-screen bg-[#F5F1E6] text-[#172B3A] flex flex-col selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden font-sans">
      <MotionInit />
      {/* 1. Header Publik (Solid) */}
      <SiteHeader variant="solid" isAuthenticated={Boolean(session?.userId)} />

      {/* 2. Seluruh Seksi Modular Halaman Editorial */}
      <main className="flex-1">
        <HeroSection />
        <MissionVisionSection />
        <CoreValuesSection />
        <DeficitCategoriesSection />
        <EthicsSection />
        <ActionGallerySection />
        <VolunteerImpactSection aggregates={aggregates} />
        <PriorityRegionsSection />
        <TickerRibbonSection />
        <VerifiersAuditSection />
        <FaqSection />
        <LatestStoriesSection />
        <CtaEmergencySection />
      </main>

      {/* 3. Footer Bersih & Tautan Navigasi Resmi */}
      <EditorialFooter />

      {/* 4. Tombol Panggilan Darurat Mengambang */}
      <FloatingEmergencyButton />
    </div>
  );
}
