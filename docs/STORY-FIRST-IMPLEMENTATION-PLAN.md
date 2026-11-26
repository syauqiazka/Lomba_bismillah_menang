# STORY-FIRST IMPLEMENTATION PLAN — TRASEC

Tanggal: 2026-11-26  
Status: Disetujui untuk Implementasi Bertahap (Phase 0 -> Phase 9)

---

## 1. Arsitektur Routing Baru

| Rute | Peran Sebelumnya | Peran Baru (Story-First) | Keterangan |
|---|---|---|---|
| `/` | Peta Operasional (`RootOperationalView`) | **Story-first Homepage** (`StoryFirstHomeView`) | Halaman utama editorial berbasis data laporan `VERIFIED`, menjelaskan kejadian, dampak, selisih kebutuhan, dan pratinjau peta. |
| `/peta` | Redirect ke `/` | **Operational Map** (`RootOperationalView`) | Memulihkan peta operasional penuh (filter, marker, drawer detail, bottom sheet pengantar, tabel teks, tombol darurat). |
| `/tentang` | Editorial Landing (`EditorialLandingView`) | **Tentang & Metodologi TRASEC** | Penjelasan identitas, metodologi 5W+1H, rumus selisih, dan prinsip non-finansial. |
| `/laporan/[id]`, `/dashboard`, `/darurat`, `/lapor`, `/antrean`, `/verifikasi`, `/admin`, `/login` | Rute operasional & privat | **Tetap dipertahankan utuh** | Tidak ada perubahan pada logika bisnis, RBAC, dan otorisasi. |

---

## 2. Urutan Pengalaman Homepage (`/`)

1. **Editorial Navigation** (`Navbar` dengan tautan Peta `/peta`, Tentang `/tentang`, Statistik `/dashboard`, Darurat `/darurat`, Lapor `/lapor`).
2. **Hero Story**: Pesan utama *"Ketahui apa yang terjadi. Pahami dampaknya."* dengan subheadline faktual dan dua CTA (*Jelajahi Laporan* `#laporan-terbaru` & *Buka Peta Operasional* `/peta`).
3. **Featured Incident**: Pemilihan deterministik 1 laporan `VERIFIED` prioritas tertinggi (`DARURAT` -> `MENDESAK` -> `TERENCANA` -> `updatedAt` terbaru -> kategori `LINGKUNGAN`/`BENCANA`), menampilkan Region, Category, Urgency, When, Verification Level, What, Who, Stale Status, dan badge `DEMO` eksplisit jika menggunakan data fallback.
4. **Incident Context (5W+1H Story)**: Narasi terstruktur berbasis data riil (`What`, `Who`, `Where`, `When`, `Why`, `How`) tanpa fabrikasi angka korban atau kronologi tambahan.
5. **Environmental & Humanitarian Reports**: Daftar laporan `VERIFIED` lainnya (lingkungan & kemanusiaan) dengan filter kategori ringan dan tautan ke `/laporan/[id]`.
6. **Impact Information**: Penjelasan dampak faktual berdasarkan data laporan yang tersedia dan agregat publik (`totalVerifiedReports`, `totalActiveRegions`, `totalConfirmedAidItems`), tanpa severity score buatan.
7. **Unmet Needs / Confirmed Aid**: Ditampilkan **eksklusif** jika laporan terpilih bertipe `KEBUTUHAN` — menampilkan `itemCategory`, `totalNeed`, `totalConfirmedAid`, `deficit`, `unit`, dan `percentageFulfilled` langsung dari server (`itemDeficits`). Untuk `PEMANTAUAN`, bagian ini disembunyikan.
8. **Operational Map Preview**: Ringkasan spasial titik wilayah aktif beserta CTA langsung menuju `/peta`.
9. **Verification & Transparency**: Penjelasan mekanisme verifikasi dua lapis (`COMMUNITY` / `OFFICIAL`) dan rumus deterministik Trust Score.
10. **CTA Report & Emergency Information**: Ajakan melapor (5W+1H) ke `/lapor` dan akses cepat kontak darurat resmi ke `/darurat`.
11. **Footer**: Navigasi bersih, atribusi non-finansial, dan tautan resmi.

---

## 3. Struktur Komponen Baru

- `components/home/StoryFirstHomeView.tsx`: Orkestrator Story-first Homepage dengan integrasi GSAP lazy-loaded dan `prefers-reduced-motion`.
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
- `lib/featured-incident.ts`: Fungsi deterministik murni untuk memilih *Featured Incident* (dapat diuji unit via Vitest).

---

## 4. Ketersediaan Data & Aset

### Data Tersedia (dari `lib/public-queries.ts` & `lib/fallback-data.ts`):
- `getPublicMapReports()`: Mengembalikan `PublicReportItem[]` (`status = "VERIFIED"`, koordinat kategori sensitif `LANSIA` & `KESEHATAN` sudah dibulatkan 2 desimal di server, `itemDeficits` sudah dihitung di server, `isStale` tersedia).
- `getPublicAggregates()`: Mengembalikan `totalVerifiedReports`, `totalPendingReports`, `totalActiveRegions`, `totalConfirmedAidItems`.
- Flag `isDemoMode`: Ditentukan di `app/page.tsx` (jika DB placeholder atau fallback digunakan) agar UI dapat menampilkan label `DEMO` secara jujur.

