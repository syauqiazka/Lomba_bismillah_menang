# TRASEC — Final QA Remediation Report

Tanggal: 2026-11-25

---

## 1. Ringkasan Ketiga Temuan

1. **Temuan #1 (`SESSION_SECRET`):** `lib/session-options.ts` sebelumnya menggunakan fallback secret statis bahkan ketika `NODE_ENV === "production"`, sehingga berisiko pemalsuan cookie sesi apabila variabel lingkungan `SESSION_SECRET` lupa dikonfigurasi.
2. **Temuan #2 (HTTP Security Headers):** `next.config.ts` dan `middleware.ts` sebelumnya belum menetapkan header keamanan wajib `AGENTS.md` Bagian 8.1 (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`).
3. **Temuan #3 (Offline Queue):** `lib/offline-queue.ts` (`getOfflineQueue(userId)`) sebelumnya menyisipkan 1 draf fiktif (`draft-sample-cjr-01`) secara otomatis ketika `localStorage` kosong.

---

## 2. Status Setiap Temuan

| # | Temuan | Status |
|---|---|---|
| 1 | `SESSION_SECRET` wajib di production tanpa fallback statis | **FIXED** |
| 2 | HTTP Security Headers & CSP berbasis kebutuhan aktual | **FIXED** |
| 3 | `getOfflineQueue(userId)` mengembalikan `[]` saat kosong tanpa menyisipkan data contoh | **FIXED** |

---

## 3. Daftar File yang Diubah / Ditambahkan

- `lib/session-options.ts` — Menghapus fallback statis di production; menambah `resolveSessionPassword` (validasi panjang >= 32 karakter) dan `getSessionOptions`, serta getter `password` pada `sessionOptions` agar build statis tidak gagal sebelum env runtime tersedia.
- `lib/security-headers.ts` *(baru)* — Sumber tunggal kebijakan CSP (`buildContentSecurityPolicy`) dan header keamanan (`getSecurityHeaders`).
- `next.config.ts` — Menambahkan `headers()` untuk seluruh rute `/(.*)`.
- `middleware.ts` — Menerapkan `getSecurityHeaders()` pada respons early-return (`redirect` / `403`) agar tidak terlewat tanpa menduplikasi `NextResponse.next()`.
- `lib/offline-queue.ts` — Menghapus penyisipan draf contoh otomatis di `getOfflineQueue()`; memisahkan mekanisme demo eksplisit ke `loadDemoOfflineDraft()`.
- `components/offline/OfflineQueueView.tsx` — Menambahkan tombol eksplisit `"Muat Contoh Draf Demo"` pada state antrean kosong.
- `tests/security-config.test.ts` *(baru)* — Unit test konfigurasi `SESSION_SECRET` dan HTTP Security Headers / CSP.
- `tests/offline-queue.test.ts` — Penambahan unit test untuk `localStorage` kosong, pengguna baru, data korup, pemanggilan berulang, dan `loadDemoOfflineDraft`.
- `.env.example` — Dokumentasi `SESSION_SECRET` wajib di production beserta cara pembuatan secret aman.
- `docs/FINAL-QA-REMEDIATION.md` & `docs/AI-AGENT-HANDOFF.md` *(baru)* — Laporan remediasi dan handoff agen.

---

## 4. Penjelasan Perubahan

- **`SESSION_SECRET`:** `resolveSessionPassword()` mewajibkan `SESSION_SECRET` dengan panjang minimal 32 karakter (sesuai kebutuhan `iron-session` v9.1.0) saat `NODE_ENV === "production"`, dan melempar `Error` eksplisit jika tidak ada atau terlalu pendek. Fallback non-production hanya diizinkan saat `development` atau `test`. Dengan memakai getter pada `sessionOptions.password`, `next build` tetap berjalan saat env runtime belum disuntikkan, sementara eksekusi sesi di production tetap terproteksi.
- **CSP & Security Headers:** Kebijakan CSP disesuaikan dengan kebutuhan aktual aplikasi:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline'` pada production (`'unsafe-eval'` hanya di non-production untuk HMR/dev)
  - `style-src 'self' 'unsafe-inline'` (untuk Leaflet CSS & inline styles Next.js)
  - `img-src 'self' data: blob: https://*.tile.openstreetmap.org` (untuk tile OpenStreetMap dan pratinjau kompresi foto canvas)
  - `font-src 'self' data:` (system font stack)
  - `connect-src 'self'` pada production (`ws: wss:` hanya di non-production)
  - `worker-src 'self' blob:`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
