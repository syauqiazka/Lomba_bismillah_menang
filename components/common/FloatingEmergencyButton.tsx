"use client";

import { useState } from "react";
import Link from "next/link";
import { PhoneCall, X, ExternalLink, ShieldAlert } from "lucide-react";

export function FloatingEmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickContacts = [
    { name: "BNPB (Bencana Alam)", number: "117", desc: "Pusdalops Penanggulangan Bencana" },
    { name: "BASARNAS (Pencarian & Pertolongan)", number: "115", desc: "Evakuasi Darurat SAR" },
    { name: "Layanan Darurat Terpadu", number: "112", desc: "Panggilan Darurat Bebas Pulsa" },
    { name: "Ambulans / Kemenkes", number: "119", desc: "Gawat Darurat Medis" },
    { name: "Kepolisian RI", number: "110", desc: "Keamanan & Ketertiban" },
  ];

  return (
    <>
      {/* Tombol Terapung */}
      <aside
        aria-label="Akses Cepat Kontak Darurat"
        className="fixed bottom-5 right-5 z-[1200]"
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#B83E37] hover:bg-[#99332D] text-white font-bold text-xs shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Buka nomor darurat nasional cepat"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>Nomor Darurat</span>
        </button>
      </aside>

      {/* Modal / Sheet Panggilan Cepat */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Panggilan Cepat Kontak Darurat Nasional"
          className="fixed inset-0 z-[1250] bg-black/40 backdrop-blur-2xs flex items-end sm:items-center justify-center p-3 sm:p-4"
        >
          <div
            className="w-full max-w-sm bg-white border border-[var(--color-border)] rounded-2xl sm:rounded-xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            {/* Header */}
            <div className="p-4 bg-[var(--color-danger-bg)] border-b border-red-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-danger-text)]">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h2 className="text-sm font-bold">Panggilan Darurat Resmi</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[var(--color-danger-text)] hover:bg-red-200/50 cursor-pointer"
                aria-label="Tutup jendela darurat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Nomor Darurat */}
            <div className="p-3 divide-y divide-[var(--color-border)] max-h-[60vh] overflow-y-auto">
              {quickContacts.map((c, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-[var(--color-text)] block">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)] block">
                      {c.desc}
                    </span>
                  </div>
                  <a
                    href={`tel:${c.number}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B83E37] hover:bg-[#99332D] text-white font-extrabold text-xs tabular-numbers shadow-xs"
                    title={`Hubungi ${c.number}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{c.number}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[var(--color-bg)] border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Bebas pulsa dari seluruh operator
              </span>
              <Link
                href="/darurat"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
              >
                <span>Direktori Lengkap</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
