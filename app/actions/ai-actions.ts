"use server";

import { z } from "zod";
import { getSession } from "@/lib/session";
import type { ActionResponse } from "@/lib/types";

export const aiExtractionSchema = z.object({
  title: z.string().min(5, { message: "Judul hasil ekstraksi minimal 5 karakter" }),
  type: z.enum(["KEBUTUHAN", "PEMANTAUAN"]),
  category: z.enum([
    "BENCANA",
    "LINGKUNGAN",
    "LANSIA",
    "KESEHATAN",
    "PENDIDIKAN",
    "SOSIAL_LAINNYA",
  ]),
  urgency: z.enum(["DARURAT", "MENDESAK", "TERENCANA"]),
  what: z.string().min(10, { message: "Deskripsi kejadian (What) minimal 10 karakter" }),
  who: z.string().min(5, { message: "Pihak terdampak (Who) minimal 5 karakter" }),
  whereDescription: z.string().min(5, { message: "Lokasi patokan (Where) minimal 5 karakter" }),
  when: z.string().min(1),
  why: z.string().min(10, { message: "Latar belakang (Why) minimal 10 karakter" }),
  how: z.string().min(10, { message: "Jalur akses (How) minimal 10 karakter" }),
  suggestedNeeds: z
    .array(
      z.object({
        itemCategory: z.string(),
        unit: z.string(),
        qty: z.number().positive(),
        kind: z.enum(["BARANG", "TENAGA"]),
      })
    )
    .optional()
    .default([]),
  aiSummary: z.string(),
});

export type AIExtractionResult = z.infer<typeof aiExtractionSchema>;

/**
 * Ekstraktor heuristik bahasa Indonesia yang tangguh saat kunci API AI tidak tersedia.
 * Memastikan aplikasi beroperasi normal 100% tanpa ketergantungan API eksternal (Bagian 4.9).
 */
function heuristicExtract5W1H(rawNotes: string): AIExtractionResult {
  const lower = rawNotes.toLowerCase();

  // 1. Tentukan Tipe Laporan (KEBUTUHAN vs PEMANTAUAN)
  let type: AIExtractionResult["type"] = "KEBUTUHAN";
  if (
    lower.includes("pantau") ||
    lower.includes("observasi") ||
    lower.includes("monitoring") ||
    lower.includes("peringatan dini") ||
    lower.includes("status waspada")
  ) {
    type = "PEMANTAUAN";
  }

  // 2. Tentukan Kategori Isu
  let category: AIExtractionResult["category"] = "BENCANA";
  let urgency: AIExtractionResult["urgency"] = "DARURAT";

  if (
    lower.includes("banjir") ||
    lower.includes("gempa") ||
    lower.includes("longsor") ||
    lower.includes("tsunami") ||
    lower.includes("erupsi") ||
    lower.includes("kebakaran") ||
    lower.includes("puting beliung")
  ) {
    category = "BENCANA";
    urgency = "DARURAT";
  } else if (lower.includes("lansia") || lower.includes("jompo") || lower.includes("kakek") || lower.includes("nenek")) {
    category = "LANSIA";
    urgency = "TERENCANA";
  } else if (lower.includes("obat") || lower.includes("sakit") || lower.includes("kesehatan") || lower.includes("medis") || lower.includes("faskes")) {
    category = "KESEHATAN";
    urgency = "MENDESAK";
  } else if (lower.includes("sekolah") || lower.includes("buku") || lower.includes("belajar") || lower.includes("siswa") || lower.includes("pendidikan")) {
    category = "PENDIDIKAN";
    urgency = "TERENCANA";
  } else if (lower.includes("sampah") || lower.includes("pohon") || lower.includes("polusi") || lower.includes("sungai") || lower.includes("lingkungan") || lower.includes("limbah")) {
    category = "LINGKUNGAN";
    urgency = "MENDESAK";
  }

  if (type === "PEMANTAUAN") {
    urgency = "MENDESAK";
  }

  // 2. Ekstraksi Unsur 5W+1H
  const lines = rawNotes.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = lines[0] && lines[0].length >= 5
    ? lines[0].slice(0, 100)
    : `Laporan Kebutuhan ${category} di Lapangan`;

  const what = rawNotes.length >= 20
    ? rawNotes.slice(0, 300)
    : `Kejadian darurat membutuhkan dukungan logistik dan penanganan segera. Catatan: ${rawNotes}`;

  const who = lower.includes("warga") || lower.includes("jiwa") || lower.includes("kk") || lower.includes("keluarga")
    ? "Masyarakat warga setempat dan kelompok rentan di sekitar lokasi kejadian."
    : "Kelompok warga dan komunitas terdampak di lokasi sasaran.";

  const whereDescription = lower.includes("posko") || lower.includes("desa") || lower.includes("balai") || lower.includes("jalan")
    ? "Area sekitar posko lapangan dan balai warga setempat yang aman."
    : "Titik kumpul warga di lokasi aman terdekat dari area kejadian.";

  const why = "Kebutuhan mendesak untuk menjaga keselamatan jiwa, kesehatan, dan pemulihan kondisi penerima manfaat.";
  const how = "Penyaluran logistik fisik dapat diantarkan langsung ke posko darurat atau dititipkan melalui koordinator lapangan.";

  // 3. Rekomendasi Item Kebutuhan
  const suggestedNeeds: AIExtractionResult["suggestedNeeds"] = [];
  if (type === "KEBUTUHAN") {
    if (lower.includes("tenda") || lower.includes("terpal") || lower.includes("matras") || lower.includes("selimut")) {
      suggestedNeeds.push({ itemCategory: "HUNIAN", unit: "lembar", qty: 30, kind: "BARANG" });
    }
    if (lower.includes("makan") || lower.includes("sembako") || lower.includes("beras") || lower.includes("air")) {
      suggestedNeeds.push({ itemCategory: "MAKANAN", unit: "paket", qty: 100, kind: "BARANG" });
    }
    if (lower.includes("obat") || lower.includes("kaporit") || lower.includes("medis")) {
      suggestedNeeds.push({ itemCategory: "MEDIS", unit: "kotak", qty: 25, kind: "BARANG" });
    }
    if (lower.includes("relawan") || lower.includes("evakuasi") || lower.includes("tenaga")) {
      suggestedNeeds.push({ itemCategory: "EVAKUASI", unit: "orang", qty: 10, kind: "TENAGA" });
    }

    if (suggestedNeeds.length === 0) {
      suggestedNeeds.push({ itemCategory: "LOGISTIK", unit: "paket", qty: 50, kind: "BARANG" });
    }
  }

  const aiSummary = `Ekstraksi 5W+1H berhasil dari catatan lapangan relawan: Kejadian ${category} berstatus ${urgency}.`;

  return {
    title,
    type,
    category,
    urgency,
    what,
    who,
    whereDescription,
    when: new Date().toISOString().slice(0, 16),
    why,
    how,
    suggestedNeeds,
    aiSummary,
  };
}