### Data / Aset yang Belum Tersedia:
- Belum ada file animasi `.lottie` (dotLottie) di `public/` — sesuai aturan Phase 4, tidak mengarang aset atau mengunduh sembarangan; komponen status UI eksisting tetap digunakan dan `@lottiefiles/dotlottie-react` tidak dipaksakan bila belum ada aset berlisensi.
- Belum ada foto spesifik per `Report.id` di skema database — foto dokumenter kurasi di `public/images/landing/` (`ASSET_CREDITS.md`) dipetakan secara tematik berdasarkan kategori laporan, dengan keterangan sumber yang jelas. Akan didokumentasikan di `docs/STORY-FIRST-ASSET-NEEDS.md`.

---

## 5. Strategi Motion, GSAP, dan dotLottie

- **Dependency Check:** `next@16.4.6`, `react@19.3.0`, `react-dom@19.3.0`.
- **Paket yang Dipasang:**
  - `motion`: Untuk transisi komponen UI interaktif (tab/filter laporan, accordion detail konteks, modal/drawer, status UI).
  - `gsap`: Untuk narasi scroll dan entrance editorial di homepage (`/`) menggunakan `dynamic import` di sisi klien, `gsap.context()`, dan `ScrollTrigger` yang menghormati `window.matchMedia("(prefers-reduced-motion: reduce)")`.
  - `@lottiefiles/dotlottie-react`: Ditunda / tidak dipasang pada tahap ini karena belum ada aset `.lottie` resmi berlisensi di `public/` (menghindari bloat dependensi tanpa aset).
- **Aturan Pemisahan:** GSAP dan Motion tidak menganimasikan elemen DOM yang sama. Pada mobile (<768px) dan saat `prefers-reduced-motion: reduce`, tidak ada pinning atau scroll hijacking; konten langsung terlihat penuh.

---

## 6. Daftar File yang Akan Diubah

1. `docs/STORY-FIRST-IMPLEMENTATION-PLAN.md` (baru)
2. `AGENTS.md` (Phase 1 — perbarui identitas, routing `/` & `/peta`, kebijakan motion & aset, tandai Opsi C sebagai SUPERSEDED)
3. `DESIGN.md` (Phase 1 — tambahkan spesifikasi Story-first experience, editorial visual direction, motion & GSAP, anti-slop)
4. `package.json` & `package-lock.json` (instalasi `motion` dan `gsap`)
5. `app/page.tsx` (Phase 2 & 3 — Story-first Homepage)
6. `app/peta/page.tsx` (Phase 2 — Operational Map menggunakan `RootOperationalView`)
7. `components/common/Navbar.tsx` (Phase 2 — pastikan link peta mengarah ke `/peta`)
8. `components/map/RootOperationalView.tsx` & `components/map/IntroBottomSheet.tsx` (Phase 2 — pastikan kompatibel dengan `/peta`)
9. `components/landing/EditorialLandingView.tsx` & `components/landing/sections/*` (Phase 2 — perbarui CTA peta dari `/` ke `/peta` agar `/tentang` konsisten)
10. `lib/featured-incident.ts` + `tests/featured-incident.test.ts` (Phase 3 & 8)
11. `components/home/*` (Phase 3 & 4)
12. `docs/STORY-FIRST-IMPLEMENTATION-REPORT.md`, `docs/STORY-FIRST-ASSET-NEEDS.md`, `docs/AI-AGENT-HANDOFF.md` (Phase 9)

---

## 7. Risiko Regresi & Mitigasi

- **Regresi Leaflet di `/peta`:** Pastikan `RootOperationalView` tetap membungkus `MapWrapper` (`dynamic(..., { ssr: false })`) tanpa memanggil `window` saat SSR.
- **Regresi GSAP & Hydration React 19:** Muat `gsap` dan `ScrollTrigger` hanya di dalam `useEffect` melalui `import("gsap")`, gunakan `gsap.context()` untuk cleanup, dan jangan menyembunyikan konten awal dengan `opacity: 0` sebelum JS termuat (agar konten langsung terbaca pada koneksi lambat & reduced motion).
- **Regresi Business Logic:** Nol perubahan pada `prisma/schema.prisma`, `app/actions/*`, `lib/access.ts`, `lib/calculations.ts`, `lib/trust-score.ts`, `lib/validators.ts`, `lib/offline-queue.ts`.
- **Kebocoran Data Demo:** Setiap data fallback wajib menampilkan badge `DEMO` yang jelas.

---

## 8. Acceptance Criteria

Mengacu penuh pada 12 butir *Final Acceptance Criteria*:
1. Root `/` benar-benar Story-first.
2. `/peta` menjadi Operational Map yang berfungsi penuh.
3. Tidak ada fitur lama yang hilang.
4. Alur pengunjung dapat dipahami tanpa panduan.
5. Data dan angka tidak dikarang.
6. Laporan `PENDING` tetap privat sesuai aturan.
7. Kebutuhan dan selisih hanya muncul pada `KEBUTUHAN`.
8. GSAP, Motion, dan kebijakan dotLottie memiliki peran terpisah yang jelas.
9. `prefers-reduced-motion` berfungsi penuh.
10. Performa mobile tidak dikorbankan.
11. `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` lulus 100%.
12. Dokumentasi diperbarui lengkap.

