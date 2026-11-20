# TRASEC — Humanitarian Intelligence Platform Indonesia

> **Platform Transparansi Logistik Kemanusiaan & Penghitung Selisih Bantuan Lapangan Bebas Penumpukan.**  
> Proyek untuk **Traspac Competition 2026** (Kategori Web Development).

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=next.js)](https://nextjs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-126%20Passed-brightgreen?logo=vitest)](https://vitest.dev/)
[![License: OpenStreetMap](https://img.shields.io/badge/Map-OpenStreetMap-green?logo=openstreetmap)](https://www.openstreetmap.org/)
[![Design Standard](https://img.shields.io/badge/Anti--Slop-Compliant-success)](#standar-desain--anti-slop)

---

## 📌 Ringkasan Eksekutif

Dalam operasi kemanusiaan dan penanganan krisis lingkungan di Indonesia, informasi kebutuhan lapangan dan bantuan yang masuk tersebar di kanal-kanal tidak resmi, simpang siur, berulang, atau basi. Akibatnya terjadi **paradoks penumpukan bantuan**: barang logistik (seperti mi instan dan pakaian bekas) menumpuk berlebih di posko dekat jalan raya utama, sementara posko-posko pedalaman kekurangan air bersih, makanan bayi, obat-obatan esensial, dan tenda ramah lansia.

**TRASEC** hadir bukan sebagai platform penggalangan dana finansial (crowdfunding), melainkan sebagai **sistem intelijen logistik kemanusiaan terbuka** yang menghitung dan menyajikan **selisih transparan** antara kebutuhan warga terdampak dan bantuan fisik yang telah terkonfirmasi (`CONFIRMED`) per lokasi dan per satuan ukur di seluruh Indonesia.

$$\text{Selisih} = \max(0, \sum \text{Need.qty} - \sum \text{Aid.qty (CONFIRMED)})$$

Setiap kali kuota suatu barang terpenuhi ($\text{Selisih} = 0$), sistem secara cerdas memperingatkan relawan agar mengalihkan logistik ke wilayah lain yang masih mengalami defisit.

---

## 🚀 Panduan Menjalankan Proyek (Easy Development — 10 Poin)

Aplikasi dirancang agar dapat diuji oleh dewan juri dalam **2-3 langkah mudah via terminal**:

### 1. Prasyarat
- **Node.js** v20.x atau lebih baru
- **npm** v10.x atau lebih baru

### 2. Instalasi & Menjalankan Lokal

```bash
# 1. Klon repositori dan masuk ke direktori
git clone https://github.com/trasec-lomba/trasec-humanitarian-platform.git
cd trasec-humanitarian-platform

# 2. Pasang dependensi
npm install

# 3. Siapkan environment (File .env sudah dilengkapi fallback siap jalan)
cp .env.example .env

# 4. Jalankan server pengembangan
npm run dev
```

Buka peramban di: **[http://localhost:3000](http://localhost:3000)**

> [!NOTE]
> **Siap Demo Tanpa Konfigurasi Database Rumit:**  
> Jika database Neon PostgreSQL tidak terhubung atau jaringan lokal terbatas, aplikasi secara otomatis mengaktifkan lapisan **High-Fidelity Demonstration Fallback** (`lib/fallback-data.ts`). Seluruh fitur peta, filter selisih, formulir 5W+1H, drawer detail, dan otentikasi dapat diuji 100% tanpa hambatan.

### 3. Perintah Pengujian & Kualitas Kode

```bash
# Menjalankan 126 Unit & Logic Tests via Vitest
npm test

# Menjalankan Pengecekan Type Strict TypeScript
npm run typecheck

# Menjalankan Audit Linter ESLint (0 errors, 0 warnings)
npm run lint

# Menjalankan Kompilasi Build Produksi Next.js
npm run build
```

---

## 🔑 Akun Uji Coba Cepat untuk Dewan Juri (1-Click Login)

Pada halaman masuk **`/login`**, tersedia 4 tombol akses cepat (*demo pills*) agar dewan juri dapat menguji seluruh hak akses RBAC tanpa mengetik manual:

| Peran | Email | Kata Sandi | Hak Akses Utama |
|---|---|---|---|
| 👑 **Administrator** | `admin@trasec.id` | `AdminTrasec2026!` | Manajemen pengguna, verifikasi lembaga organisasi, audit riwayat sistem, dan master data. |
| 🔍 **Verifikator Komunitas** | `verifikator.komunitas@trasec.id` | `Verifikator2026!` | Antrean verifikasi laporan (`/verifikasi`), penelaahan bukti 5W+1H, persetujuan/penolakan dengan alasan tertulis. |
| 🏢 **Verifikator Lembaga (PMI)** | `pmi.verifikator@trasec.id` | `Verifikator2026!` | Verifikasi tingkat `OFFICIAL` yang langsung memvalidasi laporan posko ke peta publik. |
| 🤝 **Relawan Terpercaya** | `dewi.relawan@trasec.id` | `Relawan2026!` | Pelaporan kebutuhan baru (`/lapor`), pencatatan logistik masuk (`Aid`), dan kontak koordinator lapangan. |
| 🌐 **Publik (Tanpa Login)** | *(Pengunjung Anonim)* | — | Peta spasial publik (`/peta`), landing page editorial (`/`), statistik agregat (`/dashboard`), nomor darurat (`/darurat`). |

---

## 🧭 Struktur Rute Aplikasi

- **`/`**: Landing Page Editorial Kemanusiaan (12 seksi lengkap ala KIN DORA: watermark tipografi, kolase asimetris 3 foto, progress bar keterpenuhan kategori, galeri aksi nyata, banner statistik relawan, pita marquee emas, dan catatan verifikator).
- **`/peta`**: Peta Operasional Selisih Kemanusiaan Layar Penuh (Basemap Leaflet OpenStreetMap bebas watermark, filter status selisih, drawer detail laporan, dan bottom sheet panduan orientasi Opsi C).
- **`/lapor`**: Formulir pelaporan kebutuhan terstruktur 5W+1H dilengkapi kompresi foto canvas, sanitasi EXIF kamera di browser, dan bantuan AI perapih laporan (opsional).
- **`/antrean`**: Modul pemantauan antrean pengiriman luring (*Offline-First Queue*) berbasis IndexedDB untuk wilayah blank spot sinyal.
- **`/verifikasi`**: Modul kerja verifikator untuk menelaah bukti laporan, melihat transparansi rincian skor kepercayaan (0-100), dan menetapkan keputusan.
- **`/dashboard`**: Dashboard analitik statistik publik yang menyajikan agregasi kebutuhan, sebaran wilayah, dan efisiensi logistik nasional.
- **`/darurat`**: Halaman kontak darurat nasional terverifikasi (112, 115 Basarnas, 117 BNPB, 119 Kemenkes, PMI) yang dapat dibuka secara luring.

---

## 🏛️ Arsitektur Logika & Keunggulan Teknis

Penilaian teknis menjawab 9 kriteria evaluasi Traspac Competition:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRASEC SYSTEM ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
      [ CLIENT / BROWSER ]                       [ SERVER / NEXT.JS ]
  - Leaflet OSM (Zero Watermark)             - Route Handlers & Server Actions
  - Client-Side EXIF Sanitization            - Strict RBAC Middleware
  - Offline Queue (idb / IndexedDB)          - Zod Validation Schemas
  - Editorial Motion & RevealOnScroll        - Deterministic Trust Score (0-100)
                 │                                         │
                 └────────────────────┬────────────────────┘
                                      │
                                      ▼
                        [ DATABASE / POSTGRESQL ]
                    - Neon Serverless PostgreSQL
                    - Serializable Isolation ($transaction)
                    - Anti-Fan-Out SQL Aggregations
                    - Coordinates Obfuscation for Sensitive Categories
```

### 1. Logika Kode — Agregasi Selisih Tanpa Fan-Out (15%)
Sistem secara tegas melarang penjumlahan kuantitas antar-satuan yang berbeda (misal: 100 *kotak* tidak boleh dijumlahkan dengan 50 *karung*). Agregasi selisih dihitung per pasangan unik `(itemCategory, unit)` menggunakan sub-kueri terisolasi untuk mencegah anomali *fan-out* join:

```sql
SELECT 
  n.item_category,
  n.unit,
  SUM(n.qty) AS total_kebutuhan,
  COALESCE(a.total_terkonfirmasi, 0) AS total_bantuan,
  GREATEST(0, SUM(n.qty) - COALESCE(a.total_terkonfirmasi, 0)) AS selisih
FROM "Need" n
LEFT JOIN (
  SELECT "reportId", item_category, unit, SUM(qty) AS total_terkonfirmasi
  FROM "Aid"
  WHERE status = 'CONFIRMED'
  GROUP BY "reportId", item_category, unit
) a ON a."reportId" = n."reportId" 
   AND a.item_category = n.item_category 
   AND a.unit = n.unit
WHERE n."reportId" = $1
GROUP BY n.item_category, n.unit, a.total_terkonfirmasi;
```

### 2. Penggunaan Database & Proteksi Race Condition (10%)
Pencatatan bantuan relawan (`Aid`) dilindungi oleh transaksi berlevel isolasi tinggi (`prisma.$transaction`) dengan penguncian baris. Ini menjamin dua relawan yang menyalurkan bantuan secara bersamaan di lokasi berbeda tidak akan menyebabkan alokasi melebihi kuota sisa yang sebenarnya (*concurrency-safe*).

### 3. Keamanan Aplikasi & Privasi Korban (10%)
- **Proteksi IDOR**: Endpoint entitas privat yang tidak berhak diakses mengembalikan respon `404 Not Found` (bukan `403`) untuk mencegah teknik *resource enumeration*.
- **Otentikasi Stateless Terenkripsi**: Menggunakan `iron-session` berbasis sealed HTTP-only cookies dengan algoritma AES-256-GCM.
- **Pengaburan Koordinat Sensitif**: Laporan kategori rentan (`LANSIA` dan `KESEHATAN`) otomatis dibulatkan koordinat GPS-nya ke 2 desimal (~1,1 km) di lapisan database server publik guna melindungi privasi tempat tinggal warga rentan.
- **Sanitasi EXIF Browser**: Metadata koordinat GPS dari kamera ponsel pelapor dibersihkan secara lokal melalui Canvas API sebelum berkas diunggah ke server.

### 4. Performa & Kemandirian Peta (10%)
- Menggunakan layer **OpenStreetMap Standard** (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- 100% bebas biaya selamanya, **tanpa API key pihak ketiga**, **bebas watermark lisensi**, dan sangat hemat kuota internet di koneksi 3G/blank spot.

### 5. Arsitektur Pengiriman Luring / Offline-First (Tingkat 2)
Ketika relawan berada di area blank spot bencana tanpa sinyal internet:
- Laporan disimpan ke penyimpanan lokal browser berbasis **IndexedDB** (`idb`).
- Diberikan pengenal `clientId` bertipe UUID v4.
- Saat koneksi internet kembali pulih, antrean otomatis disinkronkan ke server secara **idempoten** (pengiriman berulang tidak menghasilkan data duplikat).

### 6. Skor Kepercayaan Deterministik (Trust Score 0-100)
Skor kepercayaan dihitung secara matematis di server tanpa black-box AI:
- Lampiran foto bukti lapangan: `+30 poin`
- Terdapat laporan mandiri relawan lain dalam radius 2 km: `+20 poin`
- Pelapor terverifikasi (*trusted volunteer*): `+20 poin`
- Kelengkapan narasi 5W+1H: `+15 poin`
- Akun dengan nomor kontak terverifikasi: `+15 poin`
- **Transparansi Penuh**: Antarmuka menyajikan daftar butir alasan penambah/pengurang skor secara terbuka kepada verifikator.

---

## 🎨 Standar Desain & Anti-Slop (`DESIGN.md`)

Antarmuka TRASEC dibangun dengan prinsip editorial kemanusiaan yang berakar pada martabat manusia, kontras tinggi, dan fungsionalitas nyata:

1. **Bebas Generic AI Slop**: Tidak ada gradien neon ungu dekoratif, tidak ada glassmorphism buram yang memberatkan rendering GPU ponsel murah, dan tidak ada angka statistik palsu.
2. **Foto Dokumenter Riil Indonesia**: Menggunakan 9 foto dokumenter aksi nyata gotong royong masyarakat (normalisasi Sungai Cikapundung, posko PMI, penanaman pohon, distribusi hygiene kit) yang bermartabat dan bebas eksploitasi penderitaan.
3. **Aksesibilitas Kontras (WCAG 2.2 AA)**: Rasio kontras teks utama `#172B3A` mencapai 14,55:1 terhadap latar putih, nyaman dibaca relawan di bawah terik matahari lapangan.
4. **Motion Bertanggung Jawab**: Animasi scroll-reveal dan bilah progress dibangun ringan dengan CSS hardware-accelerated dan otomatis menonaktifkan diri pada setelan `prefers-reduced-motion: reduce`.

---

## 📊 Matriks Kategori Kebutuhan

| Kategori | Sifat | Satuan Contoh | Kebijakan Privasi |
|---|---|---|---|
| `BENCANA` | Darurat | Tenda peleton, velbed, makanan siap saji, air bersih | Koordinat akurat ditampilkan ke publik |
| `LINGKUNGAN` | Aksi Nyata | Karung sampah, sepatu bot, cangkul, bibit mangrove | Koordinat akurat ditampilkan ke publik |
| `LANSIA` | Mendesak | Popok dewasa, kursi roda, susu nutrisi, selimut | **Koordinat dikaburkan radius 1,1 km di server** |
| `KESEHATAN` | Mendesak | Paket hygiene kit, perban steril, kaporit disinfeksi | **Koordinat dikaburkan radius 1,1 km di server** |
| `PENDIDIKAN` | Terencana | Paket buku tulis, seragam darurat, tenda sekolah | Koordinat akurat ditampilkan ke publik |
| `SOSIAL_LAINNYA` | Komunitas | Beras posko, tabung gas dapur umum, pakaian bersih | Koordinat akurat ditampilkan ke publik |

---

## ⚖️ Posisi Solusi Terhadap Platform Lain

| Platform | Fokus Utama | Keterbatasan yang Dijawab TRASEC |
|---|---|---|
| **InaRISK (BNPB)** | Peta potensi bahaya & zonasi risiko bencana | Tidak memantau logistik kebutuhan dan selisih penyaluran relawan di lapangan. |
| **Indorelawan** | Penjaringan dan pendaftaran sukarelawan | Tidak berfokus pada pelaporan selisih barang logistik riil per posko koordinasi. |
| **PetaBencana.id** | Urun daya warga untuk kejadian banjir secara real-time | Berfokus pada pantauan kejadian; tidak mengelola selisih logistik bantuan dan isu sosial harian. |
| **Kitabisa** | Crowdfunding / penggalangan dana publik | Berfokus pada transaksi uang; TRASEC **bebas uang** dan murni mencatat fisik barang/tenaga relawan. |

---

## 🧪 Hasil Pengujian Sistem (Test Suite)

Pengujian logika inti, aturan bisnis, dan keamanan dijalankan menggunakan **Vitest**:

```text
 ✓ tests/image-compression.test.ts (2 tests)
 ✓ tests/offline-queue.test.ts (5 tests)
 ✓ tests/access.test.ts (19 tests)
 ✓ tests/public-queries.test.ts (7 tests)
 ✓ tests/aid-transaction.test.ts (9 tests)
 ✓ tests/emergency-queries.test.ts (3 tests)
 ✓ tests/report-transitions.test.ts (11 tests)
 ✓ tests/dashboard-queries.test.ts (3 tests)
 ✓ tests/trust-score.test.ts (4 tests)
 ✓ tests/calculations.test.ts (5 tests)
 ✓ tests/root-page.test.ts (5 tests)
 ✓ tests/aid-actions.test.ts (3 tests)
 ✓ tests/admin-actions.test.ts (4 tests)
 ✓ tests/sanity.test.ts (2 tests)
 ✓ tests/ai-actions.test.ts (5 tests)
 ✓ tests/validators.test.ts (9 tests)
 ✓ tests/report-actions.test.ts (5 tests)
 ✓ tests/auth-actions.test.ts (7 tests)
 ✓ tests/verification-actions.test.ts (11 tests)
 ✓ tests/auth.test.ts (7 tests)

 Test Files  20 passed (20)
      Tests  126 passed (126)
   Duration  ~1.5s
```

---

## 📁 Struktur Direktori Proyek

```text
trasec_lomba/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions (Auth, Report, Aid, Verifikasi, AI)
│   ├── admin/                    # Modul Panel Administrator Sistem
│   ├── antrean/                  # Antrean Pengiriman Luring (Offline Queue)
│   ├── darurat/                  # Halaman Kontak Darurat Nasional
│   ├── dashboard/                # Dashboard Statistik Publik
│   ├── lapor/                    # Formulir Pelaporan Kebutuhan 5W+1H
│   ├── laporan/[id]/             # Detail Laporan & Selisih Logistik
│   ├── login/                    # Autentikasi Masuk & 1-Click Demo Juri
│   ├── peta/                     # Peta Operasional Layar Penuh (Opsi C)
│   ├── page.tsx                  # Landing Page Editorial (12 Seksi KIN DORA)
│   └── globals.css               # Token Desain & Animasi Keyframes
├── components/                   # Komponen Antarmuka Terisolasi
│   ├── auth/                     # Formulir Masuk & Registrasi Relawan
│   ├── common/                   # Navbar, Tombol Darurat, Status Banner
│   ├── dashboard/                # Visualisasi Statistik Agregat
│   ├── landing/                  # EditorialLandingView & RevealOnScroll
│   ├── map/                      # Leaflet OperationalMap & RootOperationalView
│   ├── offline/                  # OfflineQueueViewer
│   └── report/                   # Form Lapor, RecordAidModal, Verification
├── lib/                          # Modul Logika Bisnis & Utilitas Inti
│   ├── calculations.ts           # Logika Matematis Perhitungan Selisih
│   ├── fallback-data.ts          # Lapisan Data Demonstrasi Siap Saji
│   ├── image-compression.ts      # Kompresi Canvas & Sanitasi EXIF Browser
│   ├── offline-queue.ts          # IndexedDB Store & Sinkronisasi Idempoten
│   ├── prisma.ts                 # Prisma Client Singleton
│   ├── public-queries.ts         # Filter Server Ketat Data Publik VERIFIED
│   ├── session.ts                # Manajemen Sesi Terenkripsi iron-session
│   ├── trust-score.ts            # Formula Skor Kepercayaan Deterministik
│   └── validators.ts             # Skema Validasi Bersama Zod
├── prisma/                       # Skema Database & Migrasi Prisma
│   └── schema.prisma             # Skema Relasional (User, Region, Report, Need, Aid, dll)
├── public/images/landing/        # Aset Foto Dokumenter Riil Indonesia & Atribusi
├── tests/                        # 20 Test Suites Unit & Integration Vitest
├── AGENTS.md                     # Sumber Kebenaran Aturan Bisnis & Arsitektur
├── DESIGN.md                     # Sumber Kebenaran Sistem Desain & Visual Tokens
└── README.md                     # Dokumentasi Resmi Proyek
```

---

## 👥 Pengembang & Lisensi

- **Pengembang:** Pengembang Solo (1-Person Team) untuk **Traspac Competition 2026**.
- **Data Peta:** &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL).
- **Aset Foto:** Dokumentasi aksi relawan kemanusiaan dan kebersihan lingkungan Indonesia (rincian lisensi tersedia di [ASSET_CREDITS.md](public/images/landing/ASSET_CREDITS.md)).
- **Lisensi Perangkat Lunak:** MIT License.
