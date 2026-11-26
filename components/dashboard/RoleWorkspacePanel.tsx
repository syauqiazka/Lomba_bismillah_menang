"use client";

import Link from "next/link";
import {
  FilePlus2,
  WifiOff,
  ClipboardCheck,
  Clock,
  ShieldAlert,
  Users,
  ArrowRight,
  Package,
} from "lucide-react";
import type { RoleWorkspaceData, RegionPriorityStat } from "@/lib/dashboard-queries";

interface RoleWorkspacePanelProps {
  workspace: RoleWorkspaceData;
  userName: string;
  regionPriorities: RegionPriorityStat[];
}

export function RoleWorkspacePanel({
  workspace,
  userName,
  regionPriorities,
}: RoleWorkspacePanelProps) {
  const { role, isDemoMode, myReports, pendingSlaQueue, adminAuditSummary } = workspace;

  return (
    <section
      aria-label="Ruang Kerja Operasional Sesuai Peran"
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-6"
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 space-y-5">
        {/* Header Peran Operasional */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--forest-900)] text-white">
                PERAN: {role}
              </span>
              {isDemoMode && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--status-demo)] text-white">
                  DEMO
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
              Ruang Kerja Operasional — {userName}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[var(--forest-700)] hover:bg-[var(--forest-900)] text-white font-semibold"
            >
              <FilePlus2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Buat Laporan</span>
            </Link>
            {(role === "RELAWAN" || role === "ADMIN") && (
              <Link
                href="/antrean"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-muted)] text-[var(--text)] font-semibold"
              >
                <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Antrean Offline</span>
              </Link>
            )}
            {(role === "VERIFIKATOR" || role === "ADMIN") && (
              <Link
                href="/verifikasi"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[var(--color-info-bg)] text-[var(--status-info)] font-semibold border border-[var(--border)]"
              >
                <ClipboardCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Antrean Verifikasi</span>
              </Link>
            )}
            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-lg bg-purple-100 text-purple-900 font-semibold border border-purple-200"
              >
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Panel Admin</span>
              </Link>
            )}
          </div>
        </div>

        {/* Grid Operasional Padat & Cepat Dipindai */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Panel 1: Laporan Saya (Relawan & semua peran pelapor) */}
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="bg-[var(--bg)] px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--text)]">
              <span>Laporan Saya &amp; Status ({myReports.length})</span>
              <Link href="/lapor" className="text-[var(--forest-700)] hover:underline">
                + Lapor Baru
              </Link>
            </div>
            {myReports.length === 0 ? (
              <div className="p-4 text-xs text-[var(--text-muted)]">
                Belum ada laporan yang diajukan dari akun ini. Gunakan tombol Buat Laporan atau periksa Antrean Offline.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)] text-xs">
                {myReports.map((rep) => (
                  <div key={rep.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={rep.status === "VERIFIED" ? `/laporan/${rep.id}` : "/antrean"}
                        className="font-semibold text-[var(--text)] hover:underline block truncate"
                      >
                        {rep.title}
                      </Link>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Urgensi: {rep.urgency}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--surface-muted)] text-[var(--text)] shrink-0">
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel 2: Verifikator SLA / Koordinator Kebutuhan Prioritas / Admin Audit */}
          {(role === "VERIFIKATOR" || role === "ADMIN") && (
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="bg-[var(--bg)] px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--text)]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--status-pending)]" aria-hidden="true" />
                  <span>Antrean Verifikasi &amp; Umur SLA ({pendingSlaQueue.length})</span>
                </span>
                <Link href="/verifikasi" className="text-[var(--forest-700)] hover:underline">
                  Buka Pemeriksaan &rarr;
                </Link>
              </div>
              {pendingSlaQueue.length === 0 ? (
                <div className="p-4 text-xs text-[var(--text-muted)]">
                  Tidak ada laporan PENDING saat ini.
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)] text-xs">
                  {pendingSlaQueue.map((item) => (
                    <div key={item.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <strong className="text-[var(--text)] block truncate">{item.title}</strong>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {item.regionName} &bull; {item.urgency}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--color-warning-bg)] text-[var(--status-pending)] tabular-numbers shrink-0">
                        {item.ageHours} jam
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-4 py-2 bg-[var(--bg)] border-t border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                Alasan tertulis wajib dicatat setiap kali menyetujui atau menolak laporan.
              </div>
            </div>
          )}

          {/* Panel Kebutuhan Prioritas (Untuk Koordinator / Semua Peran Operasional) */}
          <div className="border border-[var(--border)] rounded-lg overflow-hidden lg:col-span-2">
            <div className="bg-[var(--bg)] px-4 py-2.5 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[var(--text)]">
              <span className="inline-flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[var(--forest-700)]" aria-hidden="true" />
                <span>Prioritas Kebutuhan &amp; Alokasi Wilayah</span>
              </span>
              <div className="flex items-center gap-3">
                <Link href="/kebutuhan" className="text-[var(--forest-700)] hover:underline inline-flex items-center gap-1">
                  <span>Pantau Kebutuhan</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                {(role === "VERIFIKATOR" || role === "ADMIN") && (
                  <Link href="/distribusi" className="text-[var(--status-info)] hover:underline inline-flex items-center gap-1">
                    <span>Catat Distribusi</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface)]">
                    <th scope="col" className="py-2 px-4">Wilayah</th>
                    <th scope="col" className="py-2 px-4">Urgensi</th>
                    <th scope="col" className="py-2 px-4">Status Kekurangan</th>
                    <th scope="col" className="py-2 px-4 text-right">Kebutuhan Teratas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {regionPriorities.slice(0, 3).map((reg) => {
                    const topCat = reg.topItemCategories[0];
                    return (
                      <tr key={reg.regionId} className="hover:bg-[var(--surface-muted)]/40">
                        <td className="py-2 px-4 font-semibold text-[var(--text)]">
                          {reg.regionName}, {reg.province}
                        </td>
                        <td className="py-2 px-4">{reg.highestUrgency}</td>
                        <td className="py-2 px-4 font-semibold text-[var(--status-attention)]">
                          {reg.highestDeficitStatus}
                        </td>
                        <td className="py-2 px-4 text-right tabular-numbers">
                          {topCat
                            ? `${topCat.itemCategory}: kurang ${topCat.deficit} ${topCat.unit}`
                            : "Pemantauan"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel Ringkasan Audit Khusus ADMIN */}
          {role === "ADMIN" && adminAuditSummary && (
            <div className="border border-[var(--border)] rounded-lg overflow-hidden lg:col-span-2">
              <div className="bg-[var(--bg)] px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--text)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-700" aria-hidden="true" />
                  <span>
                    Ringkasan Audit &amp; Tata Kelola ({adminAuditSummary.totalUsers} Pengguna &bull;{" "}
                    {adminAuditSummary.totalVerifiedOrgs} Lembaga Terverifikasi)
                  </span>
                </span>
                <Link href="/admin" className="text-purple-800 hover:underline">
                  Kelola Pengguna &amp; Audit &rarr;
                </Link>
              </div>
              <div className="divide-y divide-[var(--border)] text-xs">
                {adminAuditSummary.recentActions.map((act) => (
                  <div key={act.id} className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <strong className="text-[var(--text)]">{act.actorName}</strong> &rarr;{" "}
                      <span className="font-semibold text-[var(--forest-700)]">{act.decision}</span>{" "}
                      pada <span className="italic">{act.reportTitle}</span>
                      {act.note && <span className="block text-[11px] text-[var(--text-muted)]">Alasan: &ldquo;{act.note}&rdquo;</span>}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] tabular-numbers shrink-0">
                      {new Date(act.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

