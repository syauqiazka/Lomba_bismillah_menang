import { z } from "zod";

/**
 * Skema validasi 6 unsur 5W+1H untuk pengajuan laporan kemanusiaan.
 * Semua bidang wajib diisi secara substantif baik di klien maupun server.
 */
export const report5W1HSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Judul laporan minimal 5 karakter" })
    .max(120, { message: "Judul laporan maksimal 120 karakter" }),
  type: z.enum(["KEBUTUHAN", "PEMANTAUAN"], {
    message: "Jenis laporan wajib KEBUTUHAN atau PEMANTAUAN",
  }),
  category: z.enum(
    [
      "BENCANA",
      "LINGKUNGAN",
      "LANSIA",
      "KESEHATAN",
      "PENDIDIKAN",
      "SOSIAL_LAINNYA",
    ],
    {
      message: "Kategori laporan tidak valid",
    }
  ),
  urgency: z.enum(["DARURAT", "MENDESAK", "TERENCANA"], {
    message: "Tingkat urgensi wajib dipilih",
  }),
  regionId: z.string().trim().min(1, { message: "Wilayah administratif wajib dipilih" }),

  // 5W + 1H
  what: z
    .string()
    .trim()
    .min(10, { message: "Deskripsi kejadian/kebutuhan (What) minimal 10 karakter" }),
  who: z
    .string()
    .trim()
    .min(5, { message: "Penerima manfaat atau pihak terdampak (Who) minimal 5 karakter" }),
  whereDescription: z
    .string()
    .trim()
    .min(5, { message: "Patokan lokasi atau titik kumpul aman (Where) minimal 5 karakter" }),
  when: z
    .string()
    .trim()
    .min(1, { message: "Waktu kejadian/kebutuhan (When) wajib diisi" }),
  why: z
    .string()
    .trim()
    .min(10, { message: "Penyebab situasi atau latar belakang (Why) minimal 10 karakter" }),
  how: z
    .string()
    .trim()
    .min(10, { message: "Metode akses jalur dan penyaluran aman (How) minimal 10 karakter" }),
});

export type Report5W1HInput = z.infer<typeof report5W1HSchema>;

/**
 * Skema validasi item kebutuhan logistik (Need).
 * Wajib menyertakan itemCategory, unit, qty positif, dan kind (BARANG/TENAGA).
 */
export const needItemSchema = z.object({
  itemCategory: z
    .string()
    .trim()
    .min(2, { message: "Kategori logistik minimal 2 karakter" }),
  unit: z
    .string()
    .trim()
    .min(1, { message: "Satuan pengukuran wajib diisi" }),
  qty: z
    .number()
    .positive({ message: "Kuantitas kebutuhan harus bernilai positif" }),
  kind: z.enum(["BARANG", "TENAGA"], {
    message: "Jenis kebutuhan wajib BARANG atau TENAGA",
  }),
});

export type NeedItemInput = z.infer<typeof needItemSchema>;

/**
 * Skema validasi catatan bantuan relawan (Aid).
 */
export const aidItemSchema = z.object({
  itemCategory: z
    .string()
    .trim()
    .min(2, { message: "Kategori logistik minimal 2 karakter" }),
  unit: z
    .string()
    .trim()
    .min(1, { message: "Satuan pengukuran wajib diisi" }),
  qty: z
    .number()
    .positive({ message: "Kuantitas bantuan harus bernilai positif" }),
});

export type AidItemInput = z.infer<typeof aidItemSchema>;

/**
 * Skema validasi catatan alasan verifikasi.
 * Wajib minimal 10 karakter untuk penolakan atau permintaan revisi.
 */
export const verificationNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(10, { message: "Alasan verifikasi wajib diisi minimal 10 karakter" }),
});

export type VerificationNoteInput = z.infer<typeof verificationNoteSchema>;
