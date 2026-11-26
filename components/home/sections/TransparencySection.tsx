"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, ShieldCheck, Users } from "lucide-react";

export function TransparencySection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    {
      title: "Verifikasi Dua Lapis (Komunitas & Lembaga Resmi)",
      body: "Laporan baru berstatus PENDING dan tidak tampil di peta atau halaman publik sebelum disetujui oleh minimal 2 akun verifikator komunitas yang berbeda (COMMUNITY) atau 1 verifikator lembaga terakreditasi (OFFICIAL).",
    },
    {
      title: "Skor Kepercayaan Deterministik (0–100)",
      body: "Skor dihitung secara matematis di server (bukan oleh AI): Foto bukti lapangan (+30), pelapor terpercaya (+20), laporan mandiri lain dalam radius 2 km (+20), kelengkapan 5W+1H (+15), dan kontak terverifikasi (+15). Rincian poin selalu ditampilkan terbuka.",
    },
    {
      title: "Pengaburan Lokasi Kategori Sensitif & Pencegahan Penumpukan",
      body: "Kategori LANSIA dan KESEHATAN otomatis dibulatkan koordinatnya hingga 2 angka desimal (~1,1 km) di API publik. Selisih logistik dihitung per pasangan kategori dan satuan ukur dengan isolasi transaksi database untuk mencegah duplikasi bantuan.",
    },
  ];

  return (
    <section
      aria-label="Verifikasi dan Transparansi"
      className="py-10 sm:py-12 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Verifikasi &amp; Transparansi
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            Bagaimana Data Diverifikasi Sebelum Tampil ke Publik
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Setiap laporan melewati kurasi faktual agar informasi yang diterima publik dapat dipertanggungjawabkan.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-success-bg)] text-[var(--color-success-text)]">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              COMMUNITY (2 Verifikator)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-primary)]/40">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              OFFICIAL (Lembaga)
            </span>
          </div>
          <div className="pt-2">
            <Link
              href="/tentang"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Pelajari metodologi lengkap di halaman Tentang &rarr;
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.title}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[48px] px-5 py-3.5 flex items-center justify-between text-left text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-focus)]"
                >
                  <span>{item.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--color-text-secondary)] shrink-0 ml-3 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="px-5 pb-4 pt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]"
                  >
                    {item.body}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

