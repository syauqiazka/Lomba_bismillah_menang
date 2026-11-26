"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PhoneCall, X, ExternalLink, ShieldAlert } from "lucide-react";

export function FloatingEmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const quickContacts = [
    { name: "BNPB (Bencana Alam)", number: "117", desc: "Pusdalops Penanggulangan Bencana" },
    { name: "BASARNAS (Pencarian & Pertolongan)", number: "115", desc: "Evakuasi Darurat SAR" },
    { name: "Layanan Darurat Terpadu", number: "112", desc: "Panggilan Darurat Bebas Pulsa" },
    { name: "Ambulans / Kemenkes", number: "119", desc: "Gawat Darurat Medis" },
    { name: "Kepolisian RI", number: "110", desc: "Keamanan & Ketertiban" },
  ];

  return (
    <>
      {/* Tombol Terapung (--z-floating-emergency: 1200) */}
      <aside
        aria-label="Akses Cepat Kontak Darurat"
        className="fixed bottom-5 right-5 z-[1200]"
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ boxShadow: "var(--shadow-elevated)" }}
          className="flex items-center gap-2 min-h-[48px] min-w-[56px] px-4 py-3 rounded-lg bg-[#B83E37] hover:bg-[#99332D] text-white font-bold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-2 cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Buka nomor darurat nasional cepat"
        >
          <PhoneCall className="w-4 h-4" aria-hidden="true" />
          <span>Nomor Darurat</span>
        </button>
      </aside>

      {/* Modal Panggilan Cepat (--z-modal: 1300) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Panggilan Cepat Kontak Darurat Nasional"
          className="fixed inset-0 z-[1300] bg-black/50 flex items-end sm:items-center justify-center p-3 sm:p-4"
        >
          <div
            className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-xl sm:rounded-lg overflow-hidden"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            {/* Header */}
            <div className="p-4 bg-[var(--color-danger-bg)] border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-danger-text)]">
                <ShieldAlert className="w-5 h-5 shrink-0" aria-hidden="true" />
                <h2 className="text-sm font-bold">Panggilan Darurat Resmi</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded text-[var(--color-danger-text)] hover:bg-black/5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                aria-label="Tutup jendela darurat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Peringatan Wajib AGENTS.md Bagian 17 */}
            <div className="px-4 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              Dalam kondisi darurat mengancam keselamatan jiwa, hubungi saluran darurat resmi pemerintah segera. Aplikasi ini bukan layanan panggilan tanggap darurat.
            </div>

            {/* List Nomor Darurat */}
            <div className="p-3 divide-y divide-[var(--color-border)] max-h-[55vh] overflow-y-auto">
              {quickContacts.map((c, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-[var(--color-text)] block">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-secondary)] block">
                      {c.desc}
                    </span>
                  </div>
                  <a
                    href={`tel:${c.number}`}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded bg-[#B83E37] hover:bg-[#99332D] text-white font-bold text-xs tabular-numbers"
                    title={`Hubungi ${c.number}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{c.number}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-secondary)]">
                Tersedia secara luring
              </span>
              <Link
                href="/darurat"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 min-h-[44px] px-2 text-xs font-bold text-[var(--color-primary)] hover:underline"
              >
                <span>Direktori Lengkap</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
