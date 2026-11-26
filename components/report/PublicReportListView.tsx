"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowUpRight, ShieldCheck, Users } from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface PublicReportListViewProps {
  reports: PublicReportItem[];
}

export function PublicReportListView({ reports }: PublicReportListViewProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return reports.filter((rep) => {
      if (categoryFilter !== "ALL" && rep.category !== categoryFilter) return false;
      if (typeFilter !== "ALL" && rep.type !== typeFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const match =
          rep.title.toLowerCase().includes(q) ||
          rep.region.name.toLowerCase().includes(q) ||
          rep.region.province.toLowerCase().includes(q) ||
          rep.what.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [reports, query, categoryFilter, typeFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
            Daftar Laporan Terverifikasi
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Seluruh laporan yang telah melalui kurasi komunitas atau lembaga resmi.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold shrink-0"
        >
          Lihat di Peta Operasional
        </Link>
      </div>

      {/* Filter & Pencarian */}
      <div
        className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col md:flex-row items-stretch md:items-center gap-3"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3 top-3.5" aria-hidden="true" />
          <label htmlFor="laporan-search" className="sr-only">
            Cari laporan berdasarkan judul atau wilayah
          </label>
          <input
            id="laporan-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari wilayah, provinsi, atau kebutuhan..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-base sm:text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter kategori laporan"
            className="min-h-[44px] px-3 py-2 rounded border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-xs font-semibold text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter tipe laporan"
            className="min-h-[44px] px-3 py-2 rounded border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-xs font-semibold text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
          >
            <option value="ALL">Semua Tipe</option>
            <option value="KEBUTUHAN">Kebutuhan Logistik</option>
            <option value="PEMANTAUAN">Pemantauan Lapangan</option>
          </select>
        </div>
      </div>

      {/* Daftar Laporan */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-center text-sm text-[var(--color-text-secondary)]">
          Tidak ada laporan terverifikasi yang cocok dengan kriteria pencarian.
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
          {filtered.map((rep) => (
            <article key={rep.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                  <span className="px-2 py-0.5 rounded bg-[var(--color-secondary)] text-white">
                    {rep.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-text)]">
                    {rep.urgency}
                  </span>
                  {rep.verificationLevel === "OFFICIAL" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--color-success-bg)] text-[var(--color-success-text)]">
                      <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                      Lembaga Resmi
                    </span>
                  )}
                  {rep.verificationLevel === "COMMUNITY" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--color-success-bg)] text-[var(--color-success-text)]">
                      <Users className="w-3 h-3" aria-hidden="true" />
                      Komunitas (2x)
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-[var(--color-text)]">
                  {rep.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)] tabular-numbers">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {rep.region.name}, {rep.region.province}
                  </span>
                  <span>
                    Skor Kepercayaan: <strong className="text-[var(--color-primary)]">{rep.trustScore}/100</strong>
                  </span>
                  {rep.type === "KEBUTUHAN" ? (
                    <span>Item kebutuhan: {rep.itemDeficits.length} kategori</span>
                  ) : (
                    <span>Pemantauan lapangan (tanpa logistik)</span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href={`/laporan/${rep.id}`}
                  className="w-full md:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold transition-colors"
                >
                  <span>Buka Detail</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
