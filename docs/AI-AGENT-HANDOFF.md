<<<<<<< HEAD
# AI AGENT HANDOFF — TRASEC

Terakhir diperbarui: 2026-11-26

---

## 1. Status Arsitektur Terkini

TRASEC telah dimigrasikan ke arsitektur **Story-first Environmental & Humanitarian Intelligence Platform**:
- **`/` (`app/page.tsx`)**: Story-first Homepage (`StoryFirstHomeView`), menampilkan Hero Story, Featured Incident deterministik (`lib/featured-incident.ts`), Incident Context 5W+1H, Daftar Laporan Terverifikasi, Dampak Tercatat, Selisih Kebutuhan (khusus `KEBUTUHAN`), Pratinjau Peta, Transparansi Verifikasi, CTA, dan Footer.
- **`/peta` (`app/peta/page.tsx`)**: Operational Map penuh (`RootOperationalView`) dengan Leaflet, filter kategori/selisih/waktu, drawer detail laporan, bottom sheet pengantar, tabel teks alternatif, dan tombol darurat.
- **`/tentang` (`app/tentang/page.tsx`)**: Halaman penjelasan produk dan metodologi (`EditorialLandingView`).

---

## 2. Aturan yang Wajib Dijaga Agen Berikutnya

1. **Jangan mengubah business logic** di `prisma/schema.prisma`, `app/actions/*`, `lib/calculations.ts`, `lib/trust-score.ts`, `lib/access.ts`, `lib/validators.ts`, `lib/offline-queue.ts`, dan `lib/public-queries.ts` tanpa persetujuan eksplisit tim.
2. **Pemisahan Motion & GSAP**:
   - `motion` hanya untuk transisi UI interaktif (filter, accordion, modal, drawer).
   - `gsap` hanya untuk scroll storytelling di `/` via dynamic import dengan `gsap.context()` dan pengecekan `prefers-reduced-motion: reduce`.
3. **Kejujuran Data Demo**: Jika database dalam mode placeholder atau fallback digunakan, badge `DEMO` wajib selalu tampil.

---

## 3. Tindak Lanjut yang Disarankan

1. **Browser QA Langsung**: Jalankan `npm run dev` lalu uji visual di browser pada viewport `360×800`, `768×1024`, dan `1280×800`, serta uji dengan pengaturan sistem `prefers-reduced-motion: reduce` aktif.
2. **Penyediaan Aset**: Lengkapi aset yang tercatat pada `docs/STORY-FIRST-ASSET-NEEDS.md` sebelum finalisasi presentasi lomba.

=======
# TRASEC — AI Agent Handoff

Tanggal: 2026-11-25

---

## 1. Konteks Proyek
TRASEC adalah **Humanitarian Intelligence Platform** berbasis Next.js 16 (App Router), TypeScript strict, Prisma + PostgreSQL (Neon), `iron-session`, Tailwind CSS v4, dan Leaflet + OpenStreetMap. Platform ini bukan situs penggalangan dana, melainkan alat transparansi selisih kebutuhan vs bantuan fisik terkonfirmasi (`CONFIRMED`) per lokasi dan per satuan.

Dokumen sumber kebenaran:
- `AGENTS.md`: Aturan bisnis, keamanan, RBAC, arsitektur, dan tata kelola agen.
- `DESIGN.md`: Token warna, tipografi, z-index, komponen, dan Anti-Slop Quality Gate.

## 2. Perubahan yang Telah Diselesaikan (Fase 01–06 + Security & Offline Remediation)
- **Routing & Peta Utama (`/`):** `/` kini merender `RootOperationalView` (peta Leaflet full-viewport + `IntroBottomSheet` sesuai kontrak `DESIGN.md` 8.1), `/tentang` merender `EditorialLandingView` yang sudah dipecah menjadi modul (`AboutHero`, `AboutMechanism`, `AboutAggregatesAndFaq`), dan `/peta` melakukan `redirect("/")`.
- **Halaman Operasional (`/lapor`, `/laporan`, `/laporan/[id]`, `/dashboard`, `/antrean`, `/verifikasi`, `/admin`, `/darurat`):**
  - Ditambahkan rute `/laporan` (`PublicReportListView`).
  - Perbaikan token `--color-brick-*` di `app/globals.css`, penambahan landmark `<main id="main-content">` & skip-to-content di `app/layout.tsx`, tabel semantik + stacked mobile list, serta perbaikan `userId` antrean di `ReportForm.tsx`.
- **Remediasi Keamanan & Offline Queue:**
  - `lib/session-options.ts`: Mewajibkan `SESSION_SECRET` >= 32 karakter di production tanpa fallback statis.
  - `lib/security-headers.ts`, `next.config.ts`, `middleware.ts`: Menetapkan `Content-Security-Policy` (mengizinkan tile `https://*.tile.openstreetmap.org`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, dan `Referrer-Policy: strict-origin-when-cross-origin`.
  - `lib/offline-queue.ts` & `components/offline/OfflineQueueView.tsx`: `getOfflineQueue()` mengembalikan `[]` saat kosong; draf demo dipisah ke `loadDemoOfflineDraft()`.

## 3. File Penting
- `lib/session-options.ts`, `lib/session.ts`, `middleware.ts`
- `lib/security-headers.ts`, `next.config.ts`
- `lib/offline-queue.ts`, `components/offline/OfflineQueueView.tsx`, `components/report/ReportForm.tsx`
- `components/map/RootOperationalView.tsx`, `components/map/IntroBottomSheet.tsx`, `components/map/OperationalMap.tsx`
- `tests/security-config.test.ts`, `tests/offline-queue.test.ts`
- `.env.example`, `docs/FINAL-QA-REMEDIATION.md`

## 4. Hasil Validasi Terakhir
- `npm run typecheck`: PASS (0 error)
- `npm run lint`: PASS (0 error, 0 warning)
- `npm run test`: PASS (21 test files, 137 tests passed)
- `npm run build`: PASS
- `curl.exe` ke `npm run start`: Seluruh rute uji (`/`, `/tentang`, `/laporan`, `/login`, `/dashboard`, `/darurat`, `/peta`, `/lapor`) mengembalikan 4 header keamanan wajib tanpa duplikasi.

## 5. Batasan & Larangan
- Perubahan belum di-commit atau di-push (`git status` masih memiliki working changes lintas Fase 01–06 + remediasi).
- Jangan mengubah skema Prisma, aturan bisnis bagian 4 `AGENTS.md`, atau menambah skill/dependency tanpa izin tim.
- Jangan mencetak atau menulis nilai `SESSION_SECRET` asli ke log atau file contoh.

## 6. Instruksi untuk AI Agent Berikutnya
1. Baca `AGENTS.md`, `DESIGN.md`, dan `docs/FINAL-QA-REMEDIATION.md` sebelum memulai.
2. Lakukan **Browser QA** pada `http://localhost:3000` untuk viewport `360×800`, `768×1024`, dan `1280×800` (pastikan Chrome remote debugging sudah diizinkan oleh pengguna), periksa console browser bahwa CSP tidak memblokir tile OpenStreetMap atau aset Leaflet/Next.js.
3. Jika `DATABASE_URL` dan `DIRECT_URL` sudah disediakan di `.env`, lakukan **Database QA** untuk verifikasi end-to-end seluruh alur terautentikasi dan sinkronisasi antrean luring.
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
