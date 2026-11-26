# STORY-FIRST IMPLEMENTATION REPORT — TRASEC

Tanggal: 2026-11-26  
Status: **Selesai (Menunggu Verifikasi Browser QA oleh Tim)**

---

## 1. Ringkasan Perubahan Routing (Sebelum vs Sesudah)

| Rute | Sebelumnya | Sesudahnya |
|---|---|---|
| `/` | Peta Operasional (`RootOperationalView`) | **Story-first Homepage** (`StoryFirstHomeView`) |
| `/peta` | Redirect ke `/` | **Operational Map** (`RootOperationalView` — Leaflet, filter, drawer, bottom sheet, tabel teks, tombol darurat) |
| `/tentang` | Editorial Landing (`EditorialLandingView`) | Tetap halaman penjelasan produk & metodologi (seluruh tautan CTA peta diarahkan ke `/peta`) |
| Rute lainnya | `/laporan/[id]`, `/dashboard`, `/darurat`, `/lapor`, `/antrean`, `/verifikasi`, `/admin`, `/login` | Dipertahankan utuh tanpa perubahan business logic |

---

## 2. Daftar Berkas yang Diubah & Dibuat

### Berkas Diubah:
- `AGENTS.md` — Pembaruan identitas produk, routing `/` & `/peta`, kebijakan motion (`motion` + `gsap` + `dotLottie`), pengelolaan aset, dan penandaan Opsi C pada `/` sebagai `SUPERSEDED`.
- `DESIGN.md` — Penambahan spesifikasi Story-first experience, hierarki 11 seksi, incident storytelling, Motion & GSAP, serta `prefers-reduced-motion`.
- `package.json` & `package-lock.json` — Penambahan `motion` dan `gsap` (tanpa mengubah versi Next.js `16.4.6` maupun React `19.3.0`).
- `app/page.tsx` — Merender `StoryFirstHomeView` dengan flag `isDemoMode` eksplisit jika menggunakan data fallback.
- `app/peta/page.tsx` — Memulihkan `RootOperationalView` lengkap pada rute `/peta`.
- `components/common/Navbar.tsx` — Penambahan tautan `Peta` (`/peta`) dan penyesuaian label beranda (`/`).
- `app/lapor/page.tsx`, `components/report/ReportForm.tsx`, dan `components/landing/sections/*` — Penyesuaian tautan peta dari `/` ke `/peta`.

### Berkas Baru:
- `lib/featured-incident.ts` — Selektor *Featured Incident* deterministik (`DARURAT` -> `MENDESAK` -> `TERENCANA` -> `updatedAt` -> `LINGKUNGAN`/`BENCANA`) & pemetaan foto tematik arsip kurasi.
- `tests/featured-incident.test.ts` — 5 unit test deterministik untuk `lib/featured-incident.ts`.
- `components/home/StoryFirstHomeView.tsx` — Orkestrator Story-first Homepage dengan `<MotionConfig reducedMotion="user">` dan lazy-loaded GSAP ScrollTrigger.
- `components/home/sections/HeroStorySection.tsx`
- `components/home/sections/FeaturedIncidentSection.tsx`
- `components/home/sections/IncidentContextSection.tsx`
- `components/home/sections/ReportsArchiveSection.tsx`
- `components/home/sections/ImpactSummarySection.tsx`
- `components/home/sections/UnmetNeedsSection.tsx`
- `components/home/sections/MapPreviewSection.tsx`
- `components/home/sections/TransparencySection.tsx`
- `components/home/sections/HomeCtaSection.tsx`
- `components/home/sections/HomeFooter.tsx`
- `docs/STORY-FIRST-IMPLEMENTATION-PLAN.md`
- `docs/STORY-FIRST-IMPLEMENTATION-REPORT.md`
- `docs/STORY-FIRST-ASSET-NEEDS.md`
- `docs/AI-AGENT-HANDOFF.md`

