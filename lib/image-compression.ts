"use client";

export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  width: number;
  height: number;
  format: "image/jpeg" | "image/webp";
  sanitized: boolean; // Menandakan metadata EXIF/GPS telah dibersihkan
}

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_RAW_FILE_SIZE = 10 * 1024 * 1024; // 10 MB batas unggah mentah
const MAX_DIMENSION = 1280; // Maksimal resolusi dimensi terpanjang

/**
 * Kompresi gambar sisi klien dan sanitasi privasi EXIF.
 *
 * Mekanisme Keamanan & Privasi:
 * 1. Memvalidasi tipe MIME berkas (hanya jpeg, png, webp).
 * 2. Menggambar ulang piksel melalui elemen HTML5 Canvas.
 *    Proses render kanvas secara inheren MENGHAPUS seluruh metadata EXIF
 *    (termasuk koordinat GPS presisi dan nomor seri perangkat) guna mematuhi
 *    Bagian 8 AGENTS.md.
 * 3. Mengompresi ukuran ke JPEG/WebP dengan rasio kualitas 0.80 agar ringan
 *    pada koneksi jaringan 3G darurat.
 */
export async function compressAndSanitizeImage(
  file: File,
  options?: { maxDimension?: number; quality?: number }
): Promise<CompressionResult> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(
      "Format gambar tidak didukung. Harap unggah berkas berformat JPG, PNG, atau WebP."
    );
  }

  if (file.size > MAX_RAW_FILE_SIZE) {
    throw new Error("Ukuran berkas mentah terlalu besar (maksimal 10 MB).");
  }

  const maxDim = options?.maxDimension || MAX_DIMENSION;
  const quality = options?.quality || 0.8;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Gagal membaca berkas gambar dari perangkat."));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Berkas gambar rusak atau tidak dapat didekode."));
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Hitung skala rasio agar tidak melebihi maxDim
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi kanvas grafis browser."));
          return;
        }

        // Gambar piksel ke kanvas (menghapus seluruh tag EXIF)
        ctx.drawImage(img, 0, 0, width, height);

        // Pilih format keluaran JPEG untuk kompatibilitas universal
        const outputFormat = "image/jpeg" as const;
        const compressedDataUrl = canvas.toDataURL(outputFormat, quality);

        // Hitung perkiraan ukuran byte dari Base64
        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(",") + 1);
        const compressedBytes = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          originalSizeBytes: file.size,
          compressedSizeBytes: compressedBytes,
          width,
          height,
          format: outputFormat,
          sanitized: true,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