/**
 * Server Action: Merapikan cerita bebas relawan lapangan ke kerangka terstruktur 5W+1H.
 * Memenuhi Bagian 4.9 AGENTS.md (Server-side execution, Zod validation, opsional aiSummary).
 */
export async function extract5W1HFromNotesAction(
  rawNotes: string
): Promise<ActionResponse<AIExtractionResult>> {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return {
        ok: false,
        code: "UNAUTHORIZED",
        message: "Silakan masuk terlebih dahulu untuk menggunakan fitur pembantu AI.",
      };
    }

    if (!rawNotes || rawNotes.trim().length < 15) {
      return {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Catatan lapangan terlalu pendek (minimal 15 karakter). Berikan cerita ringkas situasi di lapangan.",
      };
    }

    const trimmedNotes = rawNotes.trim();

    // Periksa apakah terdapat kunci API AI di lingkungan server
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    let extractedData: AIExtractionResult;

    if (apiKey) {
      try {
        // Pemanggilan API LLM Server-Side jika kunci tersedia
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Anda adalah asisten data kemanusiaan. Ekstrak teks cerita lapangan relawan berikut ke dalam format JSON 5W+1H murni tanpa markdown wrapper:
{
  "title": "judul singkat 5-100 karakter",
  "type": "KEBUTUHAN" atau "PEMANTAUAN",
  "category": "BENCANA"|"LINGKUNGAN"|"LANSIA"|"KESEHATAN"|"PENDIDIKAN"|"SOSIAL_LAINNYA",
  "urgency": "DARURAT"|"MENDESAK"|"TERENCANA",
  "what": "kejadian riil min 10 karakter",
  "who": "pihak terdampak min 5 karakter",
  "whereDescription": "patokan lokasi aman min 5 karakter",
  "when": "${new Date().toISOString().slice(0, 16)}",
  "why": "penyebab/urgensi min 10 karakter",
  "how": "metode akses/jalur min 10 karakter",
  "suggestedNeeds": [{"itemCategory": "MAKANAN|HUNIAN|MEDIS|LOGISTIK|EVAKUASI", "unit": "paket|karung|kotak|orang", "qty": 50, "kind": "BARANG"|"TENAGA"}],
  "aiSummary": "rangkuman singkat 1 kalimat"
}

Teks Lapangan:
${trimmedNotes}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2,
              },
            }),
          }
        );

        if (response.ok) {
          const apiJson = await response.json();
          const rawText = apiJson.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = JSON.parse(rawText);
          const validated = aiExtractionSchema.parse(parsed);
          extractedData = validated;
        } else {
          extractedData = heuristicExtract5W1H(trimmedNotes);
        }
      } catch {
        extractedData = heuristicExtract5W1H(trimmedNotes);
      }
    } else {
      // Gunakan parser heuristik bahasa Indonesia jika tanpa kunci API
      extractedData = heuristicExtract5W1H(trimmedNotes);
    }

    return {
      ok: true,
      data: extractedData,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses ekstraksi 5W+1H";
    return {
      ok: false,
      code: "SERVER_ERROR",
      message: msg,
    };
  }
}