---

## 3. Dependensi Baru & Alasan

| Paket | Alasan Penggunaan | Catatan Bundle |
|---|---|---|
| `motion` | Transisi UI interaktif: filter kategori pada `ReportsArchiveSection` dan accordion pada `TransparencySection`. | Dibungkus `<MotionConfig reducedMotion="user">`. |
| `gsap` | Narasi scroll khusus homepage (`/`): hero entrance, scroll progress bar, featured reveal, dan story-step stagger. | Dimuat secara dinamis (*dynamic import*) hanya di sisi klien, tidak memblokir initial load, dan dilewati otomatis bila `prefers-reduced-motion: reduce` aktif. |

`@lottiefiles/dotlottie-react` **tidak dipasang** karena belum tersedia aset `.lottie` resmi berlisensi di `public/` (menghindari bloat dependensi tanpa aset).

---

## 4. Strategi Motion per Seksi

- **Navbar & Scroll Progress (`StoryFirstHomeView`)**: GSAP ScrollTrigger `scaleX` (hanya transform GPU).
- **Hero Story (`HeroStorySection`)**: GSAP `hero-stagger` (`y: 14`, `opacity: 0`, `clearProps`).
- **Featured Incident (`FeaturedIncidentSection`)**: GSAP `featured-card` ScrollTrigger (`once: true`).
- **Incident Context 5W+1H (`IncidentContextSection`)**: GSAP `story-step` stagger hanya pada viewport `>= 768px`.
- **Reports Archive (`ReportsArchiveSection`)**: `motion/react` `AnimatePresence` saat pergantian filter kategori.
- **Verification & Transparency (`TransparencySection`)**: `motion/react` transisi buka-tutup accordion.

---

## 5. Business Logic yang Dipertahankan (Zero Changes)

Seluruh logika inti tidak diubah sama sekali:
- `prisma/schema.prisma`, `app/actions/*`, `lib/access.ts`, `lib/calculations.ts`, `lib/trust-score.ts`, `lib/validators.ts`, `lib/offline-queue.ts`, `lib/session.ts`, dan `lib/public-queries.ts` (kecuali membaca hasilnya untuk tampilan).
- Laporan `PENDING` tetap privat (hanya tampil sebagai angka agregat `totalPendingReports`).
- Bagian `UnmetNeedsSection` hanya tampil pada tipe `KEBUTUHAN` dan memakai kalkulasi `itemDeficits` dari server.

---

## 6. Hasil Pengujian

| Perintah | Hasil | Catatan |
|---|---|---|
| `npm run typecheck` | **LULUS (0 error)** | TypeScript strict mode (`tsc --noEmit`). |
| `npm run lint` | **LULUS (0 error, 0 warning)** | ESLint bersih. |
| `npm run test` | **LULUS (21 files, 131 tests passed)** | Termasuk 5 tes baru `tests/featured-incident.test.ts`. |
| `npm run build` | **LULUS (Exit code 0)** | Next.js 16.4.6 Turbopack; rute `/`, `/peta`, `/tentang`, dan seluruh rute lainnya terkompilasi. |
| Browser QA (360×800, 768×1024, 1280×800, Reduced Motion) | **BLOCKED** | Belum dijalankan melalui inspeksi visual browser interaktif; perlu verifikasi manual oleh tim pada `npm run dev` / `npm run start`. |

---

## 7. Risiko Tersisa

1. **Verifikasi Visual Browser Nyata**: Perilaku animasi GSAP ScrollTrigger dan tampilan responsif pada viewport 360×800, 768×1024, dan 1280×800 baru diverifikasi via kode & kompilasi, belum melalui tangkapan layar browser langsung.
2. **Aset Foto Spesifik Laporan**: Saat ini foto menggunakan arsip kurasi tematik berlabel (`ASSET_CREDITS.md`) karena skema database `Report` belum menyimpan URL foto per kejadian.

