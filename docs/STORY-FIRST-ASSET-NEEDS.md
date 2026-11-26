# STORY-FIRST ASSET NEEDS — TRASEC

Tanggal: 2026-11-26

---

## 1. Aset yang Sudah Tersedia & Digunakan

Seluruh aset foto di bawah telah tersedia di `public/images/landing/` dan terdokumentasi di `public/images/landing/ASSET_CREDITS.md`:

- `/images/landing/categories/tenda-pengungsian-relawan-pmi.jpg` (Dipakai untuk kategori `BENCANA`)
- `/images/landing/field-activities/bersih-sungai-cikapundung.jpg` (Dipakai untuk kategori `LINGKUNGAN`)
- `/images/landing/categories/posyandu-kesehatan-lansia.jpg` (Dipakai untuk kategori `LANSIA`)
- `/images/landing/categories/distribusi-bantuan-hygiene-kit.jpg` (Dipakai untuk kategori `KESEHATAN`)
- `/images/landing/hero/gotong-royong-relawan-sungai.jpg` (Dipakai untuk kategori `PENDIDIKAN`, `SOSIAL_LAINNYA`, dan fallback umum)

Seluruh penggunaan di homepage (`/`) diberi keterangan eksplisit **"Arsip Kurasi TRASEC"** agar tidak disalahpahami sebagai foto kejadian langsung (*live incident photo*).

---

## 2. Aset yang Masih Dibutuhkan (Dari Tim Manusia)

| Kode Aset | Kebutuhan | Lokasi Penggunaan | Status |
|---|---|---|---|
| `ASSET-01` | Foto dokumentasi tematik kategori `PENDIDIKAN` (dukungan sekolah darurat / perlengkapan belajar) berlisensi bebas royalti | `FeaturedIncidentSection` & `/tentang` | **Belum Tersedia** (Sementara menggunakan foto gotong royong umum) |
| `ASSET-02` | Logo SVG resmi & Favicon TRASEC beresolusi vektor | `Navbar`, `HomeFooter`, `app/favicon.ico` | **Belum Tersedia** (Sementara menggunakan monogram tipografis `TR`) |
| `ASSET-03` | Berkas animasi mikro `.lottie` (< 50 KB) untuk indikator status sinkronisasi / kosong berlisensi resmi | Opsional (`@lottiefiles/dotlottie-react`) | **Belum Tersedia** (Sementara memakai ikon Lucide standar) |
| `ASSET-04` | Foto bukti spesifik per `Report.id` apabila penyimpanan media objek (seperti S3/R2/Uploadthing) diaktifkan di masa depan | `FeaturedIncidentSection` & `/laporan/[id]` | **Belum Tersedia** (Di luar cakupan skema DB saat ini) |

