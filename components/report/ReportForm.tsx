"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Send,
  Loader2,
  Info,
  Sparkles,
  Camera,
  UploadCloud,
  ShieldCheck,
  X,
  Check,
} from "lucide-react";
import type { RegionOption } from "@/lib/fallback-data";
import { createReportAction } from "@/app/actions/report-actions";
import { generateClientId } from "@/lib/uuid";
import { enqueueOfflineDraft } from "@/lib/offline-queue";
import { compressAndSanitizeImage, type CompressionResult } from "@/lib/image-compression";
import { extract5W1HFromNotesAction, type AIExtractionResult } from "@/app/actions/ai-actions";

type ReportCategoryEnum = "BENCANA" | "LINGKUNGAN" | "LANSIA" | "KESEHATAN" | "PENDIDIKAN" | "SOSIAL_LAINNYA";
type UrgencyLevelEnum = "DARURAT" | "MENDESAK" | "TERENCANA";

interface ReportFormProps {
  regions: RegionOption[];
  userId: string;
  userSessionName: string;
}

interface NeedDraft {
  id: string;
  itemCategory: string;
  unit: string;
  qty: number;
  kind: "BARANG" | "TENAGA";
}

const COMMON_CATEGORIES = ["MAKANAN", "MEDIS", "HUNIAN", "SANITASI", "LOGISTIK", "EVAKUASI", "PENDIDIKAN"];
const COMMON_UNITS = ["kotak", "karung", "paket", "unit", "liter", "orang", "lembar"];

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

