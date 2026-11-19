"use client";

import dynamic from "next/dynamic";
import type { PublicReportItem } from "@/lib/public-queries";

interface MapWrapperProps {
  reports: PublicReportItem[];
  onSelectReport: (report: PublicReportItem) => void;
  selectedReportId?: string | null;
}

const DynamicOperationalMap = dynamic(
  () => import("@/components/map/OperationalMap"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[var(--color-bg)] p-6 text-center"
        aria-busy="true"
        aria-label="Memuat peta operasional interaktif..."
      >
        <div className="w-10 h-10 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin mb-3" />
        <span className="font-bold text-sm text-[var(--color-text)]">
          Memuat Peta Operasional Kemanusiaan...
        </span>
        <span className="text-xs text-[var(--color-text-muted)] mt-1">
          Menyiapkan data geospasial dan kalkulasi selisih logistik
        </span>
      </div>
    ),
  }
);

export function MapWrapper(props: MapWrapperProps) {
  return <DynamicOperationalMap {...props} />;
}

