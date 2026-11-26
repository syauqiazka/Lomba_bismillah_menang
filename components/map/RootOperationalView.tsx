"use client";

import { useState, useEffect } from "react";
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
  // State Bottom Sheet Pengantar (Opsi C)
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PublicReportItem | null>(null);
  const [isTextViewOpen, setIsTextViewOpen] = useState(false);

  // Periksa preferensi penutupan pengantar di localStorage
  useEffect(() => {
    try {
      const hasDismissed = window.localStorage.getItem("trasec_intro_dismissed");
      if (!hasDismissed) {
        // Tampilkan sheet orientasi secara aman setelah kanvas siap
        const timer = setTimeout(() => setIsIntroOpen(true), 50);
        return () => clearTimeout(timer);
      }
    } catch {
      // Abaikan jika storage dibatasi
    }
  }, []);

  const handleCloseIntro = () => {
    setIsIntroOpen(false);
    try {
      window.localStorage.setItem("trasec_intro_dismissed", "true");
    } catch {
      // Abaikan jika localStorage dibatasi
    }
  };

  const handleOpenIntro = () => {
    setIsIntroOpen(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[var(--color-bg)]">
      {/* 1. Header Navigasi Atas */}
      <Navbar
        session={session}
        onOpenIntro={handleOpenIntro}
        onToggleTextView={() => setIsTextViewOpen((prev) => !prev)}
        isTextViewOpen={isTextViewOpen}
      />

      {/* 2. Peta Operasional Interaktif Membentang Penuh (Konten Utama) */}
      <main id="main-content" className="relative flex-1 w-full h-full pt-[52px]">
        <MapWrapper
          reports={initialReports}
          onSelectReport={(rep) => setSelectedReport(rep)}
          selectedReportId={selectedReport?.id}
          onOpenTextView={() => setIsTextViewOpen(true)}
        />

        {/* Status Agregat Ringkas di Sudut Kiri Bawah Peta */}
        <div
          className={`hidden md:flex absolute bottom-4 left-4 z-[900] bg-white/95 backdrop-blur-xs border border-[var(--color-border)] rounded-lg px-3 py-1.5 shadow-xs text-[11px] font-medium text-[var(--color-text-secondary)] gap-3 tabular-numbers transition-opacity duration-200 ${
            isIntroOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <span>
            Laporan Terverifikasi: <strong className="text-[var(--color-text)]">{aggregates.totalVerifiedReports}</strong>
          </span>
          <span>&bull;</span>
          <span>
            Wilayah Aktif: <strong className="text-[var(--color-text)]">{aggregates.totalActiveRegions}</strong>
          </span>
        </div>
      </main>

      {/* 3. Lapisan Pengantar / Bottom Sheet (FINAL: Opsi C) */}
      <IntroBottomSheet
        isOpen={isIntroOpen}
        onClose={handleCloseIntro}
      />

      {/* 4. Panel Ringkasan Titik Lokasi Terpilih (Drawer) */}
      <ReportDetailDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      {/* 5. Alternatif Tabel Teks Aksesibel & Hemat Data */}
      <TextTableView
        isOpen={isTextViewOpen}
        onClose={() => setIsTextViewOpen(false)}
        reports={initialReports}
      />

      {/* 6. Tombol Panggilan Darurat Mengambang */}
      <FloatingEmergencyButton />
    </div>
  );
}
