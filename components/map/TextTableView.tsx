"use client";

import { useState } from "react";
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
      className="fixed inset-0 z-[1250] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] bg-white border border-[var(--color-border)] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {/* Header Dialog */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)]">
              Daftar Teks Kebutuhan Kemanusiaan (Aksesibel &amp; Ringan Data)
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Format data terstruktur ramah pembaca layar (*screen reader*) dan koneksi internet terbatas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
            aria-label="Tutup tampilan tabel teks"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Pencarian */}
        <div className="p-3 border-b border-[var(--color-border)] bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari wilayah, judul, atau kebutuhan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md text-xs text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-focus)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] font-semibold">Kategori:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-xs text-[var(--color-text)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-focus)] cursor-pointer"
            >
              <option value="ALL">Semua ({reports.length})</option>
              <option value="BENCANA">Bencana Alam</option>
              <option value="LINGKUNGAN">Lingkungan</option>
              <option value="LANSIA">Lansia</option>
              <option value="KESEHATAN">Kesehatan</option>
              <option value="PENDIDIKAN">Pendidikan</option>
              <option value="SOSIAL_LAINNYA">Sosial Lainnya</option>
            </select>
            <span className="text-[var(--color-text-muted)] font-bold pl-2">
              {filtered.length} ditemukan
            </span>
          </div>
        </div>

        {/* Tabel Data Operasional */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-text-muted)] italic">
              Tidak ada data laporan yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs tabular-numbers">
                <thead>
                  <tr className="border-b-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] font-bold">
                    <th className="p-2.5">Wilayah</th>
                    <th className="p-2.5">Laporan &amp; Kategori</th>
                    <th className="p-2.5">Tipe &amp; Urgensi</th>
                    <th className="p-2.5">Status Selisih Logistik</th>
                    <th className="p-2.5">Skor Kepercayaan</th>
                    <th className="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filtered.map((rep) => {
                    return (
                      <tr key={rep.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                        <td className="p-2.5 align-top font-semibold text-[var(--color-text)] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                            <span>{rep.region.name}</span>
                          </div>
                          <span className="text-[10px] text-[var(--color-text-muted)] block pl-4">
                            {rep.region.province}
                          </span>
                        </td>

                        <td className="p-2.5 align-top">
                          <strong className="text-[var(--color-text)] block mb-0.5">
                            {rep.title}
                          </strong>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-800 mr-1.5">
                            {rep.category}
                          </span>
                          {rep.isLocationBlurred && (
                            <span className="text-[10px] text-[var(--color-info-text)] italic">
                              (Lokasi disamarkan)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 align-top whitespace-nowrap">
                          <span className="block font-medium text-[var(--color-text)]">
                            {rep.type}
                          </span>
                          <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                            {rep.urgency}
                          </span>
                        </td>

                        <td className="p-2.5 align-top">
                          {rep.type === "KEBUTUHAN" ? (
                            rep.itemDeficits.length > 0 ? (
                              <div className="space-y-1">
                                {rep.itemDeficits.map((item, i) => (
                                  <div key={i} className="text-[11px]">
                                    <span className="font-semibold text-[var(--color-text)]">
                                      {item.itemCategory}:
                                    </span>{" "}
                                    <span className="text-[var(--color-danger-text)] font-bold">
                                      Kurang {item.deficit} {item.unit}
                                    </span>{" "}
                                    <span className="text-[var(--color-text-muted)]">
                                      (Butuh: {item.totalNeed}, Masuk: {item.totalConfirmedAid})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[var(--color-text-muted)] italic">
                                Belum ada item
                              </span>
                            )
                          ) : (
                            <span className="text-[11px] text-[var(--color-text-muted)] italic">
                              Pemantauan kondisi (Tanpa logistik)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 align-top whitespace-nowrap">
                          <span className="font-extrabold text-[var(--color-primary)]">
                            {rep.trustScore} / 100
                          </span>
                          {rep.verificationLevel === "OFFICIAL" && (
                            <span className="block text-[10px] text-[var(--color-success-text)] font-semibold">
                              Resmi Lembaga
                            </span>
                          )}
                          {rep.verificationLevel === "COMMUNITY" && (
                            <span className="block text-[10px] text-[var(--color-success-text)] font-semibold">
                              Komunitas (2x)
                            </span>
                          )}
                        </td>

                        <td className="p-2.5 align-top text-right whitespace-nowrap">
                          <Link
                            href={`/laporan/${rep.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-hover)] transition-colors text-xs"
                          >
                            <span>Detail</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--color-secondary)] hover:bg-[#111e29] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup Daftar Teks
          </button>
        </div>
      </div>
    </div>
  );
}
