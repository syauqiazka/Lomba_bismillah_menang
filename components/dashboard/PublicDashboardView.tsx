"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Package,
  Building2,
  PhoneCall,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Download,
} from "lucide-react";
import type { DashboardData } from "@/lib/dashboard-queries";

interface PublicDashboardViewProps {
  data: DashboardData;
}

export function PublicDashboardView({ data }: PublicDashboardViewProps) {
  const { metrics, regionPriorities, logisticsStats } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredLogistics = logisticsStats.filter((item) => {
    if (selectedCategory === "ALL") return true;
    return item.itemCategory === selectedCategory;
  });

  function handleExportPoskoCSV() {
    const lines: string[] = [];

    // Header Meta Posko
    lines.push(`REKAPITULASI LOGISTIK POSKO KEMANUSIAAN NASIONAL (TRASEC)`);
    lines.push(`Tanggal Cetak / Ekspor,${new Date().toISOString()}`);
    lines.push(`Total Laporan Terverifikasi,${metrics.totalVerifiedReports}`);
    lines.push(`Total Bantuan Terkonfirmasi,${metrics.totalConfirmedAidItems}`);
    lines.push(`Total Selisih Kekurangan,${metrics.totalRemainingDeficitItems}`);
    lines.push(``);

    // Seksi 1: Rekap Kebutuhan vs Bantuan Logistik
    lines.push(`=== RINCIAN REKAPITULASI SELISIH LOGISTIK ===`);
    lines.push(`Kategori Logistik,Satuan Utama,Total Kebutuhan,Total Terkonfirmasi,Selisih Kekurangan,Persentase Terpenuhi`);
    for (const item of logisticsStats) {
      lines.push(
        `"${item.itemCategory}","${item.primaryUnit}",${item.totalNeed},${item.totalConfirmed},${item.totalDeficit},${item.fulfillmentPercentage}%`
      );
    }
    lines.push(``);

    // Seksi 2: Pemeringkatan Prioritas Wilayah
    lines.push(`=== INDEKS PRIORITAS WILAYAH DARURAT ===`);
    lines.push(`Peringkat,Nama Wilayah,Provinsi,Kota/Kabupaten,Laporan Terverifikasi,Tingkat Urgensi,Status Selisih`);
    regionPriorities.forEach((reg, idx) => {
      lines.push(
        `${idx + 1},"${reg.regionName}","${reg.province}","${reg.city}",${reg.verifiedReportsCount},"${reg.highestUrgency}","${reg.highestDeficitStatus}"`
      );
    });

    const csvContent = lines.join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rekap-posko-trasec-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Dashboard */}
        <div className="bg-white p-6 rounded-lg border border-[var(--color-border-subtle)] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-forest-main)] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-forest-main)]">
                Data Kemanusiaan Faktual Nasional
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
              Dashboard Intelijen &amp; Transparansi Bantuan
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-2xl">
              Memantau selisih logistik riil antara kebutuhan yang dilaporkan dan bantuan yang telah terkonfirmasi secara terbuka per wilayah administratif.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportPoskoCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[var(--color-border-subtle)] bg-white text-xs font-bold text-[var(--color-text-main)] hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
              title="Unduh format spreadsheet untuk koordinasi posko luring"
            >
              <Download className="w-3.5 h-3.5 text-[var(--color-forest-main)]" />
              <span>Ekspor Rekap Posko (CSV)</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Jelajahi Peta Terpadu</span>
            </Link>
            <Link
              href="/darurat"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[var(--color-brick-border)] bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] text-xs font-bold hover:bg-red-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Posko Darurat</span>
            </Link>
          </div>
        </div>

        {/* 5 Headline Metrics Cards (Our World in Data & UNHCR style) */}
        <section aria-label="Metrik Utama Nasional" className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Laporan Terverifikasi */}
          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-forest-main)] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Laporan Terverifikasi
              </span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--color-forest-main)]">
              {metrics.totalVerifiedReports}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[var(--color-forest-main)]" />
              <span>Validasi berlapis resmi</span>
            </div>
          </div>

          {/* Card 2: Antrean Kurasi (Agregat Total) */}
          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-amber-main)] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Antrean Tinjauan
              </span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--color-amber-main)]">
              {metrics.totalPendingReports}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1">
              <span>Sedang diproses verifikator</span>
            </div>
          </div>

          {/* Card 3: Wilayah Aktif */}
          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-text-main)] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Wilayah Terpantau
              </span>
              <Building2 className="w-4 h-4 text-[var(--color-forest-main)]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--color-text-main)]">
              {metrics.totalActiveRegions}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1">
              <span>Kabupaten & Kota aktif</span>
            </div>
          </div>

          {/* Card 4: Bantuan Terkonfirmasi */}
          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-forest-main)] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Bantuan Terkonfirmasi
              </span>
              <Package className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--color-forest-main)]">
              {metrics.totalConfirmedAidItems.toLocaleString("id-ID")}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1">
              <span>Item logistik & relawan</span>
            </div>
          </div>

          {/* Card 5: Selisih Kebutuhan Riil */}
          <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-lg border-2 border-[var(--color-brick-border)] bg-[var(--color-brick-bg)]/20 shadow-xs">
            <div className="flex items-center justify-between text-[var(--color-brick-main)] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brick-main)]">
                Selisih Belum Terpenuhi
              </span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--color-brick-main)]">
              {metrics.totalRemainingDeficitItems.toLocaleString("id-ID")}
            </div>
            <div className="text-[11px] text-[var(--color-brick-main)] mt-1 font-semibold">
              <span>Kekurangan riil lapangan</span>
            </div>
          </div>
        </section>

        {/* Section: Distribusi Urgensi & Kategori Isu */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Urgensi Operasional (Col 5) */}
          <div className="md:col-span-5 bg-white p-5 rounded-lg border border-[var(--color-border-subtle)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--color-forest-main)]" />
                Distribusi Tingkat Urgensi
              </h2>
              <span className="text-[11px] text-[var(--color-text-muted)]">Laporan Terverifikasi</span>
            </div>

            <div className="space-y-3">
              {/* Darurat */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--color-brick-main)] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brick-main)]"></span>
                    Darurat (Bencana Kritis)
                  </span>
                  <span className="font-mono">{metrics.byUrgency.DARURAT || 0} Laporan</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-brick-main)]"
                    style={{
                      width: `${
                        metrics.totalVerifiedReports > 0
                          ? ((metrics.byUrgency.DARURAT || 0) / metrics.totalVerifiedReports) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Mendesak */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--color-amber-main)] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber-main)]"></span>
                    Mendesak (Tenggat Cepat)
                  </span>
                  <span className="font-mono">{metrics.byUrgency.MENDESAK || 0} Laporan</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-amber-main)]"
                    style={{
                      width: `${
                        metrics.totalVerifiedReports > 0
                          ? ((metrics.byUrgency.MENDESAK || 0) / metrics.totalVerifiedReports) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Terencana */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--color-slate-muted)] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-slate-muted)]"></span>
                    Terencana (Sosial & Lingkungan)
                  </span>
                  <span className="font-mono">{metrics.byUrgency.TERENCANA || 0} Laporan</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-slate-muted)]"
                    style={{
                      width: `${
                        metrics.totalVerifiedReports > 0
                          ? ((metrics.byUrgency.TERENCANA || 0) / metrics.totalVerifiedReports) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Kategori Kemanusiaan (Col 7) */}
          <div className="md:col-span-7 bg-white p-5 rounded-lg border border-[var(--color-border-subtle)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-forest-main)]" />
                Persebaran Kategori Isu Lapangan
              </h2>
              <span className="text-[11px] text-[var(--color-text-muted)]">6 Kategori Resmi</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {Object.entries(metrics.byCategory).map(([cat, count]) => (
                <div
                  key={cat}
                  className="p-3 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex flex-col justify-between"
                >
                  <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase">
                    {cat}
                  </span>
                  <div className="text-xl font-black font-mono text-[var(--color-text-main)] mt-1">
                    {count}
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                    Titik Kebutuhan
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Rekap Selisih Logistik Nasional (Grafik Batang Transparan) */}
        <section aria-label="Kebutuhan Logistik Nasional" className="bg-white p-5 sm:p-6 rounded-lg border border-[var(--color-border-subtle)] shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[var(--color-text-main)] tracking-tight">
                Rekapitulasi Selisih Kebutuhan Logistik & Personel
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Perbandingan kuantitas kebutuhan riil vs bantuan terkonfirmasi disalurkan.
              </p>
            </div>

            {/* Filter Kategori Logistik dengan Pembeda Aktif yang Sangat Jelas */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Filter:</span>
                {["ALL", "MAKANAN", "HUNIAN", "MEDIS", "SANITASI", "LOGISTIK", "EVAKUASI"].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white shadow-sm ring-2 ring-emerald-600/30 scale-[1.02]"
                          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300"
                      }`}
                      aria-pressed={isActive}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />}
                      <span>{cat === "ALL" ? "Semua" : cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Badge Filter Aktif */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-[var(--color-primary)] shrink-0 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                <span>
                  Menampilkan:{" "}
                  <strong>{selectedCategory === "ALL" ? "Semua Kategori Logistik" : `Kategori ${selectedCategory}`}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Logistics Progress Bars */}
          <div className="space-y-4 pt-2">
            {filteredLogistics.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)] text-center py-6">
                Tidak ada data logistik untuk kategori yang dipilih.
              </p>
            ) : (
              filteredLogistics.map((stat) => {
                const isCritical = stat.fulfillmentPercentage < 50;

                return (
                  <div
                    key={stat.itemCategory}
                    className="p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/50 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--color-text-main)]">
                          {stat.itemCategory}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                          Satuan: {stat.primaryUnit}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span>
                          Kebutuhan: <strong>{stat.totalNeed.toLocaleString("id-ID")}</strong>
                        </span>
                        <span className="text-[var(--color-forest-main)]">
                          Tersalurkan: <strong>{stat.totalConfirmed.toLocaleString("id-ID")}</strong>
                        </span>
                        <span className="text-[var(--color-brick-main)] font-bold">
                          Selisih: <strong>{stat.totalDeficit.toLocaleString("id-ID")}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Dual Segment */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-[var(--color-forest-main)] transition-all"
                        style={{ width: `${stat.fulfillmentPercentage}%` }}
                        title={`Terkonfirmasi: ${stat.fulfillmentPercentage}%`}
                      ></div>
                      <div
                        className="h-full bg-[var(--color-brick-main)] transition-all opacity-85"
                        style={{ width: `${Math.max(0, 100 - stat.fulfillmentPercentage)}%` }}
                        title={`Selisih Belum Terpenuhi: ${Math.max(0, 100 - stat.fulfillmentPercentage)}%`}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1 font-semibold">
                        {isCritical ? (
                          <span className="text-[var(--color-brick-main)] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Kekurangan signifikan ({100 - stat.fulfillmentPercentage}% belum terpenuhi)
                          </span>
                        ) : (
                          <span className="text-[var(--color-forest-main)] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Terpenuhi {stat.fulfillmentPercentage}%
                          </span>
                        )}
                      </span>

                      <Link
                        href={`/?category=${stat.itemCategory}`}
                        className="text-[var(--color-forest-main)] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Lihat Lokasi Terkait
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Section: Pemeringkatan Wilayah Prioritas (Regional Priority Table) */}
        <section aria-label="Daftar Wilayah Prioritas" className="bg-white p-5 sm:p-6 rounded-lg border border-[var(--color-border-subtle)] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-[var(--color-text-main)] tracking-tight">
                Tabel Pemeringkatan Wilayah Prioritas
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Daftar kabupaten/kota diurutkan berdasarkan bobot kekurangan logistik dan urgensi laporan riil.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-[var(--color-border-subtle)] rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
                <tr>
                  <th className="p-3 font-semibold">Wilayah & Provinsi</th>
                  <th className="p-3 font-semibold text-center">Titik Kebutuhan</th>
                  <th className="p-3 font-semibold">Urgensi Tertinggi</th>
                  <th className="p-3 font-semibold">Status Kekurangan</th>
                  <th className="p-3 font-semibold">Selisih Kebutuhan Terbesar</th>
                  <th className="p-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {regionPriorities.map((reg) => {
                  const isLargeDeficit = reg.highestDeficitStatus === "KEKURANGAN_BESAR";

                  return (
                    <tr key={reg.regionId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[var(--color-text-main)]">
                        <div>{reg.regionName}</div>
                        <div className="text-[11px] font-normal text-[var(--color-text-muted)]">
                          {reg.province}
                        </div>
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-sm">
                        {reg.verifiedReportsCount}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            reg.highestUrgency === "DARURAT"
                              ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border border-[var(--color-brick-border)]"
                              : reg.highestUrgency === "MENDESAK"
                              ? "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)] border border-[var(--color-amber-border)]"
                              : "bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200"
                          }`}
                        >
                          {reg.highestUrgency}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isLargeDeficit
                              ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)]"
                              : reg.highestDeficitStatus === "KEKURANGAN_SEDANG"
                              ? "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)]"
                              : "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)]"
                          }`}
                        >
                          {reg.highestDeficitStatus.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="p-3 text-xs">
                        {reg.topItemCategories.length > 0 ? (
                          <div className="space-y-0.5">
                            {reg.topItemCategories.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                <span className="font-semibold text-[var(--color-text-main)]">
                                  {item.itemCategory}:
                                </span>
                                <span className="text-[var(--color-brick-main)] font-mono font-bold">
                                  kurang {item.deficit} {item.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[var(--color-text-muted)] italic">Pemantauan non-logistik</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <Link
                          href={`/?region=${reg.regionId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[var(--color-forest-main)] text-white text-xs font-semibold hover:bg-[var(--color-forest-dark)] transition-colors shadow-xs"
                        >
                          <span>Buka Peta</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Callout Footer */}
        <section className="bg-white p-6 rounded-lg border border-[var(--color-border-subtle)] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--color-text-main)]">
              Memiliki Informasi Kebutuhan Lapangan atau Ingin Menyalurkan Bantuan?
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Ajukan laporan terstruktur 5W+1H untuk dikurasi tim verifikator, atau langsung salurkan bantuan sesuai selisih riil yang tercatat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buat Laporan Baru</span>
            </Link>
            <Link
              href="/darurat"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] text-[var(--color-text-main)] text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Kontak Darurat</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

