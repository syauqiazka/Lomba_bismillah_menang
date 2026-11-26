"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Send, Clock, AlertCircle, Loader2 } from "lucide-react";
import type { OperationalNeedsData } from "@/lib/operational-queries";
import { submitAidAction } from "@/app/actions/aid-actions";
import { reviewAidAction } from "@/app/actions/verification-actions";
import { generateClientId } from "@/lib/uuid";

interface DistributionViewProps {
  data: OperationalNeedsData;
}

export function DistributionView({ data }: DistributionViewProps) {
  const router = useRouter();
  const { needsReports, pendingAids, isDemoMode } = data;

  const firstReport = needsReports[0];
  const firstDeficit = firstReport?.itemDeficits[0];

  const [reportId, setReportId] = useState(firstReport?.id || "");
  const [itemKey, setItemKey] = useState(
    firstDeficit ? `${firstDeficit.itemCategory}:::${firstDeficit.unit}` : ""
  );
  const [qty, setQty] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [processingAidId, setProcessingAidId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  const selectedReport = needsReports.find((r) => r.id === reportId) || firstReport;

  function handleReportChange(newId: string) {
    setReportId(newId);
    const nextRep = needsReports.find((r) => r.id === newId);
    const nextDef = nextRep?.itemDeficits[0];
    setItemKey(nextDef ? `${nextDef.itemCategory}:::${nextDef.unit}` : "");
  }

  async function handleAllocate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReport || !itemKey || qty <= 0) return;
    const [itemCategory, unit] = itemKey.split(":::");

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await submitAidAction({
        reportId: selectedReport.id,
        itemCategory,
        unit,
        qty: Number(qty),
        clientId: generateClientId(),
      });

      if (!res.ok) {
        setFeedback({ type: "error", text: res.message });
      } else {
        setFeedback({ type: "success", text: res.data.message });
        router.refresh();
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal mencatat alokasi bantuan ke server." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReviewAid(aidId: string, decision: "CONFIRM" | "REJECT") {
    const note = rejectNotes[aidId]?.trim() || "Dikonfirmasi oleh petugas posko";
    if (decision === "REJECT" && note.length < 10) {
      setFeedback({
        type: "error",
        text: "Penolakan bantuan wajib menyertakan alasan tertulis minimal 10 karakter.",
      });
      return;
    }

    setProcessingAidId(aidId);
    setFeedback(null);
    try {
      const res = await reviewAidAction({ aidId, decision, note });
      if (!res.ok) {
        setFeedback({ type: "error", text: res.message });
      } else {
        setFeedback({ type: "success", text: res.data.message });
        router.refresh();
      }
    } catch {
      setFeedback({ type: "error", text: "Gagal memperbarui status bantuan." });
    } finally {
      setProcessingAidId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <header className="border-b border-[var(--border)] pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-info-bg)] text-[var(--status-info)]">
            KOORDINATOR / VERIFIKATOR / ADMIN
          </span>
          {isDemoMode && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--status-demo)] text-white">
              DEMO
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
          Pencatatan Alokasi &amp; Konfirmasi Distribusi Bantuan
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Catat alokasi bantuan fisik atau konfirmasi penerimaan di posko. Hanya bantuan CONFIRMED yang mengurangi kekurangan.
        </p>
      </header>

      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-[var(--color-success-bg)] text-[var(--status-verified)] border-[var(--forest-500)]/30"
              : "bg-[var(--color-danger-bg)] text-[var(--status-attention)] border-[var(--status-attention)]/30"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Pencatatan Alokasi (5 Kolom) */}
        <section
          aria-label="Formulir Catat Alokasi Bantuan"
          className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 space-y-4 h-fit"
        >
          <h2 className="text-sm font-bold text-[var(--text)]">
            Catat Alokasi Bantuan Fisik Baru
          </h2>

          <form onSubmit={handleAllocate} className="space-y-3 text-xs">
            <div>
              <label htmlFor="dist-report" className="block font-semibold text-[var(--text)] mb-1">
                Laporan Kebutuhan Sasaran
              </label>
              <select
                id="dist-report"
                value={reportId}
                onChange={(e) => handleReportChange(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
              >
                {needsReports.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.region.name} — {rep.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dist-item" className="block font-semibold text-[var(--text)] mb-1">
                Kategori &amp; Satuan Kebutuhan
              </label>
              <select
                id="dist-item"
                value={itemKey}
                onChange={(e) => setItemKey(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
              >
                {selectedReport?.itemDeficits.map((d) => (
                  <option key={`${d.itemCategory}:::${d.unit}`} value={`${d.itemCategory}:::${d.unit}`}>
                    {d.itemCategory} ({d.unit}) — Sisa kurang: {d.deficit} {d.unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dist-qty" className="block font-semibold text-[var(--text)] mb-1">
                Jumlah Bantuan Fisik
              </label>
              <input
                id="dist-qty"
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold tabular-numbers"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedReport || !itemKey}
              className="w-full min-h-[44px] px-4 py-2 rounded-lg bg-[var(--forest-700)] hover:bg-[var(--forest-900)] text-white font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Catat Alokasi Bantuan</span>
            </button>
          </form>
        </section>

        {/* Daftar Konfirmasi Penerimaan Bantuan PENDING (7 Kolom) */}
        <section
          aria-label="Antrean Konfirmasi Penerimaan Bantuan"
          className="lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="px-5 py-3.5 bg-[var(--bg)] border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text)] inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--status-pending)]" aria-hidden="true" />
              <span>Bantuan PENDING — Menunggu Konfirmasi ({pendingAids.length})</span>
            </h2>
          </div>

          {pendingAids.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--text-muted)]">
              Seluruh catatan bantuan telah dikonfirmasi. Tidak ada antrean PENDING.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {pendingAids.map((aid) => (
                <div key={aid.id} className="p-4 sm:p-5 space-y-3 text-xs">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-warning-bg)] text-[var(--status-pending)]">
                        PENDING (Belum Mengurangi Kekurangan)
                      </span>
                      <h3 className="text-sm font-bold text-[var(--text)] mt-1">
                        {aid.qty} {aid.unit} — {aid.itemCategory}
                      </h3>
                      <p className="text-[var(--text-muted)]">
                        Laporan: {aid.reportTitle} &bull; Pencatat: {aid.userName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Catatan konfirmasi atau alasan penolakan (min. 10 karakter jika tolak)..."
                      value={rejectNotes[aid.id] || ""}
                      onChange={(e) =>
                        setRejectNotes((prev) => ({ ...prev, [aid.id]: e.target.value }))
                      }
                      className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    />
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={processingAidId === aid.id}
                        onClick={() => handleReviewAid(aid.id, "CONFIRM")}
                        className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[var(--forest-700)] hover:bg-[var(--forest-900)] text-white font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Konfirmasi Penerimaan</span>
                      </button>
                      <button
                        type="button"
                        disabled={processingAidId === aid.id}
                        onClick={() => handleReviewAid(aid.id, "REJECT")}
                        className="min-h-[40px] px-3 py-1.5 rounded-lg bg-[var(--color-danger-bg)] text-[var(--status-attention)] border border-[var(--status-attention)]/30 font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