export function ReportForm({ regions, userId, userSessionName }: ReportFormProps) {
  const [step, setStep] = useState<number>(1);

  // Field Data Laporan
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"KEBUTUHAN" | "PEMANTAUAN">("KEBUTUHAN");
  const [category, setCategory] = useState<ReportCategoryEnum>("BENCANA");
  const [urgency, setUrgency] = useState<UrgencyLevelEnum>("DARURAT");
  const [selectedRegionId, setSelectedRegionId] = useState<string>(regions[0]?.id || "");

  // 5W + 1H
  const [what, setWhat] = useState("");
  const [who, setWho] = useState("");
  const [whereDescription, setWhereDescription] = useState("");
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 16));
  const [why, setWhy] = useState("");
  const [how, setHow] = useState("");

  // Bukti Lapangan & Unggah Foto (Sanitasi EXIF Klien)
  const [hasPhotoEvidence, setHasPhotoEvidence] = useState(false);
  const [photoResult, setPhotoResult] = useState<CompressionResult | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  // Asisten AI 5W+1H (Modal & State)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [rawAiNotes, setRawAiNotes] = useState("");
  const [isExtractingAi, setIsExtractingAi] = useState(false);
  const [aiResult, setAiResult] = useState<AIExtractionResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [needs, setNeeds] = useState<NeedDraft[]>([
    {
      id: "init-need-1",
      itemCategory: "MAKANAN",
      unit: "paket",
      qty: 100,
      kind: "BARANG",
    },
  ]);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ id: string; message: string } | null>(null);
  const [draftSavedMessage, setDraftSavedMessage] = useState<string | null>(null);

  // Navigasi Langkah
  const totalSteps = type === "KEBUTUHAN" ? 4 : 3;

  // Tutup modal AI via tombol Escape
  useEffect(() => {
    if (!isAiModalOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsAiModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAiModalOpen]);

  const currentRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  async function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingPhoto(true);
    setPhotoError(null);

    try {
      const res = await compressAndSanitizeImage(file);
      setPhotoResult(res);
      setHasPhotoEvidence(true);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Gagal memproses gambar.");
    } finally {
      setIsCompressingPhoto(false);
      e.target.value = "";
    }
  }

  function handleRemovePhoto() {
    setPhotoResult(null);
    setHasPhotoEvidence(false);
    setPhotoError(null);
  }

  async function handleExtractAi() {
    if (!rawAiNotes || rawAiNotes.trim().length < 15) {
      setAiError("Catatan lapangan minimal 15 karakter. Tuliskan ringkasan situasi lapangan.");
      return;
    }

    setIsExtractingAi(true);
    setAiError(null);

    try {
      const res = await extract5W1HFromNotesAction(rawAiNotes);
      if (!res.ok) {
        setAiError(res.message);
      } else {
        setAiResult(res.data);
      }
    } catch {
      setAiError("Gagal menghubungi server untuk merapikan catatan lapangan.");
    } finally {
      setIsExtractingAi(false);
    }
  }

  function handleApplyAiResult() {
    if (!aiResult) return;

    setTitle(aiResult.title);
    setType(aiResult.type);
    setCategory(aiResult.category);
    setUrgency(aiResult.urgency);
    setWhat(aiResult.what);
    setWho(aiResult.who);
    setWhereDescription(aiResult.whereDescription);
    if (aiResult.when) {
      setWhen(aiResult.when);
    }
    setWhy(aiResult.why);
    setHow(aiResult.how);

    if (aiResult.type === "KEBUTUHAN" && aiResult.suggestedNeeds && aiResult.suggestedNeeds.length > 0) {
      setNeeds(
        aiResult.suggestedNeeds.map((item, idx) => ({
          id: `ai-need-${idx + 1}-${generateClientId()}`,
          itemCategory: item.itemCategory,
          unit: item.unit,
          qty: item.qty,
          kind: item.kind,
        }))
      );
    }

    setIsAiModalOpen(false);
    setAiResult(null);
    setRawAiNotes("");
    setDraftSavedMessage("Format 5W+1H berhasil dirapikan dan diterapkan ke formulir pelaporan.");
    setTimeout(() => setDraftSavedMessage(null), 4000);
  }

  function validateStep(currentStep: number): boolean {
    setErrorMessage(null);
    setFieldErrors({});

    if (currentStep === 1) {
      if (title.trim().length < 5) {
        setErrorMessage("Judul laporan minimal 5 karakter.");
        return false;
      }
      if (!selectedRegionId) {
        setErrorMessage("Silakan pilih wilayah administratif.");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (what.trim().length < 10) {
        setErrorMessage("Deskripsi kejadian (What) minimal 10 karakter.");
        return false;
      }
      if (who.trim().length < 5) {
        setErrorMessage("Penerima manfaat (Who) minimal 5 karakter.");
        return false;
      }
      if (whereDescription.trim().length < 5) {
        setErrorMessage("Patokan lokasi (Where) minimal 5 karakter.");
        return false;
      }
      if (why.trim().length < 10) {
        setErrorMessage("Latar belakang/penyebab (Why) minimal 10 karakter.");
        return false;
      }
      if (how.trim().length < 10) {
        setErrorMessage("Akses jalur & penyaluran (How) minimal 10 karakter.");
        return false;
      }
      return true;
    }

    if (currentStep === 3 && type === "KEBUTUHAN") {
      if (needs.length === 0) {
        setErrorMessage("Laporan bertipe KEBUTUHAN wajib memiliki minimal 1 item logistik.");
        return false;
      }
      for (const n of needs) {
        if (!n.itemCategory.trim() || !n.unit.trim() || n.qty <= 0) {
          setErrorMessage("Setiap item kebutuhan wajib memiliki kategori, satuan, dan kuantitas positif.");
          return false;
        }
      }
      return true;
    }

    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => Math.min(totalSteps, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addNeedItem() {
    setNeeds((prev) => [
      ...prev,
      {
        id: generateClientId(),
        itemCategory: "MAKANAN",
        unit: "kotak",
        qty: 50,
        kind: "BARANG",
      },
    ]);
  }

  function removeNeedItem(id: string) {
    if (needs.length <= 1) {
      setErrorMessage("Minimal harus ada 1 item kebutuhan.");
      return;
    }
    setNeeds((prev) => prev.filter((item) => item.id !== id));
  }

  function updateNeedItem(id: string, field: keyof NeedDraft, val: unknown) {
    setNeeds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  }

  function handleSaveDraft() {
    try {
      enqueueOfflineDraft({
        clientId: generateClientId(),
        userId,
        userName: userSessionName || "Relawan Lapangan",
        type: "REPORT",
        reportData: {
          title: title.trim() || "Draf Laporan Kemanusiaan",
          type,
          category,
          urgency,
          regionId: selectedRegionId,
          regionName: currentRegion.name,
          latitude: currentRegion.latitude,
          longitude: currentRegion.longitude,
          what: what.trim() || "(Belum diisi)",
          who: who.trim() || "(Belum diisi)",
          whereDescription: whereDescription.trim() || "(Belum diisi)",
          when: new Date(when).toISOString(),
          why: why.trim() || "(Belum diisi)",
          how: how.trim() || "(Belum diisi)",
          hasPhotoEvidence,
          needs: needs.map((n) => ({
            itemCategory: n.itemCategory.trim(),
            unit: n.unit.trim(),
            qty: Number(n.qty) || 1,
            kind: n.kind,
          })),
        },
      });
      setDraftSavedMessage("Draf berhasil disimpan ke antrean luring perangkat (buka /antrean untuk mengelola).");
      setTimeout(() => setDraftSavedMessage(null), 4000);
    } catch {
      setErrorMessage("Penyimpanan lokal perangkat penuh atau tidak diizinkan.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const clientId = generateClientId();

    const payload = {
      clientId,
      title: title.trim(),
      type,
      category,
      urgency,
      regionId: selectedRegionId,
      latitude: currentRegion.latitude,
      longitude: currentRegion.longitude,
      what: what.trim(),
      who: who.trim(),
      whereDescription: whereDescription.trim(),
      when: new Date(when).toISOString(),
      why: why.trim(),
      how: how.trim(),
      hasPhotoEvidence,
      needs:
        type === "KEBUTUHAN"
          ? needs.map((n) => ({
              itemCategory: n.itemCategory.trim(),
              unit: n.unit.trim(),
              qty: Number(n.qty),
              kind: n.kind,
            }))
          : [],
    };

    try {
      const res = await createReportAction(payload);
      if (!res.ok) {
        setErrorMessage(res.message);
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } else {
        setIsSuccess(true);
        setSuccessInfo({ id: res.data.id, message: res.data.message });
      }
    } catch {
      // Simpan otomatis ke antrean offline jika jaringan gagal
      try {
        enqueueOfflineDraft({
          clientId,
          userId,
          userName: userSessionName || "Relawan Lapangan",
          type: "REPORT",
          reportData: {
            ...payload,
            regionName: currentRegion.name,
          },
        });
        setIsSuccess(true);
        setSuccessInfo({
          id: clientId,
          message: "Koneksi terputus. Laporan berhasil diamankan di Antrean Pengiriman Luring (/antrean) dan siap disinkronkan saat sinyal kembali.",
        });
      } catch {
        setErrorMessage("Terjadi galat koneksi jaringan dan penyimpanan lokal tidak dapat diakses.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess && successInfo) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white border border-[var(--color-border)] rounded-2xl shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success-text)] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Pengajuan Berhasil
          </span>
          <h2 className="text-xl font-bold text-[var(--color-text)] mt-1">
            Laporan Kemanusiaan Tersimpan
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
            {successInfo.message}
          </p>
        </div>

        <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-secondary)]">
          Laporan Anda saat ini berada dalam antrean peninjauan verifikator. Setelah diverifikasi oleh minimal 2 relawan komunitas atau 1 lembaga resmi, pin lokasi akan langsung muncul di peta publik.
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs transition-colors"
          >
            Kembali ke Peta Operasional
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              setTitle("");
              setWhat("");
              setWho("");
              setWhy("");
              setHow("");
            }}
            className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
          >
            Buat Laporan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
      {/* Header Formulir & Stepper */}
      <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
            Formulir Lapangan Relawan
          </span>
          <span className="text-xs text-[var(--color-text-muted)] font-semibold">
            Pelapor: <strong>{userSessionName}</strong>
          </span>
        </div>

        {/* Stepper Indikator */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className={`flex-1 text-center pb-1.5 border-b-2 text-xs font-bold ${step >= 1 ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-gray-200 text-gray-400"}`}>
            1. Klasifikasi
          </div>
          <div className={`flex-1 text-center pb-1.5 border-b-2 text-xs font-bold ${step >= 2 ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-gray-200 text-gray-400"}`}>
            2. Unsur 5W+1H
          </div>
          {type === "KEBUTUHAN" && (
            <div className={`flex-1 text-center pb-1.5 border-b-2 text-xs font-bold ${step >= 3 ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-gray-200 text-gray-400"}`}>
              3. Logistik
            </div>
          )}
          <div className={`flex-1 text-center pb-1.5 border-b-2 text-xs font-bold ${step >= totalSteps ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-gray-200 text-gray-400"}`}>
            {totalSteps}. Tinjau &amp; Kirim
          </div>
        </div>
      </div>

      {/* Pesan Kesalahan Global / Sukses Draf */}
      {errorMessage && (
        <div className="mx-5 mt-4 p-3 rounded-lg bg-[var(--color-danger-bg)] border border-red-200 text-xs text-[var(--color-danger-text)] font-semibold space-y-1">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="pl-6 list-disc text-[11px] font-normal space-y-0.5">
              {Object.entries(fieldErrors).map(([key, errs]) => (
                <li key={key}>
                  <strong>{key}</strong>: {errs.join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {draftSavedMessage && (
        <div className="mx-5 mt-4 p-3 rounded-lg bg-[var(--color-success-bg)] border border-emerald-200 text-xs text-[var(--color-success-text)] font-semibold flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{draftSavedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* ======================================================== */}
        {/* LANGKAH 1: Klasifikasi & Wilayah                        */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="report-title" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Judul Laporan Kemanusiaan <span className="text-red-500">*</span>
              </label>
              <input
                id="report-title"
                type="text"
                placeholder="Contoh: Kebutuhan Tenda Darurat Pengungsian Gempa Cugenang"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              />
              <span className="text-[10px] text-[var(--color-text-muted)] block mt-1">
                Singkat dan gamblang, minimal 5 karakter.
              </span>
            </div>

            {/* Pemilihan Tipe Laporan */}
            <div>
              <span className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Tipe Laporan <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("KEBUTUHAN")}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    type === "KEBUTUHAN"
                      ? "border-[var(--color-primary)] bg-[var(--color-success-bg)]/40 ring-1 ring-[var(--color-primary)]"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <strong className="block text-xs text-[var(--color-text)]">
                    Kebutuhan Bantuan
                  </strong>
                  <span className="text-[11px] text-[var(--color-text-secondary)] block mt-0.5">
                    Membutuhkan alokasi logistik barang atau tenaga relawan.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setType("PEMANTAUAN")}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    type === "PEMANTAUAN"
                      ? "border-[var(--color-secondary)] bg-blue-50 ring-1 ring-[var(--color-secondary)]"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <strong className="block text-xs text-[var(--color-text)]">
                    Pemantauan Situasi
                  </strong>
                  <span className="text-[11px] text-[var(--color-text-secondary)] block mt-0.5">
                    Observasi kerusakan lingkungan / sosial (tanpa logistik).
                  </span>
                </button>
              </div>
            </div>

            {/* Kategori Laporan & Urgensi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="report-category" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                  Kategori Isu <span className="text-red-500">*</span>
                </label>
                <select
                  id="report-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategoryEnum)}
                  className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                >
                  <option value="BENCANA">Bencana Alam</option>
                  <option value="LINGKUNGAN">Kerusakan Lingkungan</option>
                  <option value="LANSIA">Pendampingan Lansia (Sensitif)</option>
                  <option value="KESEHATAN">Fasilitas Kesehatan (Sensitif)</option>
                  <option value="PENDIDIKAN">Dukungan Pendidikan</option>
                  <option value="SOSIAL_LAINNYA">Isu Sosial Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="report-urgency" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                  Tingkat Urgensi <span className="text-red-500">*</span>
                </label>
                <select
                  id="report-urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevelEnum)}
                  className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                >
                  <option value="DARURAT">DARURAT (Ancaman Jiwa &amp; Tempat Tinggal)</option>
                  <option value="MENDESAK">MENDESAK (Perlu Tindakan Cepat 24-48 Jam)</option>
                  <option value="TERENCANA">TERENCANA (Dukungan Berkelanjutan / Rutin)</option>
                </select>
              </div>
            </div>

            {/* Pemilihan Wilayah Administratif */}
            <div>
              <label htmlFor="report-region" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Wilayah Administratif Terdaftar <span className="text-red-500">*</span>
              </label>
              <select
                id="report-region"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name} &bull; {reg.province}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LANGKAH 2: Kerangka 5W + 1H                              */}
        {/* ======================================================== */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Banner Pembantu AI 5W+1H */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--color-primary)] text-white shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs text-[var(--color-text)]">
                    Punya Catatan Mentah WhatsApp atau Rekaman Lapangan?
                  </strong>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                    Gunakan Asisten Lapangan untuk menstrukturkan cerita bebas menjadi kerangka 5W+1H otomatis.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAiModalOpen(true);
                  setAiError(null);
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-hover)] cursor-pointer shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bantu Rapikan Catatan (AI)</span>
              </button>
            </div>

            <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-text-secondary)] flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-[var(--color-primary)] mt-0.5" />
              <span>
                Seluruh 6 elemen 5W+1H wajib diisi secara substantif untuk memastikan laporan dapat diverifikasi dengan objektif.
              </span>
            </div>

            <div>
              <label htmlFor="5w-what" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                What &bull; Apa kejadian atau situasi lapangannya? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="5w-what"
                rows={2}
                placeholder="Jelaskan jenis kejadian, dampak kerusakan, atau kebutuhan utama secara faktual..."
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              />
            </div>

            <div>
              <label htmlFor="5w-who" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Who &bull; Siapa kelompok terdampak atau penerima manfaat? <span className="text-red-500">*</span>
              </label>
              <input
                id="5w-who"
                type="text"
                placeholder="Contoh: 45 KK warga RW 02 (termasuk 12 balita dan 8 lansia)"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              />
              <span className="text-[10px] text-[var(--color-text-muted)] block mt-0.5">
                Hindari menyebutkan nama pribadi atau data medis sensitif perseorangan.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="5w-where" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                  Where &bull; Patokan Lokasi Akses Aman <span className="text-red-500">*</span>
                </label>
                <input
                  id="5w-where"
                  type="text"
                  placeholder="Contoh: Lapangan Balai Desa Cibulakan"
                  value={whereDescription}
                  onChange={(e) => setWhereDescription(e.target.value)}
                  className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                />
              </div>

              <div>
                <label htmlFor="5w-when" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                  When &bull; Waktu Riil Kejadian / Kondisi <span className="text-red-500">*</span>
                </label>
                <input
                  id="5w-when"
                  type="datetime-local"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="5w-why" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Why &bull; Mengapa bantuan ini mendesak dibutuhkan? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="5w-why"
                rows={2}
                placeholder="Jelaskan alasan mendesak, potensi risiko jika tidak segera ditangani..."
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              />
            </div>

            <div>
              <label htmlFor="5w-how" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                How &bull; Bagaimana kondisi akses dan metode penyaluran yang aman? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="5w-how"
                rows={2}
                placeholder="Kondisi jalur darat, kendaraan yang dapat melintas, koordinasi dengan posko..."
                value={how}
                onChange={(e) => setHow(e.target.value)}
                className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-2.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LANGKAH 3: Item Kebutuhan Logistik (Khusus KEBUTUHAN)    */}
        {/* ======================================================== */}
        {step === 3 && type === "KEBUTUHAN" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[var(--color-text)]">
                  Rincian Item Kebutuhan Logistik
                </h3>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  Satuan pengukuran terisolasi per kategori barang/tenaga.
                </span>
              </div>
              <button
                type="button"
                onClick={addNeedItem}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-hover)] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {needs.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[var(--color-text)]">
                      Item #{index + 1}
                    </span>
                    {needs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNeedItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                        title="Hapus item ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] mb-1">
                        Kategori Item
                      </label>
                      <input
                        type="text"
                        list="categories-list"
                        value={item.itemCategory}
                        onChange={(e) => updateNeedItem(item.id, "itemCategory", e.target.value.toUpperCase())}
                        className="w-full p-2 bg-white border border-[var(--color-border-strong)] rounded-md font-bold uppercase text-xs"
                      />
                      <datalist id="categories-list">
                        {COMMON_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] mb-1">
                        Jenis
                      </label>
                      <select
                        value={item.kind}
                        onChange={(e) => updateNeedItem(item.id, "kind", e.target.value)}
                        className="w-full p-2 bg-white border border-[var(--color-border-strong)] rounded-md font-semibold text-xs"
                      >
                        <option value="BARANG">BARANG (Fisik)</option>
                        <option value="TENAGA">TENAGA (Relawan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] mb-1">
                        Satuan Ukur
                      </label>
                      <input
                        type="text"
                        list="units-list"
                        value={item.unit}
                        onChange={(e) => updateNeedItem(item.id, "unit", e.target.value.toLowerCase())}
                        className="w-full p-2 bg-white border border-[var(--color-border-strong)] rounded-md font-medium text-xs"
                      />
                      <datalist id="units-list">
                        {COMMON_UNITS.map((u) => (
                          <option key={u} value={u} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[var(--color-text-muted)] mb-1">
                        Jumlah (Kuantitas)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => updateNeedItem(item.id, "qty", Math.max(1, Number(e.target.value)))}
                        className="w-full p-2 bg-white border border-[var(--color-border-strong)] rounded-md font-bold tabular-numbers text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LANGKAH TERAKHIR: Tinjauan, Bukti Foto & Kirim           */}
        {/* ======================================================== */}
        {step === totalSteps && (
          <div className="space-y-4">
            <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                Ringkasan Pengajuan Laporan
              </h3>

              <div className="text-xs space-y-1 text-[var(--color-text-secondary)]">
                <div>
                  <strong className="text-[var(--color-text)]">Judul:</strong> {title}
                </div>
                <div>
                  <strong className="text-[var(--color-text)]">Tipe &amp; Kategori:</strong>{" "}
                  {type} &bull; {category} ({urgency})
                </div>
                <div>
                  <strong className="text-[var(--color-text)]">Wilayah:</strong> {currentRegion.name},{" "}
                  {currentRegion.province}
                </div>
                {type === "KEBUTUHAN" && (
                  <div>
                    <strong className="text-[var(--color-text)]">Total Item Kebutuhan:</strong>{" "}
                    {needs.length} macam logistik
                  </div>
                )}
              </div>
            </div>

            {/* Kartu Unggah & Sanitasi Foto Lapangan */}
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Dokumentasi Foto Lapangan (+30 Skor Kepercayaan)</span>
                  </h4>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                    Foto otomatis dikompresi ringan &amp; disterilkan dari metadata privasi EXIF/GPS di browser.
                  </span>
                </div>
              </div>

              {photoError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{photoError}</span>
                </div>
              )}

              {/* Area Tampilan Foto yang Sudah Diunggah & Disterilkan */}
              {photoResult ? (
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail Pratinjau */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-300 shrink-0 bg-gray-100 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoResult.dataUrl}
                          alt="Pratinjau Bukti Lapangan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs space-y-0.5">
                        <strong className="block text-emerald-950 font-bold">
                          Foto Lapangan Siap Dilampirkan
                        </strong>
                        <span className="text-[11px] text-emerald-800 block">
                          Resolusi: {photoResult.width} &times; {photoResult.height}px &bull; Ukuran: {formatBytes(photoResult.compressedSizeBytes)}
                          {" "}(Hemat {Math.max(0, Math.round((1 - photoResult.compressedSizeBytes / photoResult.originalSizeBytes) * 100))}%)
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Metadata EXIF &amp; GPS disanitasi demi privasi warga
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-100 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Hapus Foto
                    </button>
                  </div>
                </div>
              ) : (
                /* Area Dropzone / Picker */
                <div>
                  <label
                    htmlFor="field-photo-input"
                    className={`border-2 border-dashed border-[var(--color-border-strong)] hover:border-[var(--color-primary)] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[var(--color-bg)]/50 ${
                      isCompressingPhoto ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <input
                      id="field-photo-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoFileChange}
                      className="sr-only"
                    />
                    {isCompressingPhoto ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                        <span className="text-xs font-semibold text-[var(--color-text)]">
                          Mengompresi dan mensterilkan EXIF gambar...
                        </span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-[var(--color-primary)] mb-1" />
                        <span className="text-xs font-bold text-[var(--color-text)]">
                          Pilih atau Ambil Foto dari Kamera
                        </span>
                        <span className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                          Format JPG, PNG, atau WebP (Maks. 10 MB mentah &bull; Dikompresi otomatis ke resolusi darurat)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Checkbox Konfirmasi Manual sebagai Alternatif */}
              <div className="pt-2 border-t border-gray-100 flex items-start gap-2.5">
                <input
                  id="photo-evidence"
                  type="checkbox"
                  checked={hasPhotoEvidence}
                  onChange={(e) => setHasPhotoEvidence(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-focus)] cursor-pointer"
                />
                <label htmlFor="photo-evidence" className="text-xs cursor-pointer">
                  <span className="font-semibold text-[var(--color-text)]">
                    Konfirmasi laporan ini didukung dokumentasi foto lapangan langsung
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] block">
                    (Memberikan verifikator kepastian riil untuk menetapkan persetujuan resmi).
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigasi Bawah Formulir */}
        <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded border border-[var(--color-border-strong)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              title="Simpan draf di perangkat lokal"
            >
              <Save className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Simpan Draf Luring</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 min-h-[44px] px-3.5 py-2 rounded border border-[var(--color-border-strong)] text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sebelumnya</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 min-h-[44px] px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />}
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ajukan Laporan Kemanusiaan</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* ======================================================== */}
      {/* MODAL ASISTEN AI: Rapikan Catatan Lapangan 5W+1H         */}
      {/* ======================================================== */}
      {isAiModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-modal-title"
          className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/60"
        >
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--color-primary)] text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="ai-modal-title" className="text-sm font-bold text-[var(--color-text)]">
                    Asisten Lapangan: Rapikan Catatan ke 5W+1H
                  </h3>
                  <span className="text-[11px] text-[var(--color-text-secondary)]">
                    Mengekstrak pesan WhatsApp atau catatan suara bebas menjadi laporan terstruktur.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Scrollable */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <strong>Ketentuan Privasi &amp; Kontrol:</strong> Pemrosesan berjalan di server terisolasi. AI tidak pernah memutuskan status laporan atau mengubah fakta. Anda dapat meninjau hasil sebelum menerapkannya ke formulir.
              </div>

              <div>
                <label htmlFor="ai-raw-notes" className="block text-xs font-bold text-[var(--color-text)] mb-1">
                  Tempel Catatan Lapangan / Pesan Singkat Relawan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="ai-raw-notes"
                  rows={4}
                  placeholder="Contoh: 'Banjir luapan sungai di desa sukamaju setinggi 1 meter merendam 35 rumah warga. Warga mengungsi di balai desa membutuhkan makanan siap saji 100 bungkus, selimut 40 buah, dan obat-obatan. Akses hanya bisa perahu karet atau jalan kaki...'"
                  value={rawAiNotes}
                  onChange={(e) => setRawAiNotes(e.target.value)}
                  className="w-full text-xs bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg p-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
                />
                <span className="text-[10px] text-[var(--color-text-muted)] block mt-1">
                  Minimal 15 karakter teks catatan bebas.
                </span>
              </div>

              {aiError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}

              {/* Pratinjau Hasil Ekstraksi */}
              {aiResult && (
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Hasil Analisis Struktur 5W+1H
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase">
                      {aiResult.category} &bull; {aiResult.urgency}
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-gray-800">
                    <div>
                      <strong className="text-[var(--color-text)]">Judul Usulan:</strong> {aiResult.title}
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">What:</strong> {aiResult.what}
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">Who:</strong> {aiResult.who}
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">Where:</strong> {aiResult.whereDescription}
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">Why:</strong> {aiResult.why}
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">How:</strong> {aiResult.how}
                    </div>
                    {aiResult.suggestedNeeds.length > 0 && (
                      <div className="pt-1">
                        <strong className="text-[var(--color-text)] block mb-1">
                          Rekomendasi Item Kebutuhan Logistik:
                        </strong>
                        <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                          {aiResult.suggestedNeeds.map((need, idx) => (
                            <li key={idx}>
                              <strong>{need.itemCategory}</strong>: {need.qty} {need.unit} ({need.kind})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 sm:p-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3 bg-[var(--color-bg)]">
              <button
                type="button"
                onClick={() => {
                  setAiResult(null);
                  setRawAiNotes("");
                  setAiError(null);
                  setIsAiModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text)] hover:bg-gray-100 cursor-pointer"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                {!aiResult ? (
                  <button
                    type="button"
                    onClick={handleExtractAi}
                    disabled={isExtractingAi || rawAiNotes.trim().length < 15}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isExtractingAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menganalisis Catatan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ekstrak Kerangka 5W+1H</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyAiResult}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Terapkan ke Formulir Pelaporan</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
