"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  X,
  ArrowLeft,
  RefreshCw,
  Search,
} from "lucide-react";
import type { QueueReportItem, VerifierOrgInfo } from "@/lib/verification-queries";
import type { SessionData } from "@/lib/session-options";
import { reviewReportAction, reviewAidAction } from "@/app/actions/verification-actions";

interface VerificationQueueViewProps {
  initialQueue: QueueReportItem[];
  currentUser: SessionData;
  verifierOrgInfo: VerifierOrgInfo;
}

export function VerificationQueueView({
  initialQueue,
  currentUser,
  verifierOrgInfo,
}: VerificationQueueViewProps) {
  const [queue, setQueue] = useState<QueueReportItem[]>(initialQueue);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    initialQueue.length > 0 ? initialQueue[0].id : null
  );
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "NEEDS_REVISION">("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState<"ALL" | "DARURAT" | "MENDESAK" | "TERENCANA">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile view state: 'list' | 'detail'
  const [mobilePane, setMobilePane] = useState<"list" | "detail">("list");

  // Report Action Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"APPROVE" | "REJECT_REVISION" | "REJECT_FINAL">("APPROVE");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Aid Action Modal State
  const [aidModalOpen, setAidModalOpen] = useState(false);
  const [targetAid, setTargetAid] = useState<{ id: string; type: "CONFIRM" | "REJECT"; itemCategory: string; unit: string; qty: number } | null>(null);
  const [aidNote, setAidNote] = useState("");

  const [isPending, startTransition] = useTransition();

  // Filtered queue items
  const filteredQueue = queue.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (urgencyFilter !== "ALL" && r.urgency !== urgencyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchRegion = r.region.name.toLowerCase().includes(q);
      const matchReporter = r.reporter.name.toLowerCase().includes(q);
      if (!matchTitle && !matchRegion && !matchReporter) return false;
    }
    return true;
  });

  const selectedReport = queue.find((r) => r.id === selectedReportId) || null;

  // Cek apakah verifikator saat ini adalah pelapor laporan terpilih
  const isSelfReporter = selectedReport ? selectedReport.reporter.id === currentUser.userId : false;

  // Cek apakah verifikator saat ini sudah pernah menyetujui laporan terpilih
  const hasAlreadyApproved = selectedReport
    ? selectedReport.verifications.some(
        (v) => v.userId === currentUser.userId && v.decision === "APPROVE"
      )
    : false;

  const handleOpenActionModal = (type: "APPROVE" | "REJECT_REVISION" | "REJECT_FINAL") => {
    setModalType(type);
    setNote("");
    setModalOpen(true);
  };

  const handleExecuteReportAction = () => {
    if (!selectedReport) return;

    if ((modalType === "REJECT_REVISION" || modalType === "REJECT_FINAL") && note.trim().length < 10) {
      setFeedback({
        type: "error",
        message: "Catatan alasan wajib diisi minimal 10 karakter.",
      });
      return;
    }

    startTransition(async () => {
      const decision = modalType === "APPROVE" ? "APPROVE" : "REJECT";
      const res = await reviewReportAction({
        reportId: selectedReport.id,
        decision,
        note: note.trim() || undefined,
      });

      if (!res.ok) {
        setFeedback({
          type: "error",
          message: res.message || "Gagal memproses verifikasi.",
        });
        return;
      }

      const transition = res.data.result;

      setFeedback({
        type: "success",
        message: res.data.message || "Tindakan verifikasi berhasil dicatat.",
      });
      setModalOpen(false);

      // Perbarui antrean lokal
      const nextStatus = transition.nextStatus;
      if (nextStatus === "VERIFIED" || nextStatus === "REJECTED_FINAL") {
        // Hapus dari antrean aktif karena sudah tuntas
        const updatedQueue = queue.filter((item) => item.id !== selectedReport.id);
        setQueue(updatedQueue);
        if (updatedQueue.length > 0) {
          setSelectedReportId(updatedQueue[0].id);
        } else {
          setSelectedReportId(null);
        }
      } else {
        // Perbarui status dan riwayat verifikasi
        const updatedQueue = queue.map((item) => {
          if (item.id === selectedReport.id) {
            return {
              ...item,
              status: transition.nextStatus,
              verificationLevel: transition.verificationLevel,
              verificationCount: transition.verificationCount,
              revisionCount:
                decision === "REJECT" && transition.nextStatus === "NEEDS_REVISION"
                  ? item.revisionCount + 1
                  : item.revisionCount,
              verifications: [
                {
                  id: `v-new-${Date.now()}`,
                  userId: currentUser.userId || "verifier",
                  verifierName: currentUser.name || "Verifikator",
                  decision: decision as "APPROVE" | "REJECT",
                  note: note.trim() || null,
                  createdAt: new Date(),
                },
                ...item.verifications,
              ],
            };
          }
          return item;
        });
        setQueue(updatedQueue);
      }
    });
  };

  const handleOpenAidModal = (
    aid: { id: string; itemCategory: string; unit: string; qty: number },
    type: "CONFIRM" | "REJECT"
  ) => {
    setTargetAid({ id: aid.id, type, itemCategory: aid.itemCategory, unit: aid.unit, qty: aid.qty });
    setAidNote("");
    setAidModalOpen(true);
  };

  const handleExecuteAidAction = () => {
    if (!targetAid || !selectedReport) return;

    if (targetAid.type === "REJECT" && aidNote.trim().length < 10) {
      setFeedback({
        type: "error",
        message: "Catatan penolakan bantuan wajib diisi minimal 10 karakter.",
      });
      return;
    }

    startTransition(async () => {
      const res = await reviewAidAction({
        aidId: targetAid.id,
        decision: targetAid.type,
        note: aidNote.trim() || undefined,
      });

      if (!res.ok) {
        setFeedback({
          type: "error",
          message: res.message || "Gagal memproses tinjauan bantuan.",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: res.data.message || "Catatan bantuan berhasil diperbarui.",
      });
      setAidModalOpen(false);

      // Hapus bantuan yang selesai ditinjau dari daftar pending report
      const updatedQueue = queue.map((item) => {
        if (item.id === selectedReport.id) {
          return {
            ...item,
            pendingAids: item.pendingAids.filter((a) => a.id !== targetAid.id),
          };
        }
        return item;
      });
      setQueue(updatedQueue);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] flex flex-col">
      {/* Sub-header status bar */}
      <section
        aria-label="Informasi Peran Verifikator"
        className="bg-white border-b border-[var(--color-border-subtle)] px-4 py-3 sm:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[var(--color-text-main)]">
                  Antrean Verifikasi Laporan Faktual
                </h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border border-[var(--color-forest-border)]">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {verifierOrgInfo.isFromVerifiedOrg ? (
                  <span className="text-[var(--color-forest-main)] font-medium">
                    ✓ Terdaftar di {verifierOrgInfo.orgName} (Verifikasi Tingkat Lembaga Resmi)
                  </span>
                ) : (
                  <span>Verifikator Komunitas Independen (Verifikasi Tingkat Komunitas 2/2)</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brick-main)]"></span>
              <span>Darurat: {queue.filter((r) => r.urgency === "DARURAT").length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber-main)]"></span>
              <span>Mendesak: {queue.filter((r) => r.urgency === "MENDESAK").length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-slate-muted)]"></span>
              <span>Total Antrean: {queue.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Toast Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`px-4 py-2.5 text-xs font-medium border-b flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border-[var(--color-forest-border)]"
              : "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border-[var(--color-brick-border)]"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] p-1"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area (Split View: HOT Tasking Manager style) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {queue.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-[var(--color-border-subtle)]">
            <div className="w-14 h-14 rounded-full bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-1">
              Seluruh Laporan Telah Tuntas Diverifikasi
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] max-w-md mb-6">
              Tidak ada laporan baru atau permintaan revisi yang menunggu tinjauan verifikator saat ini. Terima kasih atas dedikasi Anda mengawal transparansi data.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors"
            >
              Kembali ke Peta Operasional
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 items-start">
            {/* Left Column: Queue List (Width 5 cols on md, 4 cols on lg) */}
            <div
              className={`md:col-span-5 lg:col-span-4 bg-white rounded-lg border border-[var(--color-border-subtle)] shadow-sm flex flex-col overflow-hidden ${
                mobilePane === "detail" ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Filter & Search Bar */}
              <div className="p-3 border-b border-[var(--color-border-subtle)] space-y-2 bg-[var(--color-bg-base)]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari wilayah, judul, pelapor..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[var(--color-border-subtle)] rounded focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                      statusFilter === "ALL"
                        ? "bg-[var(--color-forest-main)] text-white"
                        : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
                    }`}
                  >
                    Semua ({queue.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                      statusFilter === "PENDING"
                        ? "bg-[var(--color-forest-main)] text-white"
                        : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
                    }`}
                  >
                    Baru ({queue.filter((r) => r.status === "PENDING").length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("NEEDS_REVISION")}
                    className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                      statusFilter === "NEEDS_REVISION"
                        ? "bg-[var(--color-amber-main)] text-white"
                        : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
                    }`}
                  >
                    Revisi ({queue.filter((r) => r.status === "NEEDS_REVISION").length})
                  </button>
                </div>

                {/* Filter Tingkat Urgensi */}
                <div className="flex gap-1 overflow-x-auto pb-0.5 text-[11px] pt-1 border-t border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] font-semibold self-center mr-1">
                    Urgensi:
                  </span>
                  {(["ALL", "DARURAT", "MENDESAK", "TERENCANA"] as const).map((urg) => (
                    <button
                      key={urg}
                      onClick={() => setUrgencyFilter(urg)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        urgencyFilter === urg
                          ? urg === "DARURAT"
                            ? "bg-[var(--color-brick-main)] text-white"
                            : urg === "MENDESAK"
                            ? "bg-[var(--color-amber-main)] text-white"
                            : "bg-slate-700 text-white"
                          : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-50"
                      }`}
                    >
                      {urg === "ALL" ? "Semua" : urg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Queue List Scrollable Container */}
              <div className="divide-y divide-[var(--color-border-subtle)] max-h-[calc(100vh-280px)] overflow-y-auto">
                {filteredQueue.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--color-text-muted)]">
                    Tidak ada laporan yang cocok dengan filter aktif.
                  </div>
                ) : (
                  filteredQueue.map((item) => {
                    const isSelected = item.id === selectedReportId;
                    const isUrgent = item.urgency === "DARURAT";
                    const isRevision = item.status === "NEEDS_REVISION";

                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelectedReportId(item.id);
                          setMobilePane("detail");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedReportId(item.id);
                            setMobilePane("detail");
                          }
                        }}
                        className={`p-3.5 text-left transition-colors relative cursor-pointer ${
                          isSelected
                            ? "bg-[var(--color-forest-bg)]/40 border-l-4 border-l-[var(--color-forest-main)]"
                            : "hover:bg-slate-50 border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                                isUrgent
                                  ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border border-[var(--color-brick-border)]"
                                  : item.urgency === "MENDESAK"
                                  ? "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)] border border-[var(--color-amber-border)]"
                                  : "bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200"
                              }`}
                            >
                              {item.urgency}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200">
                              {item.category}
                            </span>
                            {isRevision && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-amber-bg)] text-[var(--color-amber-main)] border border-[var(--color-amber-border)]">
                                Revisi #{item.revisionCount}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-[var(--color-text-main)] line-clamp-2 mb-1">
                          {item.title}
                        </h3>

                        <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mt-2">
                          <span className="flex items-center gap-1 truncate max-w-[150px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {item.region.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold px-1 rounded bg-slate-100 text-slate-700">
                              Skor: {item.trustScore}/100
                            </span>
                            {item.verificationCount > 0 && (
                              <span className="text-[10px] font-semibold px-1 rounded bg-[var(--color-forest-bg)] text-[var(--color-forest-main)]">
                                {item.verificationCount}/2
                              </span>
                            )}
                          </div>
                        </div>

                        {item.pendingAids.length > 0 && (
                          <div className="mt-2 text-[10px] text-[var(--color-amber-main)] font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {item.pendingAids.length} catatan bantuan menunggu konfirmasi
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Detailed Review & Inspection Sheet */}
            <div
              className={`md:col-span-7 lg:col-span-8 bg-white rounded-lg border border-[var(--color-border-subtle)] shadow-sm flex flex-col overflow-hidden ${
                mobilePane === "list" ? "hidden md:flex" : "flex"
              }`}
            >
              {selectedReport ? (
                <div>
                  {/* Top Mobile Bar with Back button */}
                  <div className="md:hidden p-3 bg-[var(--color-bg-base)] border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                    <button
                      onClick={() => setMobilePane("list")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-forest-main)]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Kembali ke Daftar Antrean
                    </button>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Laporan #{selectedReport.id.slice(-6)}
                    </span>
                  </div>

                  {/* Header Inspection Area */}
                  <div className="p-5 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/50">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase ${
                            selectedReport.urgency === "DARURAT"
                              ? "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border border-[var(--color-brick-border)]"
                              : selectedReport.urgency === "MENDESAK"
                              ? "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)] border border-[var(--color-amber-border)]"
                              : "bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200"
                          }`}
                        >
                          {selectedReport.urgency}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200">
                          {selectedReport.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-[var(--color-slate-muted)] border border-slate-200">
                          {selectedReport.type === "KEBUTUHAN" ? "Kebutuhan Logistik" : "Pemantauan Lingkungan"}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Diajukan: {new Date(selectedReport.createdAt).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-2">
                      {selectedReport.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-forest-main)]" />
                        <span>{selectedReport.region.name}, {selectedReport.region.province}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[var(--color-forest-main)]" />
                        <span>Pelapor: <strong className="text-[var(--color-text-main)]">{selectedReport.reporter.name}</strong></span>
                        {selectedReport.reporter.isVerifiedVolunteer ? (
                          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] font-semibold">
                            Relawan Terpercaya
                          </span>
                        ) : (
                          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                            Relawan Baru
                          </span>
                        )}
                      </div>
                      {selectedReport.reporter.phone && (
                        <div className="text-[11px] font-mono text-[var(--color-text-muted)]">
                          Tel: {selectedReport.reporter.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Inspection Section */}
                  <div className="p-5 space-y-6">
                    {/* Trust Score & Evidence Factors */}
                    <div className="p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[var(--color-forest-main)]" />
                          <h3 className="text-xs font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                            Skor Kepercayaan Deterministik
                          </h3>
                        </div>
                        <span className="text-sm font-extrabold text-[var(--color-forest-main)]">
                          {selectedReport.trustScore} / 100
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-[var(--color-forest-main)] transition-all"
                          style={{ width: `${selectedReport.trustScore}%` }}
                        ></div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                          Faktor Pembentuk Skor:
                        </span>
                        {selectedReport.trustScoreReasons.length > 0 ? (
                          <ul className="text-xs space-y-0.5 text-[var(--color-text-main)]">
                            {selectedReport.trustScoreReasons.map((reason, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="text-[var(--color-forest-main)]">✓</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[var(--color-text-muted)] italic">
                            Belum ada riwayat pembobotan skor tambahan.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 5W + 1H Structured Narrative Cards */}
                    <div>
                      <h3 className="text-xs font-bold text-[var(--color-text-main)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--color-forest-main)]" />
                        Pemeriksaan Kerangka Faktual 5W+1H
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded border border-[var(--color-border-subtle)] bg-white">
                          <div className="font-bold text-[var(--color-forest-main)] mb-1">
                            1. What (Apa Kejadiannya?)
                          </div>
                          <p className="text-[var(--color-text-main)] leading-relaxed">{selectedReport.what}</p>
                        </div>

                        <div className="p-3 rounded border border-[var(--color-border-subtle)] bg-white">
                          <div className="font-bold text-[var(--color-forest-main)] mb-1">
                            2. Who (Siapa Terdampak?)
                          </div>
                          <p className="text-[var(--color-text-main)] leading-relaxed">{selectedReport.who}</p>
                        </div>

                        <div className="p-3 rounded border border-[var(--color-border-subtle)] bg-white">
                          <div className="font-bold text-[var(--color-forest-main)] mb-1">
                            3. Where (Patokan Lokasi & Jalur Aman)
                          </div>
                          <p className="text-[var(--color-text-main)] leading-relaxed">{selectedReport.whereDescription}</p>
                        </div>

                        <div className="p-3 rounded border border-[var(--color-border-subtle)] bg-white">
                          <div className="font-bold text-[var(--color-forest-main)] mb-1">
                            4. When (Kapan Terjadi?)
                          </div>
                          <p className="text-[var(--color-text-main)] leading-relaxed">
                            {new Date(selectedReport.when).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>

                        <div className="p-3 rounded border border-[var(--color-border-subtle)] bg-white">
                          <div className="font-bold text-[var(--color-forest-main)] mb-1">
                            5. Why (Latar Belakang / Urgensi)
                          </div>
                          <p className="text-[var(--color-text-main)] leading-relaxed">{selectedReport.why}</p>
                        </div>

                        <div className="p-3 rounded border border-[var(--color-border-subtle)] bg-white">
                          <div className="font-bold text-[var(--color-forest-main)] mb-1">
                            6. How (Metode Akses & Penyaluran)
                          </div>
                          <p className="text-[var(--color-text-main)] leading-relaxed">{selectedReport.how}</p>
                        </div>
                      </div>
                    </div>

                    {/* Needs Items (Only for KEBUTUHAN) */}
                    {selectedReport.type === "KEBUTUHAN" && (
                      <div>
                        <h3 className="text-xs font-bold text-[var(--color-text-main)] uppercase tracking-wider mb-2">
                          Daftar Kebutuhan yang Diajukan ({selectedReport.needs.length} Item)
                        </h3>

                        <div className="overflow-x-auto border border-[var(--color-border-subtle)] rounded-md">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
                              <tr>
                                <th className="p-2.5 font-semibold">Kategori Logistik</th>
                                <th className="p-2.5 font-semibold">Jenis</th>
                                <th className="p-2.5 font-semibold">Satuan</th>
                                <th className="p-2.5 font-semibold text-right">Kuantitas</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border-subtle)]">
                              {selectedReport.needs.map((n) => (
                                <tr key={n.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-medium text-[var(--color-text-main)]">
                                    {n.itemCategory}
                                  </td>
                                  <td className="p-2.5 text-[var(--color-text-muted)]">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100">
                                      {n.kind}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-[var(--color-text-muted)]">{n.unit}</td>
                                  <td className="p-2.5 text-right font-mono font-bold text-[var(--color-text-main)]">
                                    {n.qty.toLocaleString("id-ID")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Pending Aids (If any) */}
                    {selectedReport.pendingAids.length > 0 && (
                      <div className="p-4 rounded-lg border border-[var(--color-amber-border)] bg-[var(--color-amber-bg)]/20">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-[var(--color-amber-main)]" />
                          <h3 className="text-xs font-bold text-[var(--color-text-main)]">
                            Catatan Bantuan Relawan Menunggu Konfirmasi ({selectedReport.pendingAids.length})
                          </h3>
                        </div>

                        <div className="space-y-2">
                          {selectedReport.pendingAids.map((aid) => (
                            <div
                              key={aid.id}
                              className="p-3 bg-white rounded border border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs"
                            >
                              <div>
                                <div className="font-bold text-[var(--color-text-main)]">
                                  {aid.qty.toLocaleString("id-ID")} {aid.unit} {aid.itemCategory}
                                </div>
                                <div className="text-[11px] text-[var(--color-text-muted)]">
                                  Dicatat oleh: {aid.userName} {aid.userIsVerified && "(Terpercaya)"} •{" "}
                                  {new Date(aid.createdAt).toLocaleString("id-ID")}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenAidModal(aid, "CONFIRM")}
                                  disabled={isPending}
                                  className="px-2.5 py-1 rounded bg-[var(--color-forest-main)] text-white text-xs font-semibold hover:bg-[var(--color-forest-dark)] transition-colors"
                                >
                                  Konfirmasi
                                </button>
                                <button
                                  onClick={() => handleOpenAidModal(aid, "REJECT")}
                                  disabled={isPending}
                                  className="px-2.5 py-1 rounded bg-white border border-[var(--color-brick-border)] text-[var(--color-brick-main)] text-xs font-semibold hover:bg-[var(--color-brick-bg)] transition-colors"
                                >
                                  Tolak
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Previous Verifications History */}
                    {selectedReport.verifications.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-[var(--color-text-main)] uppercase tracking-wider mb-2">
                          Riwayat Catatan Verifikasi Sebelumnya
                        </h3>
                        <div className="space-y-2">
                          {selectedReport.verifications.map((v) => (
                            <div
                              key={v.id}
                              className={`p-3 rounded text-xs border ${
                                v.decision === "APPROVE"
                                  ? "bg-[var(--color-forest-bg)]/20 border-[var(--color-forest-border)]"
                                  : "bg-[var(--color-amber-bg)]/20 border-[var(--color-amber-border)]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-[var(--color-text-main)]">
                                  {v.verifierName} ({v.decision === "APPROVE" ? "Persetujuan" : "Permintaan Revisi / Tolak"})
                                </span>
                                <span className="text-[11px] text-[var(--color-text-muted)]">
                                  {new Date(v.createdAt).toLocaleString("id-ID")}
                                </span>
                              </div>
                              {v.note && (
                                <p className="text-[var(--color-text-main)] italic">&ldquo;{v.note}&rdquo;</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sticky Action Footer */}
                  <div className="p-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3">
                    {isSelfReporter ? (
                      <div className="flex items-center gap-2 text-xs text-[var(--color-brick-main)] font-semibold p-2 rounded bg-[var(--color-brick-bg)] border border-[var(--color-brick-border)] w-full">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>
                          Aturan Integritas: Anda adalah pelapor laporan ini. Sesuai regulasi sistem, verifikator dilarang memverifikasi laporannya sendiri.
                        </span>
                      </div>
                    ) : hasAlreadyApproved ? (
                      <div className="flex items-center gap-2 text-xs text-[var(--color-forest-main)] font-semibold p-2 rounded bg-[var(--color-forest-bg)] border border-[var(--color-forest-border)] w-full">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>
                          Anda telah memberikan persetujuan untuk laporan ini (1/2). Menunggu persetujuan dari verifikator komunitas kedua.
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {verifierOrgInfo.isFromVerifiedOrg ? (
                            <span>Persetujuan Anda akan langsung menerbitkan status <strong>VERIFIED (OFFICIAL)</strong>.</span>
                          ) : (
                            <span>
                              Persetujuan tingkat komunitas (saat ini {selectedReport.verificationCount}/2 verifikator).
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenActionModal("REJECT_FINAL")}
                            disabled={isPending}
                            className="px-3 py-2 rounded-md border border-[var(--color-brick-border)] bg-white text-[var(--color-brick-main)] text-xs font-bold hover:bg-[var(--color-brick-bg)] transition-colors"
                          >
                            Tolak Laporan
                          </button>
                          <button
                            onClick={() => handleOpenActionModal("REJECT_REVISION")}
                            disabled={isPending}
                            className="px-3 py-2 rounded-md border border-[var(--color-amber-border)] bg-white text-[var(--color-amber-main)] text-xs font-bold hover:bg-[var(--color-amber-bg)] transition-colors"
                          >
                            Minta Revisi 5W+1H
                          </button>
                          <button
                            onClick={() => handleOpenActionModal("APPROVE")}
                            disabled={isPending}
                            className="px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors shadow-sm"
                          >
                            Setujui Laporan
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
                  Pilih salah satu laporan dari antrean di sebelah kiri untuk memeriksa bukti faktual dan 5W+1H.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal Dialog: Report Action (Approve / Request Revision / Reject) */}
      {modalOpen && selectedReport && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-action-title"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-[var(--color-border-subtle)]">
            <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex items-center justify-between">
              <h3 id="modal-action-title" className="text-sm font-bold text-[var(--color-text-main)]">
                {modalType === "APPROVE"
                  ? "Konfirmasi Persetujuan Laporan"
                  : modalType === "REJECT_REVISION"
                  ? "Kirim Permintaan Revisi Data (5W+1H)"
                  : "Tolak Laporan Kemanusiaan Secara Permanen"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] p-1"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {modalType === "APPROVE" ? (
                <div className="text-xs text-[var(--color-text-main)] space-y-2">
                  <p>
                    Anda akan menyetujui laporan: <strong>{selectedReport.title}</strong>
                  </p>
                  {verifierOrgInfo.isFromVerifiedOrg ? (
                    <div className="p-3 rounded bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border border-[var(--color-forest-border)]">
                      Laporan ini akan langsung berstatus <strong>VERIFIED</strong> tingkat <strong>OFFICIAL ({verifierOrgInfo.orgName})</strong> dan muncul pada peta operasional publik.
                    </div>
                  ) : selectedReport.verificationCount === 0 ? (
                    <div className="p-3 rounded bg-[var(--color-info-bg)] text-[var(--color-info-text)] border border-[var(--color-info-border)]">
                      Ini adalah persetujuan pertama (1/2). Laporan akan tetap berstatus internal hingga mendapatkan 1 persetujuan verifikator komunitas lagi sebelum tampil ke publik.
                    </div>
                  ) : (
                    <div className="p-3 rounded bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border border-[var(--color-forest-border)]">
                      Ini adalah persetujuan kedua (2/2). Laporan akan langsung berstatus <strong>VERIFIED (COMMUNITY)</strong> dan tampil pada peta operasional publik.
                    </div>
                  )}

                  <div>
                    <label htmlFor="approve-note" className="block font-semibold mb-1 text-[var(--color-text-muted)]">
                      Catatan Verifikasi (Opsional):
                    </label>
                    <input
                      id="approve-note"
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Contoh: Bukti foto telah diverifikasi via telepon posko"
                      className="w-full p-2 border border-[var(--color-border-subtle)] rounded text-xs focus:outline-none focus:border-[var(--color-forest-main)]"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[var(--color-text-main)] space-y-3">
                  <p className="text-[var(--color-text-muted)]">
                    {modalType === "REJECT_REVISION"
                      ? "Pelapor akan menerima pemberitahuan dan diberi kesempatan merevisi data sesuai catatan yang Anda berikan."
                      : "Laporan akan ditolak secara permanen dan tidak dapat diajukan revisi kembali."}
                  </p>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="reject-note" className="font-semibold text-[var(--color-text-main)]">
                        Alasan Tertulis (Wajib Minimal 10 Karakter):
                      </label>
                      <span
                        className={`text-[10px] ${
                          note.trim().length >= 10
                            ? "text-[var(--color-forest-main)]"
                            : "text-[var(--color-brick-main)] font-semibold"
                        }`}
                      >
                        {note.trim().length}/10 karakter
                      </span>
                    </div>
                    <textarea
                      id="reject-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Jelaskan secara spesifik unsur 5W+1H atau bukti logistik apa yang perlu diperbaiki oleh pelapor..."
                      className="w-full p-2.5 border border-[var(--color-border-subtle)] rounded text-xs focus:outline-none focus:border-[var(--color-forest-main)]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 rounded text-xs font-semibold text-[var(--color-text-muted)] hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteReportAction}
                disabled={
                  isPending ||
                  ((modalType === "REJECT_REVISION" || modalType === "REJECT_FINAL") &&
                    note.trim().length < 10)
                }
                className={`px-4 py-2 rounded text-xs font-bold text-white transition-colors flex items-center gap-1.5 ${
                  modalType === "APPROVE"
                    ? "bg-[var(--color-forest-main)] hover:bg-[var(--color-forest-dark)]"
                    : modalType === "REJECT_REVISION"
                    ? "bg-[var(--color-amber-main)] hover:bg-[var(--color-amber-dark)]"
                    : "bg-[var(--color-brick-main)] hover:bg-[var(--color-brick-dark)]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {modalType === "APPROVE"
                    ? "Kirim Persetujuan"
                    : modalType === "REJECT_REVISION"
                    ? "Kirim Permintaan Revisi"
                    : "Tolak Permanen"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Review Aid Contribution */}
      {aidModalOpen && targetAid && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-aid-title"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-[var(--color-border-subtle)]">
            <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex items-center justify-between">
              <h3 id="modal-aid-title" className="text-sm font-bold text-[var(--color-text-main)]">
                {targetAid.type === "CONFIRM"
                  ? "Konfirmasi Penyaluran Bantuan"
                  : "Tolak Catatan Bantuan Relawan"}
              </h3>
              <button
                onClick={() => setAidModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] p-1"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-[var(--color-text-main)]">
              <p>
                Item Bantuan:{" "}
                <strong>
                  {targetAid.qty.toLocaleString("id-ID")} {targetAid.unit} ({targetAid.itemCategory})
                </strong>
              </p>

              {targetAid.type === "CONFIRM" ? (
                <div className="p-3 rounded bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border border-[var(--color-forest-border)]">
                  Konfirmasi ini akan mencatat bantuan ke status <strong>CONFIRMED</strong> dan mengurangi nilai selisih kebutuhan resmi secara real-time.
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="aid-reject-note" className="font-semibold text-[var(--color-text-main)]">
                      Alasan Penolakan Bantuan (Wajib Minimal 10 Karakter):
                    </label>
                    <span
                      className={`text-[10px] ${
                        aidNote.trim().length >= 10
                          ? "text-[var(--color-forest-main)]"
                          : "text-[var(--color-brick-main)] font-semibold"
                      }`}
                    >
                      {aidNote.trim().length}/10 karakter
                    </span>
                  </div>
                  <textarea
                    id="aid-reject-note"
                    rows={3}
                    value={aidNote}
                    onChange={(e) => setAidNote(e.target.value)}
                    placeholder="Contoh: Logistik ini belum terverifikasi sampai di posko fisik."
                    className="w-full p-2 border border-[var(--color-border-subtle)] rounded text-xs focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAidModalOpen(false)}
                className="px-3 py-2 rounded text-xs font-semibold text-[var(--color-text-muted)] hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteAidAction}
                disabled={isPending || (targetAid.type === "REJECT" && aidNote.trim().length < 10)}
                className={`px-4 py-2 rounded text-xs font-bold text-white transition-colors flex items-center gap-1.5 ${
                  targetAid.type === "CONFIRM"
                    ? "bg-[var(--color-forest-main)] hover:bg-[var(--color-forest-dark)]"
                    : "bg-[var(--color-brick-main)] hover:bg-[var(--color-brick-dark)]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{targetAid.type === "CONFIRM" ? "Konfirmasi Bantuan" : "Tolak Bantuan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

