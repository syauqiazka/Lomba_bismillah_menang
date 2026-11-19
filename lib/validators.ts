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
 * Skema validasi komposit pengajuan laporan lengkap.
 * Menegakkan aturan:
 * - Tipe KEBUTUHAN wajib memiliki minimal 1 item kebutuhan (Need).
 * - Tipe PEMANTAUAN dilarang memiliki item kebutuhan.
 */
export const createReportSchema = report5W1HSchema
  .extend({
    clientId: z.string().trim().min(1, { message: "Client ID wajib disertakan" }),
    latitude: z.number(),
    longitude: z.number(),
    needs: z.array(needItemSchema).optional().default([]),
    hasPhotoEvidence: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      if (data.type === "KEBUTUHAN" && data.needs.length === 0) {
        return false;
      }
      if (data.type === "PEMANTAUAN" && data.needs.length > 0) {
        return false;
      }
      return true;
    },
    {
      message:
        "Laporan bertipe KEBUTUHAN wajib memiliki minimal 1 item kebutuhan, sedangkan laporan bertipe PEMANTAUAN dilarang memiliki item kebutuhan.",
      path: ["needs"],
    }
  );

export type CreateReportInput = z.infer<typeof createReportSchema>;

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

/**
 * Skema validasi masuk sistem (Login).
 */
export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Skema validasi pendaftaran akun relawan baru (Register).
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Nama lengkap minimal 3 karakter" })
    .max(100, { message: "Nama lengkap maksimal 100 karakter" }),
  email: z.string().trim().email({ message: "Format email tidak valid" }),
  phone: z
    .string()
    .trim()
    .regex(/^(\+62|62|0)[0-9]{8,15}$/, {
      message: "Format nomor telepon Indonesia tidak valid (contoh: 08123456789)",
    })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Kata sandi minimal 8 karakter" })
    .regex(/[A-Z]/, { message: "Kata sandi harus mengandung minimal 1 huruf kapital" })
    .regex(/[0-9]/, { message: "Kata sandi harus mengandung minimal 1 angka" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

