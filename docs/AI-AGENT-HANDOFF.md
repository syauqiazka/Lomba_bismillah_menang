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

