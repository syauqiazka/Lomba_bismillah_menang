"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { PublicReportItem } from "@/lib/public-queries";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { Filter } from "lucide-react";

interface OperationalMapProps {
  reports: PublicReportItem[];
  onSelectReport: (report: PublicReportItem) => void;
  selectedReportId?: string | null;
  onOpenTextView?: () => void;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Menghasilkan markup HTML SVG untuk pin Leaflet sesuai spesifikasi DESIGN.md.
 */
function createMarkerHtml(report: PublicReportItem, isSelected: boolean): string {
  const safeTitle = escapeHtmlAttr(report.title);
  const isSelectedClass = isSelected ? "ring-4 ring-[#172B3A] scale-110 z-50" : "shadow-sm";
  const staleBadge = report.isStale
    ? `<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#E5A13A] border border-white rounded-full flex items-center justify-center text-[9px] text-[#172B3A] font-bold" title="Perlu konfirmasi ulang (&gt; 7 hari)">!</span>`
    : "";

  if (report.type === "PEMANTAUAN") {
    return `
      <div class="relative flex items-center justify-center w-8 h-8 ${isSelectedClass} transition-transform" title="${safeTitle} (Pemantauan)">
        <div class="w-6 h-6 border-2 border-[#172B3A] bg-white rotate-45 flex items-center justify-center">
          <div class="-rotate-45 text-[#172B3A] flex items-center justify-center">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
        ${staleBadge}
      </div>
    `;
  }

  let bgColor = "#8A8D86";
  let iconSvg = `
    <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  `;

  if (report.overallDeficitStatus === "KEKURANGAN_BESAR") {
    bgColor = "#B83E37";
    iconSvg = `
      <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `;
  } else if (report.overallDeficitStatus === "KEKURANGAN_SEDANG") {
    bgColor = "#E5A13A";
    iconSvg = `
      <svg class="w-3.5 h-3.5 text-[#172B3A]" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="4"/>
      </svg>
    `;
  } else if (report.overallDeficitStatus === "HAMPIR_TERPENUHI") {
    bgColor = "#246B50";
    iconSvg = `
      <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
  }

  return `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ${isSelectedClass} transition-transform" style="background-color: ${bgColor};" title="${safeTitle}">
      ${iconSvg}
      ${staleBadge}
    </div>
  `;
}

export default function OperationalMap({
  reports,
  onSelectReport,
  selectedReportId,
  onOpenTextView,
}: OperationalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const [hasTileError, setHasTileError] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [staleFilter, setStaleFilter] = useState<string>("ALL");

  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (categoryFilter !== "ALL" && rep.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "ALL") {
        if (statusFilter === "PEMANTAUAN" && rep.type !== "PEMANTAUAN") {
          return false;
        }
        if (statusFilter !== "PEMANTAUAN" && rep.overallDeficitStatus !== statusFilter) {
          return false;
        }
      }
      if (staleFilter === "FRESH_ONLY" && rep.isStale) {
        return false;
      }
      if (staleFilter === "STALE_ONLY" && !rep.isStale) {
        return false;
      }
      return true;
    });
  }, [reports, categoryFilter, statusFilter, staleFilter]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
      });

<<<<<<< HEAD
      // Ubin OpenStreetMap Standard (100% Gratis, Terbuka, Tanpa Watermark & Tanpa API Key)
      const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
=======
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
        maxZoom: 19,
      }).addTo(map);

<<<<<<< HEAD
      let tileErrors = 0;
      tileLayer.on("tileerror", () => {
        tileErrors += 1;
        if (tileErrors >= 3 && isMounted) {
          setHasTileError(true);
        }
      });

      // Tambahkan zoom control di kanan atas agar tidak tertutup bottom sheet
=======
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
      L.control.zoom({ position: "topright" }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function updateMarkers() {
      const layer = markersLayerRef.current;
      if (!mapInstanceRef.current || !layer) return;

      const L = (await import("leaflet")).default;
      layer.clearLayers();

      filteredReports.forEach((rep) => {
        const isSelected = rep.id === selectedReportId;
        const icon = L.divIcon({
          className: "custom-leaflet-marker",
          html: createMarkerHtml(rep, isSelected),
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([rep.latitude, rep.longitude], {
          icon,
          title: rep.title,
          alt: rep.title,
        });

        marker.on("click", () => {
          onSelectReport(rep);
        });

        layer.addLayer(marker);
      });
    }

    updateMarkers();
  }, [filteredReports, selectedReportId, onSelectReport]);

  return (
    <div className="relative w-full h-full min-h-[320px] flex-1 bg-[var(--color-bg)]">
      {/* Kanvas Leaflet terisolasi pada z-index --z-map */}
      <div ref={mapContainerRef} className="w-full h-full z-[1] isolate" />

      {/* Bar Filter Cepat Peta (aman dari kontrol zoom di kanan atas) */}
      <div className="absolute top-3 left-3 right-14 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-[800] pointer-events-none sm:max-w-[calc(100vw-120px)]">
        <div
          style={{ boxShadow: "var(--shadow-elevated)" }}
          className="pointer-events-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-2.5 py-2 flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text)] pr-2 border-r border-[var(--color-border)]">
            <Filter className="w-3.5 h-3.5 text-[var(--color-primary)]" aria-hidden="true" />
            <span>Filter:</span>
          </div>

          <select
            id="map-filter-category"
            name="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`min-h-[36px] text-xs rounded px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer transition-colors ${
              categoryFilter !== "ALL"
                ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-primary)]"
                : "bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]"
            }`}
            aria-label="Filter berdasarkan kategori laporan"
          >
            <option value="ALL">Semua Kategori ({reports.length})</option>
            <option value="BENCANA">Bencana Alam</option>
            <option value="LINGKUNGAN">Lingkungan Hidup</option>
            <option value="LANSIA">Pendampingan Lansia</option>
            <option value="KESEHATAN">Kesehatan</option>
            <option value="PENDIDIKAN">Pendidikan</option>
            <option value="SOSIAL_LAINNYA">Sosial Lainnya</option>
          </select>

          <select
            id="map-filter-status"
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`min-h-[36px] text-xs rounded px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer transition-colors ${
              statusFilter !== "ALL"
                ? "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border border-[var(--color-warning-text)]"
                : "bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]"
            }`}
            aria-label="Filter berdasarkan tingkat selisih kebutuhan"
          >
            <option value="ALL">Semua Status Selisih</option>
            <option value="KEKURANGAN_BESAR">Kekurangan Besar (&gt;50%)</option>
            <option value="KEKURANGAN_SEDANG">Kekurangan Sedang (10%–50%)</option>
            <option value="HAMPIR_TERPENUHI">Hampir Terpenuhi (&lt;10%)</option>
            <option value="PEMANTAUAN">Pemantauan Lingkungan</option>
          </select>

          <select
            id="map-filter-freshness"
            name="freshness"
            value={staleFilter}
            onChange={(e) => setStaleFilter(e.target.value)}
            className={`min-h-[36px] text-xs rounded px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer transition-colors ${
              staleFilter !== "ALL"
                ? "bg-[var(--color-info-bg)] text-[var(--color-info-text)] border border-[var(--color-info-text)]"
                : "bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)]"
            }`}
            aria-label="Filter berdasarkan kebaruan data"
          >
            <option value="ALL">Semua Waktu</option>
            <option value="FRESH_ONLY">Hanya Terkini (&lt; 7 Hari)</option>
            <option value="STALE_ONLY">Perlu Konfirmasi (&gt; 7 Hari)</option>
          </select>

          <div className="flex items-center gap-1.5 pl-1.5 border-l border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] tabular-numbers">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
            <span>{filteredReports.length} lokasi</span>
          </div>
        </div>

        {/* Fallback Daftar Wilayah jika Ubin Peta Gagal Dimuat / Offline */}
        {hasTileError && (
          <div className="mt-2 pointer-events-auto bg-[var(--color-warning-bg)] border border-[var(--color-warning-text)]/30 text-[var(--color-warning-text)] rounded-lg px-3.5 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <span>
              Ubin peta gagal dimuat (jaringan terbatas). Gunakan tampilan daftar wilayah agar tetap dapat memantau titik laporan.
            </span>
            {onOpenTextView && (
              <button
                type="button"
                onClick={onOpenTextView}
                className="px-2.5 py-1 rounded bg-[var(--color-secondary)] text-white font-semibold cursor-pointer"
              >
                Buka Daftar Wilayah
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
