"use client";

import { useState, useEffect, useRef } from "react";
import type { PublicReportItem, PublicAggregates } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { Navbar } from "@/components/common/Navbar";
import { MapWrapper } from "@/components/map/MapWrapper";
import { IntroBottomSheet } from "@/components/map/IntroBottomSheet";
import { ReportDetailDrawer } from "@/components/map/ReportDetailDrawer";
import { TextTableView } from "@/components/map/TextTableView";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";

interface RootOperationalViewProps {
  initialReports: PublicReportItem[];
  aggregates: PublicAggregates;
  session?: SessionData | null;
}

export function RootOperationalView({
  initialReports,
  aggregates,
  session,
}: RootOperationalViewProps) {
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PublicReportItem | null>(null);
  const [isTextViewOpen, setIsTextViewOpen] = useState(false);
  const panduanButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const hasDismissed = window.localStorage.getItem("trasec_intro_dismissed");
      if (!hasDismissed) {
        const timer = setTimeout(() => setIsIntroOpen(true), 50);
        return () => clearTimeout(timer);
      }
    } catch {
      // Abaikan jika localStorage dibatasi peramban
    }
  }, []);

  const handleCloseIntro = () => {
    setIsIntroOpen(false);
    try {
      window.localStorage.setItem("trasec_intro_dismissed", "true");
    } catch {
      // Abaikan jika localStorage dibatasi peramban
    }
  };

  const handleOpenIntro = () => {
    setIsIntroOpen(true);
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col bg-[var(--color-bg)]">
      {/* Header Navigasi Atas */}
      <Navbar
        session={session}
        onOpenIntro={handleOpenIntro}
        isIntroOpen={isIntroOpen}
        panduanButtonRef={panduanButtonRef}
        onToggleTextView={() => setIsTextViewOpen((prev) => !prev)}
        isTextViewOpen={isTextViewOpen}
      />

      {/* Peta Operasional Interaktif Membentang Penuh */}
      <main id="main-content" className="relative flex-1 w-full h-full pt-[56px] overflow-hidden">
        <MapWrapper
          reports={initialReports}
          onSelectReport={(rep) => setSelectedReport(rep)}
          selectedReportId={selectedReport?.id}
        />

        {/* Ringkasan Agregat Publik (disembunyikan saat Bottom Sheet desktop terbuka agar tidak tumpang tindih) */}
        {!isIntroOpen && (
          <div
            style={{ boxShadow: "var(--shadow-elevated)" }}
            className="hidden md:flex absolute bottom-6 left-6 z-[900] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] gap-3 tabular-numbers"
          >
            <span>
              Laporan Terverifikasi:{" "}
              <strong className="text-[var(--color-text)]">{aggregates.totalVerifiedReports}</strong>
            </span>
            <span aria-hidden="true">&bull;</span>
            <span>
              Wilayah Aktif:{" "}
              <strong className="text-[var(--color-text)]">{aggregates.totalActiveRegions}</strong>
            </span>
          </div>
        )}
      </main>

      {/* Lapisan Pengantar / Bottom Sheet (FINAL: Opsi C) */}
      <IntroBottomSheet
        isOpen={isIntroOpen}
        onClose={handleCloseIntro}
        returnFocusRef={panduanButtonRef}
      />

      {/* Panel Ringkasan Titik Lokasi Terpilih */}
      <ReportDetailDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      {/* Alternatif Tabel Teks Aksesibel & Hemat Data */}
      <TextTableView
        isOpen={isTextViewOpen}
        onClose={() => setIsTextViewOpen(false)}
        reports={initialReports}
      />

      {/* Tombol Panggilan Darurat Mengambang */}
      <FloatingEmergencyButton />
    </div>
  );
}
