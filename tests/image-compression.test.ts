import { describe, it, expect } from "vitest";
import { compressAndSanitizeImage } from "@/lib/image-compression";

describe("compressAndSanitizeImage", () => {
  it("harus menolak format berkas selain JPG, PNG, atau WebP", async () => {
    const invalidFile = new File(["dummy-content"], "document.pdf", {
      type: "application/pdf",
    });

    await expect(compressAndSanitizeImage(invalidFile)).rejects.toThrow(
      "Format gambar tidak didukung"
    );
  });

  it("harus menolak berkas mentah yang melebihi batas 10 MB", async () => {
    // Buat mock berkas sebesar 11 MB
    const largeBlob = new Uint8Array(11 * 1024 * 1024);
    const oversizedFile = new File([largeBlob], "huge.jpg", {
      type: "image/jpeg",
    });

    await expect(compressAndSanitizeImage(oversizedFile)).rejects.toThrow(
      "Ukuran berkas mentah terlalu besar"
    );
  });
});
