"use client";

import { MotionConfig } from "motion/react";
import type { PublicAggregates, PublicReportItem } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { selectFeaturedIncident, sortReportsDeterministically } from "@/lib/featured-incident";
import SiteHeader from "@/components/layout/SiteHeader";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import { HeroStorySection } from "@/components/home/sections/HeroStorySection";
import { FeaturedIncidentSection } from "@/components/home/sections/FeaturedIncidentSection";
import { IncidentContextSection } from "@/components/home/sections/IncidentContextSection";
import { ReportsArchiveSection } from "@/components/home/sections/ReportsArchiveSection";
import { ImpactSummarySection } from "@/components/home/sections/ImpactSummarySection";
import { UnmetNeedsSection } from "@/components/home/sections/UnmetNeedsSection";
import { MapPreviewSection } from "@/components/home/sections/MapPreviewSection";
import { TransparencySection } from "@/components/home/sections/TransparencySection";
import { HomeCtaSection } from "@/components/home/sections/HomeCtaSection";
import { HomeFooter } from "@/components/home/sections/HomeFooter";
import GateIntro from "@/components/GateIntro";
import MotionInit from "@/components/motion/MotionInit";
import StoryScroll from "@/components/story/StoryScroll";

interface StoryFirstHomeViewProps {
  reports: PublicReportItem[];
  aggregates: PublicAggregates;
  session?: SessionData | null;
  isDemoMode: boolean;
}

export function StoryFirstHomeView({
  reports,
  aggregates,
  session,
  isDemoMode,
}: StoryFirstHomeViewProps) {
  // Pemilihan Featured Incident dan pengurutan laporan secara deterministik (tanpa random)
  const orderedReports = sortReportsDeterministically(reports);
  const featuredReport = selectFeaturedIncident(orderedReports);

  const latestUpdateDate = orderedReports[0]?.updatedAt
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date(orderedReports[0].updatedAt)) + " WIB"
    : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <GateIntro />
      <MotionInit />
      <StoryScroll>
        <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
          {/* 1. Header Publik (Overlay transparan di atas hero gelap → Solid saat scroll) */}
          <SiteHeader
            variant="overlay"
            isAuthenticated={Boolean(session?.userId)}
            lastUpdated={latestUpdateDate}
          />

          <main id="main-content" className="flex-1">
            {/* 2. Hero Story */}
            <HeroStorySection
              isDemoMode={isDemoMode}
              totalVerified={orderedReports.length}
              featuredReport={featuredReport}
            />

            {/* 3. Featured Incident */}
            <FeaturedIncidentSection
              report={featuredReport}
              isDemoMode={isDemoMode}
            />

            {/* 4. Incident Context (5W+1H) */}
            <IncidentContextSection report={featuredReport} />

            {/* 5. Environmental & Humanitarian Reports */}
            <ReportsArchiveSection
              reports={orderedReports}
              isDemoMode={isDemoMode}
            />

            {/* 6. Impact Information */}
            <ImpactSummarySection
              aggregates={aggregates}
              featuredReport={featuredReport}
              isDemoMode={isDemoMode}
            />

            {/* 7. Unmet Needs / Confirmed Aid (Hanya tampil jika tipe KEBUTUHAN) */}
            <UnmetNeedsSection report={featuredReport} />

            {/* 8. Operational Map Preview */}
            <MapPreviewSection reports={orderedReports} />

            {/* 9. Verification & Transparency */}
            <TransparencySection />

            {/* 10. CTA Report and Emergency Information */}
            <HomeCtaSection />
          </main>

          {/* 11. Footer */}
          <HomeFooter />

          {/* Tombol Panggilan Darurat Mengambang */}
          <FloatingEmergencyButton />
        </div>
      </StoryScroll>
    </MotionConfig>
  );
}

