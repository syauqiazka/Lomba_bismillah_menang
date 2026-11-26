"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Users,
  Clock,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface PublicReportsDirectoryProps {
  reports: PublicReportItem[];
  isDemoMode: boolean;
}

const PAGE_SIZE = 6;

export function PublicReportsDirectory({
  reports,
  isDemoMode,
}: PublicReportsDirectoryProps) {
  const [referenceTimeMs] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const regions = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of reports) {
      map.set(r.region.id, `${r.region.name} (${r.region.province})`);
    }
    return Array.from(map.entries());
  }, [reports]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return reports.filter((rep) => {
      if (regionFilter !== "ALL" && rep.region.id !== regionFilter) return false;
      if (categoryFilter !== "ALL" && rep.category !== categoryFilter) return false;
      if (typeFilter !== "ALL" && rep.type !== typeFilter) return false;
      if (urgencyFilter !== "ALL" && rep.urgency !== urgencyFilter) return false;

      if (timeFilter === "FRESH" && rep.isStale) return false;
      if (timeFilter === "STALE" && !rep.isStale) return false;
      if (timeFilter === "7D") {
        const diffDays = (referenceTimeMs - new Date(rep.when).getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }

      if (q) {
        const match =
          rep.title.toLowerCase().includes(q) ||
          rep.what.toLowerCase().includes(q) ||
          rep.region.name.toLowerCase().includes(q) ||
          rep.region.province.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [reports, search, regionFilter, categoryFilter, typeFilter, urgencyFilter, timeFilter, referenceTimeMs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function resetFilters() {
    setSearch("");
    setRegionFilter("ALL");
    setCategoryFilter("ALL");
    setTypeFilter("ALL");
    setUrgencyFilter("ALL");
    setTimeFilter("ALL");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header Direktori */}
      <header className="space-y-2 border-b border-[var(--border)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--status-verified)]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Hanya Data VERIFIED
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--status-demo)] text-white">
                DEMO
              </span>
            )}
          </div>
          <Link
            href="/peta"
            className="text-xs font-semibold text-[var(--forest-700)] hover:underline inline-flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Lihat di Peta Operasional</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          Direktori Laporan Terverifikasi
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl">
          Telusuri kondisi lapangan dan kesenjangan kebutuhan bantuan fisik yang telah lolos verifikasi berlapis. Laporan berstatus PENDING tidak ditampilkan di halaman publik.
        </p>
      </header>

      {/* Panel Pencarian & Filter */}
      <section
        aria-label="Pencarian dan Filter Direktori"
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 space-y-3"
      >
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" aria-hidden="true" />
          <label htmlFor="directory-search" className="sr-only">
            Cari laporan berdasarkan judul, wilayah, atau kebutuhan
          </label>
          <input
            id="directory-search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari kejadian, wilayah, atau jenis kebutuhan..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          <select
            aria-label="Filter wilayah"
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setPage(1);
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
          >
            <option value="ALL">Semua Wilayah</option>
            {regions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter kategori"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="BENCANA">Bencana Alam</option>
            <option value="LINGKUNGAN">Lingkungan</option>
            <option value="LANSIA">Lansia</option>
            <option value="KESEHATAN">Kesehatan</option>
            <option value="PENDIDIKAN">Pendidikan</option>
            <option value="SOSIAL_LAINNYA">Sosial Lainnya</option>
          </select>

          <select
            aria-label="Filter jenis laporan"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
          >
            <option value="ALL">Semua Jenis</option>
            <option value="KEBUTUHAN">KEBUTUHAN (Ada Selisih)</option>
            <option value="PEMANTAUAN">PEMANTAUAN (Observasi)</option>
          </select>

          <select
            aria-label="Filter tingkat urgensi"
            value={urgencyFilter}
            onChange={(e) => {
              setUrgencyFilter(e.target.value);
              setPage(1);
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
          >
            <option value="ALL">Semua Urgensi</option>
            <option value="DARURAT">DARURAT</option>
            <option value="MENDESAK">MENDESAK</option>
            <option value="TERENCANA">TERENCANA</option>
          </select>

          <select
            aria-label="Filter rentang waktu"
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value);
              setPage(1);
            }}
            className="min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
          >
            <option value="ALL">Semua Waktu</option>
            <option value="7D">7 Hari Terakhir</option>
            <option value="FRESH">Terkini (&lt; 7 Hari)</option>
            <option value="STALE">Perlu Konfirmasi (&gt; 7 Hari)</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
          <span className="tabular-numbers">
            Menampilkan <strong className="text-[var(--text)]">{filtered.length}</strong> laporan terverifikasi
          </span>
          {(search || regionFilter !== "ALL" || categoryFilter !== "ALL" || typeFilter !== "ALL" || urgencyFilter !== "ALL" || timeFilter !== "ALL") && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-semibold text-[var(--forest-700)] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </section>

      {/* Daftar Laporan + Kartu Kesenjangan Bantuan (DESIGN.md 5.1) */}
      {paginated.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8 text-center space-y-3">
          <p className="text-sm font-medium text-[var(--text)]">
            Tidak ada laporan terverifikasi yang cocok dengan filter Anda.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Ubah kata kunci pencarian atau reset filter untuk melihat seluruh laporan publik.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[44px] px-4 py-2 rounded-lg bg-[var(--forest-700)] text-white text-xs font-semibold cursor-pointer"
          >
            Tampilkan Semua Laporan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((rep) => {
            const topGap = rep.type === "KEBUTUHAN" ? rep.itemDeficits[0] : null;
            return (
              <article
                key={rep.id}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 sm:p-6 space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-[var(--color-success-bg)] text-[var(--status-verified)]">
                        {rep.verificationLevel === "OFFICIAL" ? (
                          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        {rep.verificationLevel === "OFFICIAL" ? "Terverifikasi Lembaga" : "Terverifikasi Komunitas"}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[var(--surface-muted)] text-[var(--text)]">
                        {rep.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                          rep.urgency === "DARURAT"
                            ? "bg-[var(--color-danger-bg)] text-[var(--status-attention)]"
                            : "bg-[var(--color-warning-bg)] text-[var(--status-pending)]"
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                        {rep.urgency}
                      </span>

                      {isDemoMode && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-[var(--status-demo)] text-white">
                          DEMO
                        </span>
                      )}

                      {rep.isStale && (
                        <span className="inline-flex items-center gap-1 text-[var(--status-pending)] font-medium">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          Perlu konfirmasi ulang
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-[var(--text)]">
                      {rep.title}
                    </h2>

                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {rep.what}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] tabular-numbers">
                      <span className="inline-flex items-center gap-1 font-medium text-[var(--text)]">
                        <MapPin className="w-3.5 h-3.5 text-[var(--forest-500)]" aria-hidden="true" />
                        {rep.region.name}, {rep.region.province}
                      </span>
                      <span>
                        Pembaruan: {new Date(rep.updatedAt).toLocaleDateString("id-ID")}
                      </span>
                      <span>Skor Kepercayaan: {rep.trustScore}/100</span>
                    </div>
                  </div>

                  <Link
                    href={`/laporan/${rep.id}`}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-[var(--forest-700)] hover:bg-[var(--forest-900)] text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    <span>Buka Cerita &amp; Rincian</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                {/* Kartu Kesenjangan Bantuan Ringkas (Hanya untuk KEBUTUHAN — DESIGN.md 5.1) */}
                {topGap && (
                  <div className="pt-3 border-t border-[var(--border)] bg-[var(--bg)] rounded-lg p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-numbers">
                      <span className="font-semibold text-[var(--text)]">
                        Kesenjangan Utama ({topGap.itemCategory}):{" "}
                        {topGap.totalNeed} {topGap.unit} dibutuhkan &middot;{" "}
                        {topGap.totalConfirmedAid} {topGap.unit} diterima &middot;{" "}
                        <strong className="text-[var(--status-attention)]">
                          {topGap.deficit} {topGap.unit} belum terpenuhi
                        </strong>
                      </span>
                      <span className="font-bold text-[var(--forest-700)]">
                        {topGap.percentageFulfilled}% Terpenuhi
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full bg-[var(--surface-muted)] overflow-hidden"
                      role="progressbar"
                      aria-valuenow={topGap.percentageFulfilled}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Keterpenuhan ${topGap.itemCategory}`}
                    >
                      <div
                        className="h-full bg-[var(--forest-500)] rounded-full"
                        style={{ width: `${topGap.percentageFulfilled}%` }}
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Paginasi */}
      {totalPages > 1 && (
        <nav
          aria-label="Paginasi direktori laporan"
          className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs"
        >
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="min-h-[44px] px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-40 font-semibold cursor-pointer"
          >
            Sebelumnya
          </button>
          <span className="tabular-numbers text-[var(--text-muted)]">
            Halaman <strong className="text-[var(--text)]">{safePage}</strong> dari {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="min-h-[44px] px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-40 font-semibold cursor-pointer"
          >
            Berikutnya
          </button>
        </nav>
      )}
    </div>
  );
}

