"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  ShieldAlert,
  CheckCircle2,
  Phone,
  MessageSquare,
  Lock,
  HeartHandshake,
  Calendar,
  Layers,
  Printer,
  Download,
} from "lucide-react";
import type { PublicReportDetail } from "@/lib/public-queries";
import type { SessionData } from "@/lib/session-options";
import { RecordAidModal } from "@/components/report/RecordAidModal";

interface ReportDetailViewProps {
  report: PublicReportDetail;
  session?: SessionData | null;
}

export function ReportDetailView({ report, session }: ReportDetailViewProps) {
  const [isAidModalOpen, setIsAidModalOpen] = useState(false);
  const isLoggedIn = Boolean(session && session.userId);
  const isNeedsType = report.type === "KEBUTUHAN";

  const formattedDate = new Date(report.when).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function handlePrint() {
    window.print();
  }

  function handleExportReportCSV() {
    const lines: string[] = [];

    lines.push(`LEMBAR BRIEFING LAPANGAN POSKO DARURAT (TRASEC)`);
    lines.push(`ID Laporan,${report.id}`);
    lines.push(`Judul Laporan,"${report.title.replace(/"/g, '""')}"`);
    lines.push(`Tipe Laporan,${report.type}`);
    lines.push(`Kategori,${report.category}`);
    lines.push(`Tingkat Urgensi,${report.urgency}`);
    lines.push(`Wilayah Administratif,"${report.region.name}, ${report.region.province}"`);
    lines.push(`Tingkat Verifikasi,${report.verificationLevel || "Belum Diverifikasi"}`);
    lines.push(`Skor Kepercayaan,${report.trustScore} / 100`);
    lines.push(`Waktu Kejadian,"${new Date(report.when).toISOString()}"`);
    lines.push(``);

    lines.push(`=== KERANGKA LAPANGAN 5W + 1H ===`);
    lines.push(`What (Kejadian),"${report.what.replace(/"/g, '""')}"`);
    lines.push(`Who (Pihak Terdampak),"${report.who.replace(/"/g, '""')}"`);
    lines.push(`Where (Patokan Lokasi),"${report.whereDescription.replace(/"/g, '""')}"`);
    lines.push(`Why (Latar Belakang),"${report.why.replace(/"/g, '""')}"`);
    lines.push(`How (Akses Jalur),"${report.how.replace(/"/g, '""')}"`);
    lines.push(``);

    if (isNeedsType && report.itemDeficits && report.itemDeficits.length > 0) {
      lines.push(`=== RINCIAN KEBUTUHAN VS BANTUAN TERKONFIRMASI ===`);
      lines.push(`Kategori Item,Satuan Ukur,Jumlah Kebutuhan,Bantuan Terkonfirmasi,Selisih Kekurangan,Persentase Terpenuhi,Status Selisih`);
      for (const item of report.itemDeficits) {
        const statusText = item.deficit === 0 ? "Terpenuhi" : item.percentageFulfilled < 50 ? "Kekurangan Besar" : "Kekurangan Sedang";
        lines.push(
          `"${item.itemCategory}","${item.unit}",${item.totalNeed},${item.totalConfirmedAid},${item.deficit},${item.percentageFulfilled}%,"${statusText}"`
        );
      }
      lines.push(``);
    }

    if (report.coordinatorContact) {
      lines.push(`=== KONTAK KOORDINATOR LAPANGAN ===`);
      lines.push(`Nama Koordinator,"${report.coordinatorContact.name}"`);
      lines.push(`Nomor Telepon,"${report.coordinatorContact.phone || "-"}"`);
      lines.push(``);
    }

    const csvContent = lines.join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `briefing-posko-${report.id.slice(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-[var(--color-border)] py-3 px-4 sm:px-6 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta Operasional</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportReportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              title="Unduh format spreadsheet untuk posko lapangan"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh CSV Posko</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              title="Cetak lembar briefing posko lapangan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Lembar Posko</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Banner Peringatan Privasi atau Data Basi */}
        {report.isLocationBlurred && (
          <div className="p-3.5 rounded-xl bg-[var(--color-info-bg)] border border-blue-200 text-xs text-[var(--color-info-text)] flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0 text-blue-700" />
            <div>
              <strong className="block text-blue-900 font-bold mb-0.5">
                Pengaburan Lokasi Sensitif Aktif
              </strong>
              <span>
                Karena laporan ini melibatkan kelompok rentan (lansia/kesehatan), titik koordinat dibulatkan ke radius ~1,1 km dan patokan alamat presisi disamarkan untuk publik.
              </span>
            </div>
          </div>
        )}

        {report.isStale && (
          <div className="p-3.5 rounded-xl bg-[var(--color-warning-bg)] border border-amber-300 text-xs text-[var(--color-warning-text)] flex items-start gap-2.5">
            <Clock className="w-5 h-5 shrink-0 text-amber-700" />
            <div>
              <strong className="block font-bold mb-0.5">
                Peringatan: Data Perlu Konfirmasi Ulang
              </strong>
              <span>
                Laporan ini belum memiliki pembaruan atau catatan penyaluran bantuan selama lebih dari 7 hari. Relawan lapangan disarankan memeriksa kondisi riil sebelum mengirim logistik.
              </span>
            </div>
          </div>
        )}

        {/* Header Utama Laporan */}
        <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase bg-[var(--color-secondary)] text-white">
              {report.category}
            </span>

            {report.urgency === "DARURAT" && (
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#F8E5E3] text-[#B83E37] border border-red-200">
                URGENSI: DARURAT
              </span>
            )}
            {report.urgency === "MENDESAK" && (
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#FBF0DC] text-[#8A5A00] border border-amber-200">
                URGENSI: MENDESAK
              </span>
            )}
            {report.urgency === "TERENCANA" && (
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#E4F0EA] text-[#1B5440] border border-emerald-200">
                URGENSI: TERENCANA
              </span>
            )}

            {report.verificationLevel === "OFFICIAL" && (
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#E4F0EA] text-[#1B5440] border border-emerald-200 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Diverifikasi Lembaga Resmi
              </span>
            )}
            {report.verificationLevel === "COMMUNITY" && (
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#E4F0EA] text-[#1B5440] border border-emerald-200 inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Diverifikasi Komunitas (2x)
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--color-text)] tracking-tight leading-snug">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-secondary)] mt-3 pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span>
                {report.region.name}, {report.region.province}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span>Tipe: <strong className="text-[var(--color-text)]">{report.type}</strong></span>
            </div>
          </div>
        </div>

        {/* Layout Asimetris 2 Kolom (Desktop) / 1 Kolom (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KOLOM KIRI (7 Kolom): Tabel Selisih Logistik & Narasi 5W+1H */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. TABEL SELISIH KEBUTUHAN VS BANTUAN */}
            {isNeedsType ? (
              <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-[var(--color-border)] pb-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
                      Tabel Selisih Kebutuhan Logistik
                    </h2>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Kebutuhan tercatat dikurangi bantuan terkonfirmasi (CONFIRMED)
                    </span>
                  </div>
                </div>

                {report.itemDeficits.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] italic p-4 text-center">
                    Belum ada rincian item kebutuhan logistik tercatat.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {report.itemDeficits.map((item, idx) => {
                      const pct = item.percentageFulfilled;
                      const isLargeDeficit = item.deficit > 0 && pct < 50;

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/50 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-sm text-[var(--color-text)]">
                              {item.itemCategory}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white border border-gray-300 font-semibold text-[11px] text-[var(--color-text-secondary)]">
                              Satuan: {item.unit}
                            </span>
                          </div>

                          {/* Horizontal Progress Bar */}
                          <div className="w-full h-3.5 rounded-md bg-gray-200 flex overflow-hidden border border-gray-300 shadow-2xs">
                            <div
                              className="bg-[#246B50] h-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                              title={`Terkonfirmasi: ${item.totalConfirmedAid} ${item.unit} (${pct}%)`}
                            />
                            <div
                              className="bg-[#B83E37] h-full transition-all duration-300"
                              style={{ width: `${100 - pct}%` }}
                              title={`Kekurangan: ${item.deficit} ${item.unit}`}
                            />
                          </div>

                          {/* Data Angka Tabular */}
                          <div className="grid grid-cols-3 gap-2 text-xs tabular-numbers pt-1 text-center sm:text-left">
                            <div className="bg-white p-2 rounded-lg border border-[var(--color-border)]">
                              <span className="text-[10px] text-[var(--color-text-muted)] block uppercase font-bold">
                                Kebutuhan
                              </span>
                              <span className="font-extrabold text-sm text-[var(--color-text)]">
                                {item.totalNeed} {item.unit}
                              </span>
                            </div>

                            <div className="bg-white p-2 rounded-lg border border-[var(--color-border)]">
                              <span className="text-[10px] text-[#1B5440] block uppercase font-bold">
                                Terkonfirmasi
                              </span>
                              <span className="font-extrabold text-sm text-[#1B5440]">
                                {item.totalConfirmedAid} {item.unit} ({pct}%)
                              </span>
                            </div>

                            <div className="bg-white p-2 rounded-lg border border-[var(--color-border)]">
                              <span className="text-[10px] text-[#B83E37] block uppercase font-bold">
                                Sisa Selisih
                              </span>
                              <span className={`font-extrabold text-sm ${isLargeDeficit ? "text-[#B83E37]" : "text-[var(--color-text)]"}`}>
                                {item.deficit === 0 ? "0 (Terpenuhi)" : `${item.deficit} ${item.unit}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[var(--color-primary)] mx-auto" />
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Laporan Pemantauan Lingkungan / Sosial
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
                  Laporan ini berfokus pada observasi situasi dan pemantauan kondisi lapangan. Tidak terdapat alokasi kebutuhan logistik barang maupun relawan tenaga.
                </p>
              </div>
            )}

            {/* 2. NARASI KONTEKS LAPANGAN (5W + 1H) */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3">
                Konteks Operasional (Kerangka 5W + 1H)
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
                    What &bull; Kejadian / Situasi
                  </span>
                  <p className="text-[var(--color-text)] leading-relaxed">
                    {report.what}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
                    Who &bull; Pihak Terdampak / Penerima Manfaat
                  </span>
                  <p className="text-[var(--color-text)] leading-relaxed">
                    {report.who}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
                    Where &bull; Patokan Lokasi Akses Aman
                  </span>
                  <p className="text-[var(--color-text)] leading-relaxed">
                    {report.whereDescription}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
                    Why &bull; Penyebab Kebutuhan Mendesak
                  </span>
                  <p className="text-[var(--color-text)] leading-relaxed">
                    {report.why}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
                    How &bull; Kondisi Jalur &amp; Metode Penyaluran Logistik
                  </span>
                  <p className="text-[var(--color-text)] leading-relaxed">
                    {report.how}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (5 Kolom): Aksi Penyaluran, Skor Kepercayaan, Kontak Koordinator, Verifikasi */}
          <div className="lg:col-span-5 space-y-6">
            {/* AKSI PENYALURAN BANTUAN */}
            {isNeedsType && (
              <div className="bg-white border-2 border-[var(--color-primary)] rounded-2xl p-5 shadow-sm space-y-3 print:hidden">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <HeartHandshake className="w-5 h-5" />
                  <h3 className="text-base font-bold text-[var(--color-text)]">
                    Salurkan Bantuan Anda
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  Catat barang atau tenaga relawan yang Anda kirimkan untuk memperbarui data selisih riil secara langsung dan mencegah penumpukan di satu titik.
                </p>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => setIsAidModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Catat Bantuan yang Disalurkan</span>
                  </button>
                ) : (
                  <Link
                    href={`/login?next=/laporan/${report.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-secondary)] hover:bg-[#111e29] text-white font-bold text-sm transition-colors shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Masuk untuk Menyalurkan Bantuan</span>
                  </Link>
                )}
              </div>
            )}

            {/* SKOR KEPERCAYAAN & TRANSPARANSI */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Skor Kepercayaan Lapangan
                </h3>
                <span className="text-base font-black text-[var(--color-primary)] tabular-numbers">
                  {report.trustScore} / 100
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, report.trustScore))}%` }}
                />
              </div>

              {report.trustScoreReasons && report.trustScoreReasons.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Daftar Faktor Penentu Skor:
                  </span>
                  <ul className="space-y-1.5">
                    {report.trustScoreReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--color-primary)] mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* KONTAK KOORDINATOR LAPANGAN */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Kontak Koordinator Lapangan
              </h3>

              {isLoggedIn && report.coordinatorContact ? (
                <div className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2.5">
                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase block">
                      Nama Koordinator:
                    </span>
                    <strong className="text-sm text-[var(--color-text)]">
                      {report.coordinatorContact.name}
                    </strong>
                  </div>

                  {report.coordinatorContact.phone ? (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:${report.coordinatorContact.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Panggil Telepon</span>
                      </a>
                      <a
                        href={`https://wa.me/${report.coordinatorContact.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)] italic">
                      Nomor telepon belum dicantumkan.
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--color-text)]">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>Kontak Dilindungi</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Kontak koordinator lapangan hanya dapat diakses oleh relawan terdaftar demi keamanan posko dan pencegahan penipuan.
                  </p>
                  <Link
                    href={`/login?next=/laporan/${report.id}`}
                    className="inline-block text-xs font-bold text-[var(--color-primary)] hover:underline"
                  >
                    Masuk untuk Melihat Kontak &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* RIWAYAT VERIFIKASI */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Riwayat Verifikasi Faktual
              </h3>

              {report.verifications && report.verifications.length > 0 ? (
                <div className="space-y-3 divide-y divide-[var(--color-border)]">
                  {report.verifications.map((v) => (
                    <div key={v.id} className="pt-2.5 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--color-text)]">
                          {v.verifierName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#E4F0EA] text-[#1B5440]">
                          {v.decision === "APPROVE" ? "DISETUJUI" : "DITOLAK"}
                        </span>
                      </div>
                      {v.note && (
                        <p className="text-xs text-[var(--color-text-secondary)] italic leading-relaxed">
                          &ldquo;{v.note}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--color-text-muted)] italic">
                  Belum ada catatan verifikasi tersimpan.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Catat Bantuan */}
      <RecordAidModal
        reportId={report.id}
        itemDeficits={report.itemDeficits}
        isOpen={isAidModalOpen}
        onClose={() => setIsAidModalOpen(false)}
        isTrustedVolunteer={Boolean(session?.isVerifiedVolunteer)}
      />
    </div>
  );
}

