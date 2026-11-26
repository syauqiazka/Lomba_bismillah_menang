"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Search, ArrowUpRight, MapPin } from "lucide-react";
import type { PublicReportItem } from "@/lib/public-queries";

interface TextTableViewProps {
  isOpen: boolean;
  onClose: () => void;
  reports: PublicReportItem[];
}

export function TextTableView({ isOpen, onClose, reports }: TextTableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = reports.filter((rep) => {
    if (categoryFilter !== "ALL" && rep.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = rep.title.toLowerCase().includes(q);
      const matchRegion = rep.region.name.toLowerCase().includes(q);
      const matchWhat = rep.what.toLowerCase().includes(q);
      if (!matchTitle && !matchRegion && !matchWhat) return false;
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Daftar Teks Kebutuhan Kemanusiaan Terverifikasi"
      className="fixed inset-0 z-[1300] bg-black/50 flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex flex-col overflow-hidden"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {/* Header Dialog */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
              Daftar Teks Kebutuhan Kemanusiaan
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Format terstruktur ramah pembaca layar dan koneksi internet terbatas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
            aria-label="Tutup tampilan tabel teks"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Pencarian */}
        <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-2.5 top-3" aria-hidden="true" />
              <label htmlFor="text-table-search" className="sr-only">
                Cari wilayah, judul, atau kebutuhan
              </label>
              <input
                id="text-table-search"
                type="text"
                placeholder="Cari wilayah, judul, atau kebutuhan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded text-base sm:text-xs text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="text-table-category" className="text-[var(--color-text-secondary)] font-semibold">
              Kategori:
            </label>
            <select
              id="text-table-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="min-h-[40px] px-2.5 py-1 bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded text-xs text-[var(--color-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
            >
              <option value="ALL">Semua ({reports.length})</option>
              <option value="BENCANA">Bencana Alam</option>
              <option value="LINGKUNGAN">Lingkungan</option>
              <option value="LANSIA">Lansia</option>
              <option value="KESEHATAN">Kesehatan</option>
              <option value="PENDIDIKAN">Pendidikan</option>
              <option value="SOSIAL_LAINNYA">Sosial Lainnya</option>
            </select>
            <span className="text-[var(--color-text-secondary)] font-semibold pl-1 tabular-numbers">
              {filtered.length} ditemukan
            </span>
          </div>
        </div>

        {/* Konten Data Operasional */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-text-secondary)]">
              Tidak ada data laporan yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <>
              {/* Tampilan Mobile (<768px): Stacked Row List sesuai DESIGN.md 7.3 */}
              <div className="md:hidden divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg">
                {filtered.map((rep) => (
                  <article key={rep.id} className="p-3.5 space-y-2 text-xs tabular-numbers">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-[var(--color-text-secondary)] font-semibold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{rep.region.name}, {rep.region.province}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[var(--color-text)] mt-0.5">
                          {rep.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-surface-hover)] text-[var(--color-text)] shrink-0">
                        {rep.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--color-text-secondary)]">
                      <span>Tipe: <strong className="text-[var(--color-text)]">{rep.type}</strong></span>
                      <span>Urgensi: <strong className="text-[var(--color-text)]">{rep.urgency}</strong></span>
                      <span>Skor: <strong className="text-[var(--color-primary)]">{rep.trustScore}/100</strong></span>
                    </div>

                    {rep.type === "KEBUTUHAN" ? (
                      rep.itemDeficits.length > 0 ? (
                        <div className="space-y-1 pt-1">
                          {rep.itemDeficits.map((item, i) => (
                            <div key={i} className="flex justify-between gap-2 bg-[var(--color-bg)] px-2.5 py-1.5 rounded">
                              <span className="font-semibold text-[var(--color-text)]">{item.itemCategory}</span>
                              <span className="text-[var(--color-danger-text)] font-bold">
                                Kurang {item.deficit} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--color-text-secondary)]">Belum ada item kebutuhan.</p>
                      )
                    ) : (
                      <p className="text-[var(--color-text-secondary)]">Pemantauan kondisi (Tanpa logistik)</p>
                    )}

                    <div className="pt-1">
                      <Link
                        href={`/laporan/${rep.id}`}
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors text-xs"
                      >
                        <span>Buka Detail Laporan</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Tampilan Desktop (>=768px): Tabel HTML Semantik */}
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left text-xs tabular-numbers">
                  <thead>
                    <tr className="border-b-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] font-bold">
                      <th scope="col" className="p-2.5">Wilayah</th>
                      <th scope="col" className="p-2.5">Laporan &amp; Kategori</th>
                      <th scope="col" className="p-2.5">Tipe &amp; Urgensi</th>
                      <th scope="col" className="p-2.5">Status Selisih Logistik</th>
                      <th scope="col" className="p-2.5 text-right">Skor Kepercayaan</th>
                      <th scope="col" className="p-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filtered.map((rep) => (
                      <tr key={rep.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                        <td className="p-2.5 align-top font-semibold text-[var(--color-text)] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[var(--color-text-secondary)] shrink-0" aria-hidden="true" />
                            <span>{rep.region.name}</span>
                          </div>
                          <span className="text-[11px] text-[var(--color-text-secondary)] block pl-4">
                            {rep.region.province}
                          </span>
                        </td>

                        <td className="p-2.5 align-top">
                          <strong className="text-[var(--color-text)] block mb-1">
                            {rep.title}
                          </strong>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-surface-hover)] text-[var(--color-text)] mr-1.5">
                            {rep.category}
                          </span>
                          {rep.isLocationBlurred && (
                            <span className="text-[11px] text-[var(--color-info-text)]">
                              (Lokasi disamarkan)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 align-top whitespace-nowrap">
                          <span className="block font-medium text-[var(--color-text)]">
                            {rep.type}
                          </span>
                          <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
                            {rep.urgency}
                          </span>
                        </td>

                        <td className="p-2.5 align-top">
                          {rep.type === "KEBUTUHAN" ? (
                            rep.itemDeficits.length > 0 ? (
                              <div className="space-y-1">
                                {rep.itemDeficits.map((item, i) => (
                                  <div key={i} className="text-xs">
                                    <span className="font-semibold text-[var(--color-text)]">
                                      {item.itemCategory}:
                                    </span>{" "}
                                    <span className="text-[var(--color-danger-text)] font-bold">
                                      Kurang {item.deficit} {item.unit}
                                    </span>{" "}
                                    <span className="text-[var(--color-text-secondary)]">
                                      (Butuh: {item.totalNeed}, Masuk: {item.totalConfirmedAid})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[var(--color-text-secondary)]">
                                Belum ada item
                              </span>
                            )
                          ) : (
                            <span className="text-[var(--color-text-secondary)]">
                              Pemantauan kondisi (Tanpa logistik)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 align-top text-right whitespace-nowrap">
                          <span className="font-bold text-[var(--color-primary)]">
                            {rep.trustScore} / 100
                          </span>
                          {rep.verificationLevel === "OFFICIAL" && (
                            <span className="block text-[11px] text-[var(--color-success-text)] font-semibold">
                              Resmi Lembaga
                            </span>
                          )}
                          {rep.verificationLevel === "COMMUNITY" && (
                            <span className="block text-[11px] text-[var(--color-success-text)] font-semibold">
                              Komunitas (2x)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 align-top text-right whitespace-nowrap">
                          <Link
                            href={`/laporan/${rep.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-colors text-xs"
                          >
                            <span>Detail</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded bg-[var(--color-secondary)] hover:opacity-95 text-white text-xs font-semibold transition-opacity cursor-pointer"
          >
            Tutup Daftar Teks
          </button>
        </div>
      </div>
    </div>
  );
}
