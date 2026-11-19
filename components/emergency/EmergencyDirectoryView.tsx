"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Copy,
  Check,
  Search,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  Building2,
  Globe2,
} from "lucide-react";
import type { EmergencyContactItem } from "@/lib/emergency-queries";

interface EmergencyDirectoryViewProps {
  contacts: EmergencyContactItem[];
}

export function EmergencyDirectoryView({ contacts }: EmergencyDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "NASIONAL" | "DAERAH">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredContacts = contacts.filter((c) => {
    if (scopeFilter === "NASIONAL" && c.scope !== "NASIONAL") return false;
    if (scopeFilter === "DAERAH" && c.scope === "NASIONAL") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchNumber = c.number.includes(q);
      const matchRegion = c.regionName ? c.regionName.toLowerCase().includes(q) : false;
      const matchDesc = c.description ? c.description.toLowerCase().includes(q) : false;
      if (!matchName && !matchNumber && !matchRegion && !matchDesc) return false;
    }
    return true;
  });

  const handleCopyNumber = (contact: EmergencyContactItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact.number);
      setCopiedId(contact.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const nationalCount = contacts.filter((c) => c.scope === "NASIONAL").length;
  const regionalCount = contacts.filter((c) => c.scope !== "NASIONAL").length;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Link to Map */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-forest-main)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta Beranda</span>
          </Link>
          <span className="text-xs text-[var(--color-text-muted)]">
            Diperbarui: November 2026
          </span>
        </div>

        {/* Header Title */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
                Direktori Kontak Darurat Resmi & Posko Bencana
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                Akses cepat panggilan darurat nasional bebas pulsa dan kontak pos komando daerah yang siap dihubungi secara luring.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner Wajib (Bagian 17 AGENTS.md) */}
        <div
          role="alert"
          aria-label="Peringatan Keselamatan Jiwa"
          className="p-4 rounded-lg bg-[var(--color-brick-bg)] border-2 border-[var(--color-brick-border)] text-xs text-[var(--color-text-main)] flex items-start gap-3 shadow-xs"
        >
          <ShieldAlert className="w-5 h-5 text-[var(--color-brick-main)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-bold text-[var(--color-brick-main)] text-sm">
              PERHATIAN KESELAMATAN JIWA: Aplikasi ini BUKAN pengganti layanan darurat negara!
            </h2>
            <p className="leading-relaxed">
              Platform TRASEC merupakan sistem intelijen data dan transparansi logistik kemanusiaan relawan. Jika Anda atau keluarga berada dalam situasi darurat bencana alam, kebakaran, atau ancaman keselamatan jiwa, segera hubungi panggilan darurat terpadu nasional <strong>112</strong>, BASARNAS <strong>115</strong>, atau BNPB <strong>117</strong> di bawah ini.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--color-text-muted)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari instansi (BNPB, BASARNAS, Ambulans), daerah (Cianjur, Semarang), atau nomor..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)] focus:bg-white transition-colors"
              />
            </div>

            {/* Scope Filter Tabs */}
            <div className="sm:col-span-4 flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setScopeFilter("ALL")}
                className={`flex-1 py-2 px-2.5 rounded-md font-bold whitespace-nowrap transition-colors text-center ${
                  scopeFilter === "ALL"
                    ? "bg-[var(--color-forest-main)] text-white shadow-xs"
                    : "bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-100"
                }`}
              >
                Semua ({contacts.length})
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter("NASIONAL")}
                className={`flex-1 py-2 px-2.5 rounded-md font-bold whitespace-nowrap transition-colors text-center ${
                  scopeFilter === "NASIONAL"
                    ? "bg-[var(--color-brick-main)] text-white shadow-xs"
                    : "bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-100"
                }`}
              >
                Nasional ({nationalCount})
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter("DAERAH")}
                className={`flex-1 py-2 px-2.5 rounded-md font-bold whitespace-nowrap transition-colors text-center ${
                  scopeFilter === "DAERAH"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-100"
                }`}
              >
                Posko ({regionalCount})
              </button>
            </div>
          </div>
        </div>

        {/* Contact Cards Grid */}
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg border border-[var(--color-border-subtle)]">
            <AlertTriangle className="w-8 h-8 text-[var(--color-amber-main)] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-1">
              Tidak Ada Kontak yang Cocok
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Silakan periksa ejaan kata kunci pencarian atau ubah filter cakupan wilayah.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setScopeFilter("ALL");
              }}
              className="px-3 py-1.5 rounded bg-[var(--color-forest-main)] text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((contact) => {
              const isNational = contact.scope === "NASIONAL";
              const isCopied = copiedId === contact.id;

              return (
                <div
                  key={contact.id}
                  className={`bg-white rounded-lg border p-4 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between ${
                    isNational
                      ? "border-l-4 border-l-[var(--color-brick-main)] border-slate-200"
                      : "border-l-4 border-l-[var(--color-forest-main)] border-slate-200"
                  }`}
                >
                  <div>
                    {/* Badge Scope & Region */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                            isNational
                              ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border border-[var(--color-brick-border)]"
                              : "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border border-[var(--color-forest-border)]"
                          }`}
                        >
                          {contact.scope}
                        </span>
                        {contact.regionName && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200 flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            {contact.regionName}
                          </span>
                        )}
                      </div>

                      {contact.sourceUrl && (
                        <a
                          href={contact.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[var(--color-forest-main)] hover:underline inline-flex items-center gap-1"
                          title="Buka situs web rujukan resmi"
                        >
                          <Globe2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Web Resmi</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    {/* Agency Name */}
                    <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-1">
                      {contact.name}
                    </h3>

                    {/* Description */}
                    {contact.description && (
                      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">
                        {contact.description}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Display & Action Buttons */}
                  <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Nomor Panggilan
                      </span>
                      <span
                        className={`text-xl sm:text-2xl font-black font-mono tracking-wider ${
                          isNational ? "text-[var(--color-brick-main)]" : "text-[var(--color-text-main)]"
                        }`}
                      >
                        {contact.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(contact)}
                        className="px-2.5 py-2 rounded-md border border-[var(--color-border-subtle)] bg-white hover:bg-slate-50 text-xs font-semibold text-[var(--color-text-main)] flex items-center gap-1 transition-colors"
                        title="Salin nomor ke papan klip"
                        aria-label={`Salin nomor telepon ${contact.name}`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[var(--color-forest-main)]" />
                            <span className="text-[var(--color-forest-main)] text-[11px]">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            <span className="text-[11px] hidden sm:inline">Salin</span>
                          </>
                        )}
                      </button>

                      {/* Direct Dial Button */}
                      <a
                        href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                        className={`px-3 py-2 rounded-md text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition-colors ${
                          isNational
                            ? "bg-[var(--color-brick-main)] hover:bg-[var(--color-brick-dark)]"
                            : "bg-[var(--color-forest-main)] hover:bg-[var(--color-forest-dark)]"
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Panggil</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

