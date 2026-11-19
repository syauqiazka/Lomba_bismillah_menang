"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { PublicReportItem } from "@/lib/public-queries";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { Filter } from "lucide-react";

interface OperationalMapProps {
  reports: PublicReportItem[];
  onSelectReport: (report: PublicReportItem) => void;
  selectedReportId?: string | null;
}

/**
 * Menghasilkan markup HTML SVG untuk pin Leaflet sesuai spesifikasi DESIGN.md.
 */
function createMarkerHtml(report: PublicReportItem, isSelected: boolean): string {
  const isSelectedClass = isSelected ? "ring-4 ring-[#172B3A] scale-110 z-50" : "shadow-md";

  if (report.type === "PEMANTAUAN") {
    // Bentuk geometris Belah Ketupat (Diamond) berkontur Navy tanpa latar penuh
    return `
      <div class="relative flex items-center justify-center w-8 h-8 ${isSelectedClass} transition-transform" title="${report.title} (Pemantauan)">
        <div class="w-6 h-6 border-2 border-[#172B3A] bg-white rotate-45 flex items-center justify-center shadow-xs">
          <div class="-rotate-45 text-[#172B3A] flex items-center justify-center">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  // Tipe KEBUTUHAN: Lingkaran solid 32px dengan kontur putih 2px
  let bgColor = "#8A8D86"; // Neutral / BELUM_ADA_DATA
  let iconSvg = `
    <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  `;

  if (report.overallDeficitStatus === "KEKURANGAN_BESAR") {
    bgColor = "#B83E37"; // Alert Dark
    iconSvg = `
      <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `;
  } else if (report.overallDeficitStatus === "KEKURANGAN_SEDANG") {
    bgColor = "#E5A13A"; // Amber
    iconSvg = `
      <svg class="w-3.5 h-3.5 text-[#172B3A]" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="4"/>
      </svg>
    `;
  } else if (report.overallDeficitStatus === "HAMPIR_TERPENUHI") {
    bgColor = "#246B50"; // Forest
    iconSvg = `
      <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
  }

  return `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ${isSelectedClass} transition-transform" style="background-color: ${bgColor};" title="${report.title}">
      ${iconSvg}
    </div>
  `;
}

export default function OperationalMap({
  reports,
  onSelectReport,
  selectedReportId,
}: OperationalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  // Filter Lokal Peta
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter laporan berdasarkan seleksi pengguna
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
      return true;
    });
  }, [reports, categoryFilter, statusFilter]);

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Jika peta sudah ada, bersihkan instance sebelumnya
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Titik tengah kepulauan Indonesia (-2.5, 118.0) dengan zoom level 5
      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false, // Zoom control dipindahkan ke pojok kanan atas
      });

      // Ubin CartoDB Positron (Spesifikasi DESIGN.md Bagian 9.6)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Tambahkan zoom control di kanan atas agar tidak tertutup bottom sheet
      L.control.zoom({ position: "topright" }).addTo(map);

      // Layer grup untuk pin penanda
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

  // Sinkronisasi Marker saat data laporan atau seleksi filter berubah
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

        const marker = L.marker([rep.latitude, rep.longitude], { icon });

        marker.on("click", () => {
          onSelectReport(rep);
        });

        layer.addLayer(marker);
      });
    }

    updateMarkers();
  }, [filteredReports, selectedReportId, onSelectReport]);

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 bg-[var(--color-bg)]">
      {/* Kanvas Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bar Filter Cepat di Atas Peta (Di Bawah Navbar) */}
      <div className="absolute top-16 left-4 right-4 z-[900] pointer-events-none">
        <div className="max-w-fit pointer-events-auto bg-white/95 backdrop-blur-xs border border-[var(--color-border)] rounded-lg p-2 flex flex-wrap items-center gap-2 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)] pr-2 border-r border-[var(--color-border)]">
            <Filter className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline">Filter:</span>
          </div>

          {/* Pemilih Kategori */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1 text-[var(--color-text)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-focus)] cursor-pointer"
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

          {/* Pemilih Tingkat Selisih */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1 text-[var(--color-text)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-focus)] cursor-pointer"
            aria-label="Filter berdasarkan tingkat selisih kebutuhan"
          >
            <option value="ALL">Semua Status Selisih</option>
            <option value="KEKURANGAN_BESAR">Kekurangan Besar (&gt;50%)</option>
            <option value="KEKURANGAN_SEDANG">Kekurangan Sedang (10%–50%)</option>
            <option value="HAMPIR_TERPENUHI">Hampir Terpenuhi (&lt;10%)</option>
            <option value="PEMANTAUAN">Pemantauan Lingkungan</option>
          </select>

          {/* Indikator Jumlah Titik Aktif */}
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] pl-1">
            {filteredReports.length} lokasi aktif
          </span>
        </div>
      </div>
    </div>
  );
}