- **Offline Queue:** `getOfflineQueue(userId)` murni bersifat *read-only* dan mengembalikan `[]` jika `localStorage` kosong atau korup. Isolasi per `userId`, idempotency `clientId`, serta penyimpanan status `GAGAL` dan `errorMessage` dipertahankan.

---

## 5. Pengujian yang Benar-benar Dijalankan

- `npm run typecheck` (`tsc --noEmit`)
- `npm run lint` (`eslint`)
- `npm run test` (`vitest run`)
- `npm run build` (`next build`)
- Verifikasi HTTP response headers dengan `curl.exe -s -D - -o NUL` terhadap server produksi lokal (`npm run start`) pada `/`, `/tentang`, `/laporan`, `/login`, `/dashboard`, `/darurat`, `/peta`, dan `/lapor`.

---

## 6. Hasil Typecheck, Lint, Test, dan Build

| Pemeriksaan | Hasil | Detail |
|---|---|---|
| `npm run typecheck` | **PASS** | Exit code `0`, 0 error |
| `npm run lint` | **PASS** | Exit code `0`, 0 error, 0 warning |
| `npm run test` | **PASS** | **21 test files passed (137/137 tests passed)** |
| `npm run build` | **PASS** | Exit code `0`, seluruh rute terkompilasi (log `DATABASE_URL` tidak ditemukan ditangani oleh fallback demo) |

---

## 7. Hasil Pemeriksaan HTTP Headers (`curl.exe`)

Seluruh rute yang diuji (`/`, `/tentang`, `/laporan`, `/login`, `/dashboard`, `/darurat` dengan `200 OK`, serta `/peta` dan `/lapor` dengan `307 Temporary Redirect`) mengembalikan keempat header berikut tanpa duplikasi:
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.tile.openstreetmap.org; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 8. Risiko yang Masih Tersisa

- `script-src` dan `style-src` masih menggunakan `'unsafe-inline'` karena Next.js App Router hydration & Leaflet CSS tanpa mekanisme nonce per-request. Jika di masa depan dibutuhkan CSP ketat tanpa `'unsafe-inline'`, perlu migrasi ke middleware nonce dinamis (konsekuensi: seluruh halaman menjadi dynamic rendering).
- Browser QA dan Database QA belum berjalan karena remote debugging Chrome belum diizinkan dan `DATABASE_URL` belum dikonfigurasi di lingkungan lokal.

---

## 9. Environment Variable Saat Deployment

| Variabel | Wajib di Production | Keterangan |
|---|---|---|
| `SESSION_SECRET` | **Ya** | Minimal 32 karakter acak untuk enkripsi cookie `iron-session`. Buat dengan `openssl rand -hex 32`. |
| `DATABASE_URL` | **Ya** | Connection string pooling PostgreSQL (Neon). |
| `DIRECT_URL` | **Ya** | Direct connection string PostgreSQL untuk migrasi Prisma. |
| `NODE_ENV` | **Ya** | Atur ke `production`. |
| `AI_API_KEY` | Opsional | Kunci API Gemini untuk fitur asisten perapih 5W+1H server-side. |

---

## 10. Daftar Pekerjaan Lanjutan (Browser QA & Database QA)

1. **Browser QA (Chrome DevTools):**
   - Aktifkan remote debugging Chrome (`Allow` pada dialog *"Allow remote debugging?"* atau `chrome://inspect/#remote-debugging`).
   - Uji seluruh rute pada `360×800`, `768×1024`, dan `1280×800`: rendering peta Leaflet & tile OSM (pastikan tidak ada blokir CSP di console), `IntroBottomSheet` (tutup `Escape`, focus restoration ke tombol Panduan, swipe-down mobile), `ReportDetailDrawer`, `TextTableView`, `FloatingEmergencyButton`, dan `OfflineQueueView`.
   - Jalankan audit Lighthouse & axe-core.
2. **Database QA:**
   - Siapkan `.env` dengan `DATABASE_URL` dan `DIRECT_URL` yang valid, jalankan migrasi & seed (`npx prisma db push && npx prisma db seed`), lalu uji login 4 peran, alur `/lapor`, `/verifikasi`, `/admin`, `/laporan/[id]` (`RecordAidModal`), dan sinkronisasi antrean luring ke database riil.
