"use client";

import { useState } from "react";
import { X, HeartHandshake, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { ItemDeficitResult } from "@/lib/calculations";
import { submitAidAction } from "@/app/actions/aid-actions";
import { generateClientId } from "@/lib/uuid";

interface RecordAidModalProps {
  reportId: string;
  itemDeficits: ItemDeficitResult[];
  isOpen: boolean;
  onClose: () => void;
  isTrustedVolunteer?: boolean;
}

export function RecordAidModal({
  reportId,
  itemDeficits,
  isOpen,
  onClose,
  isTrustedVolunteer = false,
}: RecordAidModalProps) {
  // Hanya tampilkan item yang masih memiliki sisa kebutuhan (deficit > 0)
  const availableItems = itemDeficits.filter((item) => item.deficit > 0);

  const [selectedKey, setSelectedKey] = useState<string>(
    availableItems[0] ? `${availableItems[0].itemCategory}:::${availableItems[0].unit}` : ""
  );
  const [qty, setQty] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedItem = availableItems.find(
    (item) => `${item.itemCategory}:::${item.unit}` === selectedKey
  );

  const maxAllowed = selectedItem ? selectedItem.deficit : 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedItem) {
      setErrorMessage("Silakan pilih item kebutuhan logistik.");
      return;
    }

    if (qty <= 0) {
      setErrorMessage("Kuantitas bantuan harus minimal 1.");
      return;
    }

    if (qty > maxAllowed) {
      setErrorMessage(
        `Kuantitas tidak boleh melebihi sisa kekurangan (${maxAllowed} ${selectedItem.unit}).`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const clientId = generateClientId();

      const res = await submitAidAction({
        reportId,
        itemCategory: selectedItem.itemCategory,
        unit: selectedItem.unit,
        qty,
        clientId,
      });

      if (!res.ok) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1800);
      }
    } catch {
      setErrorMessage("Terjadi galat koneksi saat mengirim data. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catat Penyaluran Bantuan Relawan"
      className="fixed inset-0 z-[1300] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        className="w-full max-w-md bg-white border border-[var(--color-border)] rounded-2xl sm:rounded-xl shadow-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {/* Header Modal */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-success-bg)] text-[var(--color-success-text)] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">
                Catat Penyaluran Bantuan
              </h2>
              <span className="text-[11px] text-[var(--color-text-muted)] block">
                Alokasi transparan berbasis sisa kuota riil
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
            aria-label="Tutup formulir bantuan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        {availableItems.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[var(--color-primary)] mx-auto" />
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              Kebutuhan Tercatat Sudah Terpenuhi
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Seluruh item kebutuhan logistik pada laporan ini telah mencapai alokasi 100%. Terima kasih kepada seluruh relawan!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 px-4 py-2 rounded-lg bg-[var(--color-secondary)] text-white text-xs font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Status Relawan Badge Notice */}
            <div className="p-2.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[11px]">
              {isTrustedVolunteer ? (
                <span className="text-[var(--color-success-text)] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Akun Anda terverifikasi (Bantuan langsung berstatus CONFIRMED).
                </span>
              ) : (
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  Relawan baru: Bantuan akan ditinjau verifikator sebelum mengurangi sisa selisih.
                </span>
              )}
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-[var(--color-danger-bg)] border border-red-200 text-xs text-[var(--color-danger-text)] font-semibold flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-lg bg-[var(--color-success-bg)] border border-emerald-200 text-xs text-[var(--color-success-text)] font-semibold flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Pemilihan Item Kebutuhan */}
            <div>
              <label htmlFor="need-select" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Pilih Item Kebutuhan yang Disalurkan
              </label>
              <select
                id="need-select"
                value={selectedKey}
                onChange={(e) => {
                  setSelectedKey(e.target.value);
                  setQty(1);
                }}
                className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                {availableItems.map((item) => (
                  <option
                    key={`${item.itemCategory}:::${item.unit}`}
                    value={`${item.itemCategory}:::${item.unit}`}
                  >
                    {item.itemCategory} &bull; Sisa kekurangan: {item.deficit} {item.unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Kuantitas */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="aid-qty" className="text-xs font-bold text-[var(--color-text)]">
                  Jumlah Bantuan yang Disalurkan
                </label>
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                  Maksimal: {maxAllowed} {selectedItem?.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="aid-qty"
                  type="number"
                  min={1}
                  max={maxAllowed}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full text-sm bg-white border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-bold tabular-numbers focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                />
                <span className="text-xs font-bold text-[var(--color-text-secondary)] whitespace-nowrap px-3 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                  {selectedItem?.unit}
                </span>
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)] block mt-1">
                Proteksi alokasi: Sistem menolak pencatatan jika kuantitas melebihi sisa kekurangan riil.
              </span>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-3.5 py-2 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !!successMessage}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Simpan Penyaluran Bantuan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
