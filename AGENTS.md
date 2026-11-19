# AGENTS.md

Pedoman operasional untuk agen AI dan anggota tim yang mengerjakan proyek ini.
Tampilan, rasa, dan interaksi ada di `DESIGN.md`. Dokumen ini mengatur **cara bekerja, aturan bisnis, arsitektur, keamanan, SEO, testing, dan kualitas**.

Terakhir diperbarui: 2026-11-19.

---

## 1. Cara memakai dokumen ini

### 1.1 Legenda status keputusan

| Tanda | Arti |
|---|---|
| (tanpa tanda) | **FINAL.** Sudah diputuskan tim. Tidak boleh diubah agen tanpa izin tertulis tim. |
| `SEMENTARA` | Usulan kerja teknis. Boleh dipakai sebagai acuan implementasi sementara, dapat diganti oleh tim. |
| `[NEEDS DECISION]` | Belum diputuskan oleh tim. Agen **dilarang menebak** atau memutuskan sendiri. Berhenti dan catat di daftar keputusan terbuka (bagian 19). |
| `BELUM DIVERIFIKASI` | Spesifikasi, klaim eksternal, atau perintah belum dibuktikan langsung pada lingkungan berjalan. Dilarang diklaim sebagai fakta di UI, README, atau presentasi juri. |

### 1.2 Kapan membaca apa

| Situasi | Dokumen rujukan |
|---|---|
| Sebelum memulai pekerjaan apa pun | `AGENTS.md` (seluruhnya) dan `DESIGN.md` bagian 1-2 |
| Membuat atau mengubah halaman/komponen UI | `DESIGN.md` bagian yang relevan + `AGENTS.md` bagian 6, 7, 11 |
| Mengubah logika bisnis, database, API, akses | `AGENTS.md` bagian 4, 5, 8 |
| Menyentuh warna, font, ukuran, tata letak, gerak | `DESIGN.md` (sumber kebenaran visual). Dilarang mendefinisikan nilai literal di kode tanpa token |
| Butuh foto, logo, font, data wilayah, nomor kontak | `AGENTS.md` bagian 16, lalu berhenti dan minta ke tim |

### 1.3 Pembagian tanggung jawab dan prioritas hierarki sumber kebenaran

- `AGENTS.md`: Sumber kebenaran untuk identitas produk, aturan bisnis, keamanan, otorisasi, arsitektur teknis, database, validasi, testing, dan tata kelola agen AI.
- `DESIGN.md`: Sumber kebenaran untuk visual identity, token desain, tipografi, tata letak, spesifikasi komponen, sistem desain peta, visualisasi data, interaksi/motion, aksesibilitas antarmuka, dan sistem anti-slop.
- `DESIGN.md` **dilarang keras** mengubah atau melonggarkan aturan bisnis dan keamanan di bagian 4 dan 8 dokumen ini.
- `AGENTS.md` **tidak mendefinisikan ulang** nilai warna, font, atau ukuran visual yang menjadi hak milik `DESIGN.md`.

Urutan prioritas mutlak bila terjadi benturan aturan:
1. **Aturan keamanan & privasi (bagian 8) dan aturan bisnis (bagian 4).**
2. **Keputusan visual final pada `DESIGN.md`.**
3. **Isi `AGENTS.md` lainnya.**
4. **Saran atau output dari skill agen apa pun (skill selalu berstatus penasihat dan kalah terhadap kedua dokumen ini).**
5. Bila dua aturan setara tetap bertentangan: **berhenti dan minta keputusan tim.** Dilarang memilih sendiri.

---

## 2. Identitas proyek

**Produk.** Web app transparansi kebutuhan dan bantuan relawan di Indonesia (*Humanitarian Intelligence Platform*). Bukan situs donasi finansial. Tidak menggalang dana, tidak memproses transaksi uang, dan tidak merekrut relawan tandingan (arahkan ke platform yang sudah ada).

**Masalah.** Dalam operasi kemanusiaan dan kegiatan kerelawanan, informasi kebutuhan lapangan dan bantuan yang masuk tersebar di berbagai kanal tak resmi, sering simpang siur, berulang, atau basi. Akibatnya, terjadi penumpukan bantuan di titik tertentu sementara titik lain terabaikan.

**Inti produk.** Menghitung dan menampilkan **selisih transparan** antara kebutuhan yang dilaporkan dan bantuan yang telah terkonfirmasi (`CONFIRMED`) per lokasi dan per satuan barang/tenaga, dilengkapi proses verifikasi berlapis dengan alasan skor yang terbuka.

**Cakupan.** Bukan hanya bencana alam: juga mencakup kerusakan lingkungan hidup dan kebutuhan sosial sehari-hari (pendampingan lansia, fasilitas kesehatan marjinal, dukungan pendidikan). Visi produk berskala nasional. Untuk versi lomba (Traspac Competition), demo menggunakan data sampel fiktif dari beberapa wilayah representatif dengan tema **Lingkungan** dan **Sosial** beririsan dengan **Kesehatan** dan **Pendidikan**.

**Pengguna.**
1. *Relawan Lapangan (Pengguna Utama)*: Akses via ponsel pintar spesifikasi menengah ke bawah, jaringan internet sering lemah/tidak stabil, membutuhkan kejelasan tindakan dalam hitungan detik.
2. *Pengunjung Publik & Wartawan*: Memantau kondisi lapangan yang sudah terverifikasi secara agregat dan faktual tanpa dramatisasi.
3. *Verifikator*: Memeriksa bukti laporan, meninjau catatan bantuan, menetapkan status verifikasi beserta catatan alasan.
4. *Administrator*: Mengelola master wilayah, nomor darurat resmi, verifikasi akun lembaga, dan audit pengguna.

**Tim.** 1 orang (solo developer). Prioritas pengembangan berjenjang: Fitur Tingkat 1 harus stabil, teruji, dan dipahami 100% baris per baris sebelum menyentuh Tingkat 2 (bagian 12).

**Pembeda Utama** (dilarang mengklaim "satu-satunya" atau "yang pertama"):
1. Perhitungan selisih kebutuhan vs bantuan terkonfirmasi secara terbuka per kategori dan satuan.
2. Sistem verifikasi transparan dengan skor kepercayaan dan daftar alasan konkret.
3. Integrasi kebutuhan bencana sekaligus isu lingkungan dan sosial sehari-hari.
4. Dukungan pengiriman offline (*offline-first queue*) untuk area blank spot sinyal.
5. Akses cepat nomor darurat nasional dan posko lokal yang siap pakai secara luring.

**Posisi terhadap platform lain** (`BELUM DIVERIFIKASI`: tim wajib memeriksa ulang ke platform terkait sebelum presentasi):
- *InaRISK (BNPB)*: Peta potensi bahaya dan risiko bencana; tidak mencatat logistik kebutuhan dan penyaluran bantuan relawan di lapangan.
- *Indorelawan*: Platform penjaringan relawan ke organisasi/proyek; tidak berfokus pada pelaporan selisih kebutuhan logistik riil per titik.
- *PetaBencana.id*: Peta pemantauan bencana berbasis urun daya warga real-time berfokus pada kejadian bencana; tidak mencakup isu pendampingan sosial dan manajemen selisih logistik harian.
- *Kitabisa*: Platform penggalangan dana publik (*crowdfunding*); aplikasi ini bukan platform penggalangan dana.

**Batasan proyek versi lomba:**
- Tidak menggunakan integrasi live API BNPB/BMKG (cukup tautan keluar atau data rujukan fiktif terstruktur).
- Dilarang membuat klaim kemitraan resmi tanpa dokumen MoU yang disetujui tim (bagian 18).
- Dilarang menambahkan modul transfer dana, dompet digital, atau rekening donasi.
- Aplikasi bukan pengganti layanan panggilan gawat darurat (bagian 17).

---

## 3. Penilaian lomba (Traspac Competition)

Total bobot 100 poin. Setiap baris kode dan keputusan arsitektur harus menjawab kriteria penilaian:

| Kriteria | Bobot | Sasaran Implementasi |
|---|---|---|
| Logika code | 15% | Alur penentuan selisih, transisi status, dan idempotensi jelas, modular, dan dapat dijelaskan runut di hadapan juri. |
| User interface | 15% | Bersih, kontras tinggi, bebas generic AI slop, sangat nyaman dibaca relawan di layar ponsel terik matahari. |
| Performa sistem | 10% | Ringan di koneksi 3G, pemisahan bundel Leaflet dinamis, indeks database tepat, cepat saat demo juri. |
| Pengetahuan dasar code | 10% | Pengembang solo memahami seluruh struktur sintaks tanpa ketergantungan *black-box* library yang tak terpahami. |
| Penggunaan database | 10% | Kueri relasional terstruktur: agregasi `SUM`, `GROUP BY`, penanganan duplikasi kueri/fan-out, dan isolasi transaksi konkuren. |
| Kerapihan code | 10% | Standar TypeScript strict, pemisahan berkas terstruktur, komentar alasan arsitektur berbahasa Indonesia. |
| Keamanan aplikasi | 10% | Proteksi IDOR (404), RBAC berlapis, validasi Zod ketat di server, proteksi race condition pencatatan bantuan. |
| Easy development | 10% | Juri dan penilai dapat menjalankan proyek lokal dalam 2-3 langkah mudah via terminal tanpa konfigurasi rumit. |
| Kreativitas ide | 10% | Solusi riil transparansi selisih bantuan untuk menjawab isu ketimpangan logistik kemanusiaan. |

**Aturan Emas:** Dilarang memasukkan pustaka atau menulis kode yang tidak dapat dijelaskan pengembang baris per baris. Jika ada dua pendekatan, pilih pendekatan yang paling sederhana, kokoh, dan mudah diverifikasi.

---

## 4. Aturan bisnis (tidak boleh dilanggar)

Perubahan pada bagian ini **wajib persetujuan tertulis dari tim**.

### 4.1 Jenis, kategori, urgensi, dan kerangka 5W+1H

| Bidang | Nilai | Perilaku Sistem |
|---|---|---|
| `type` | `KEBUTUHAN` | Memiliki item kebutuhan (`Need`), catatan penyaluran (`Aid`), dan kalkulasi selisih. |
| | `PEMANTAUAN` | Laporan pantauan kerusakan lingkungan atau kerentanan sosial yang belum menjadi darurat logistik. **Dilarang memiliki `Need`, `Aid`, maupun angka selisih.** UI dilarang menampilkan kalkulasi selisih pada tipe ini. |
| `category` | `BENCANA`, `LINGKUNGAN`, `LANSIA`, `KESEHATAN`, `PENDIDIKAN`, `SOSIAL_LAINNYA` | Nilai bersifat enum Prisma. Penambahan kategori baru harus melalui migrasi skema dan pembaruan ikon visual di `DESIGN.md`. |
| `urgency` | `DARURAT`, `MENDESAK`, `TERENCANA` | Independen dari persentase kekurangan logistik. Misal: pendampingan panti lansia berurgensi `TERENCANA`, banjir bandang berurgensi `DARURAT`. |

Setiap pengajuan laporan wajib memenuhi kerangka **5W+1H**:
1. **What**: Apa kejadiannya atau barang/tenaga apa yang dibutuhkan.
2. **Who**: Siapa penerima manfaat atau pihak terdampak (komunitas, kelompok warga, tanpa membocorkan nama pribadi).
3. **Where**: Wilayah administratif (`Region`) dan deskripsi patokan lokasi aman.
4. **When**: Waktu riil kejadian/kebutuhan (dicatat tanggal & jam lokal).
5. **Why**: Latar belakang penyebab situasi darurat/kebutuhan muncul.
6. **How**: Bagaimana akses menuju lokasi, kondisi jalur, atau metode penyaluran bantuan yang aman.

Semua 6 elemen wajib tervalidasi via Zod di klien dan server sebelum disimpan.

### 4.2 Peran dan hak akses (RBAC)

| Peran | Hak Akses Sistem |
|---|---|
| Pengunjung Publik (tanpa sesi) | Membuka peta publik (hanya pin `VERIFIED`), melihat detail laporan `VERIFIED`, melihat dashboard statistik agregat publik, dan membuka halaman darurat. Laporan `PENDING` publik **hanya boleh tampil sebagai angka agregat total**, dilarang tampil sebagai pin lokasi atau dokumen detail. |
| `RELAWAN` | Semua hak pengunjung publik + membuat laporan baru, mencatat bantuan yang disalurkan, melihat kontak koordinator lapangan pada laporan `VERIFIED`. |
| `VERIFIKATOR` | Semua hak relawan + mengakses antrean verifikasi laporan (`/verifikasi`), menyetujui/menolak laporan, meminta revisi laporan, mengonfirmasi atau menolak catatan `Aid`. |
| `ADMIN` | Akses penuh: manajemen pengguna, master data wilayah, kontak darurat resmi, verifikasi lembaga, serta audit sistem. |

**Aturan Keamanan Data Publik & Akses:**
- Semua kueri publik **wajib difilter `status = VERIFIED` di lapisan server** (melalui modul tunggal `lib/public-queries.ts`). Dilarang keras mengirim data non-`VERIFIED` ke klien lalu memfilternya di JavaScript browser.
- Identitas pelapor (`reporter.name`, `reporter.email`, `reporter.phone`) tidak pernah dikirim ke respon publik.
- Kontak koordinator lapangan hanya dikembalikan oleh server jika pengguna memiliki sesi login valid (`RELAWAN`, `VERIFIKATOR`, atau `ADMIN`).
- Pengunjung publik tidak memiliki baris data di tabel `User`.
- Status keanggotaan lembaga (`OrganizationMember`) terpisah dari peran akun global.

**Standar Respons Akses Ditolak:**
| Situasi | Penanganan Sistem |
|---|---|
| Pengguna anonim mengakses halaman terlindungi (`/lapor`, `/verifikasi`, `/admin`) | Redirect (302/307) ke `/login?next=...` |
| Pengguna login mengakses modul di luar perannya (misal `RELAWAN` membuka `/verifikasi`) | Tampilkan halaman status HTTP 403 (Akses Ditolak) |
| Pengguna mengakses entitas (laporan/bantuan) yang tidak ada, berstatus non-publik tanpa hak, atau milik pengguna lain | **Wajib kembalikan HTTP 404 (Tidak Ditemukan)** untuk mencegah serangan *resource enumeration* / IDOR. Jangan pernah mengembalikan 403 untuk ID objek privat. |

### 4.3 Siklus hidup status laporan

Status laporan: `PENDING`, `VERIFIED`, `NEEDS_REVISION`, `REJECTED_FINAL`.

```
                  [ Pelapor Submit ]
                          │
                          ▼
                      PENDING ◄────────────────────────────────────────┐
                      │     │                                          │
        ┌─────────────┘     └──────────────┐                           │
        ▼                                  ▼                           │
   [Disetujui]                        [Ditolak]                        │
        │                                  │                           │
        ▼                                  ▼                           │
    VERIFIED                 revisionCount < MAX_REVISIONS?            │
                                    │                     │            │
                                  (Ya)                  (Tidak)        │
                                    │                     │            │
                                    ▼                     ▼            │
                              NEEDS_REVISION        REJECTED_FINAL     │
                                    │              (Tolak Permanen)    │
                                    │                                  │
                                    └──── [Pelapor Kirim Revisi] ──────┘
                                          (revisionCount + 1,
                                           skor dihitung ulang)
```

**Aturan Transisi Status:**
- Konstanta `MAX_REVISIONS = 3` (1 pengajuan awal + maksimal 3 revisi = total 4 kali tinjauan).
- Setiap penolakan atau permintaan revisi oleh verifikator **wajib mencantumkan alasan tertulis (`note`)** minimal 10 karakter yang divalidasi server.
- Hanya pelapor asli yang berhak mengubah dan mengirim ulang laporan berstatus `NEEDS_REVISION`.
- Laporan berstatus `REJECTED_FINAL` tidak dapat diedit atau diajukan kembali.
- Seluruh mutasi status wajib melalui fungsi terpusat di `lib/report-transitions.ts`. Dilarang memanggil `prisma.report.update({ data: { status } })` langsung dari Server Action atau Route Handler.

### 4.4 Kebutuhan, bantuan, satuan, dan perhitungan selisih

- `Need.kind`: `BARANG` (logistik fisik) atau `TENAGA` (jumlah personel relawan spesialis/umum).
- Setiap item kebutuhan **wajib memiliki satuan pengukuran yang jelas (`unit`)**, misal: `kotak`, `karung`, `liter`, `paket`, `orang`.
- **Aturan Pencegahan Pencampuran Satuan:** Dilarang keras menjumlahkan angka kuantitas yang memiliki satuan berbeda, meskipun berada dalam kategori barang yang sama. Agregasi selisih dihitung per pasangan unik `(itemCategory, unit)` dalam satu laporan.
- **Kategori Item Kebutuhan vs Kategori Laporan:** Bidang klasifikasi logistik pada `Need` dan `Aid` diberi nama `itemCategory` (misal: `MAKANAN`, `MEDIS`, `HUNIAN`, `SANITASI`, `EVAKUASI`) untuk membedakannya secara tegas dari `Report.category` (`BENCANA`, `LINGKUNGAN`, dll.).
- **Rumus Selisih:**
  $$\text{Selisih} = \max(0, \sum \text{Need.qty} - \sum \text{Aid.qty (status CONFIRMED)})$$
  Catatan: `Aid` berstatus `PENDING` atau `REJECTED` **tidak mengurangi nilai selisih resmi**.
- **Batas Atas Bantuan & Proteksi Konkurensi (Race Condition):**
  Jumlah bantuan terkonfirmasi kumulatif ditambah bantuan yang sedang dicatat tidak boleh melampaui kebutuhan tercatat.
  > [!IMPORTANT]
  > Untuk mencegah *double allocation* pada pengiriman bantuan yang bersamaan (konkuren), pengecekan sisa kuota dan penyimpanan `Aid` **wajib dijalankan dalam transaksi database terisolasi (`prisma.$transaction`)** dengan penguncian baris (`SELECT ... FOR UPDATE` via query raw atau transaksi berlevel isolasi `Serializable`). Dilarang hanya mengandalkan pengecekan baca-sebelum-tulis di level aplikasi.
- **Penentuan Status Bantuan:**
  - Bantuan dicatat oleh *Relawan Terpercaya* (`isTrustedVolunteer(userId) = true`, yaitu pengguna dengan minimal 1 laporan atau bantuan `VERIFIED` sebelumnya): langsung mendapat status `CONFIRMED`.
  - Bantuan dicatat oleh relawan baru: berstatus `PENDING` hingga dikonfirmasi oleh verifikator.
  - Penentuan status dihitung secara deterministik oleh server saat payload diterima.
- Verifikator dapat membatalkan catatan bantuan (`REJECTED`) dengan **alasan tertulis wajib**.
- Logika hitung selisih dipusatkan di satu fungsi modul `lib/calculations.ts`. Komponen tampilan dilarang melakukan kalkulasi agregat mandiri.

**Kueri SQL Acuan (Bebas Masalah Fan-Out Join):**
```sql
-- Agregasi selisih per itemCategory dan unit pada satu laporan
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

### 4.5 Tingkat verifikasi (*Verification Level*)

Pada laporan dengan status `VERIFIED`, berlaku tingkatan verifikasi:
- `COMMUNITY` (Label antarmuka: "Diverifikasi Komunitas"):
  - Syarat: Disetujui minimal oleh 2 akun verifikator yang berbeda, dan keduanya bukan merupakan pembuat laporan tersebut.
  - Status laporan saat baru menerima 1 persetujuan verifikator: Tetap `PENDING`, dengan status internal `verificationCount = 1`. Laporan belum tampil ke peta publik.
- `OFFICIAL` (Label antarmuka: "Diverifikasi Lembaga [Nama Lembaga]"):
  - Syarat: Disetujui oleh verifikator yang terdaftar dalam lembaga terverifikasi (`Organization.isVerified = true`).
  - Tingkat `OFFICIAL` mengesampingkan `COMMUNITY` dan langsung memvalidasi laporan menjadi publik.
- Setiap persetujuan/penolakan disimpan di tabel riwayat `Verification` (mencatat `reportId`, `userId`, `decision`, `note`, `createdAt`).

### 4.6 Skor kepercayaan (*Trust Score*)

- Perhitungan skor kepercayaan bersifat **deterministik matematis** di `lib/trust-score.ts`. **Dilarang menggunakan AI untuk menentukan angka skor ini.**
- Formula `SEMENTARA` (rentang skor 0 hingga 100):
  - Memiliki lampiran foto bukti lapangan: `+30 poin`
  - Terdapat laporan mandiri lain dari relawan berbeda dalam radius 2 km: `+20 poin`
  - Pelapor terverifikasi (*trusted volunteer*): `+20 poin`
  - Deskripsi 5W+1H lengkap (setiap bidang terisi substantif di atas batas minimum karakter): `+15 poin`
  - Menggunakan akun relawan dengan kontak nomor terverifikasi: `+15 poin`
- **Transparansi Wajib:** Antarmuka dilarang hanya menyajikan angka skor mentah. Sistem wajib menampilkan daftar butir alasan pengurang/penambah skor secara terbuka (misal: "Foto terlampir (+30), Pelapor belum memiliki riwayat verifikasi (+0)").
- Skor dihitung ulang secara otomatis di server setiap kali pelapor mengirimkan revisi data.
- Skor bersifat indikator pembantu verifikator; skor tinggi tidak otomatis mengubah status menjadi `VERIFIED`.

### 4.7 Publikasi, privasi, dan pengaburan lokasi sensitif

- Data publik hanya dapat diakses melalui fungsi `lib/public-queries.ts`.
- **Pengaburan Koordinat Kategori Sensitif:**
  - Laporan dengan kategori rentan seperti `LANSIA` atau `KESEHATAN` (terkait data medis/privasi keluarga) **wajib dikaburkan titik koordinatnya di server**.
  - Metode pengaburan `SEMENTARA`: Server membulatkan koordinat GPS maksimal ke 2 desimal (~1,1 km radius) atau mengembalikan titik tengah centroid `Region` (desa/kelurahan), serta menghapus rincian alamat jalan/nomor rumah dari payload API publik.
  - Alamat presisi dan titik koordinat akurat hanya dikirimkan kepada relawan yang telah login dan terdaftar resmi.
- **Penanda Data Basi (*Stale Data*):**
  Laporan `VERIFIED` yang tidak memiliki pembaruan atau catatan penyaluran bantuan selama lebih dari 7 hari (`[NEEDS DECISION: ambang hari]`) wajib diberi penanda visual "Data perlu konfirmasi ulang kondisi terkini".

### 4.8 Kirim offline (*Offline Submission*)

- Dukungan pengiriman offline dirancang untuk mengatasi kondisi jaringan di wilayah bencana/terpencil.
- Kiriman offline menggunakan `clientId` bertipe UUID v4 yang dihasilkan di perangkat saat formulir pertama kali disimpan secara lokal.
- Server menerapkan validasi idempoten: Pengiriman ulang berulang dengan `clientId` yang sama tidak menghasilkan baris ganda, melainkan mengembalikan data catatan yang telah ada dengan kode status 200 OK.
- Kredensial dan data sensitif lokal wajib diisolasi antar-pengguna (rincian di bagian 15).

### 4.9 Batasan fitur AI (Tingkat 2, Opsional)

Tombol "Bantu rapikan laporan" berfungsi mengubah teks cerita bebas relawan menjadi kerangka terstruktur 5W+1H.
- Pemanggilan API AI dilakukan secara eksklusif dari lingkungan server (*Server Action*). `AI_API_KEY` disimpan di server dan dilarang terekspos ke bundle klien.
- Output teks AI wajib divalidasi skema Zod sebelum ditampilkan ke form pelapor.
- Output disimpan di kolom opsional `aiSummary`, dilarang menimpa deskripsi asli tulisan pelapor.
- **AI dilarang keras memutuskan status laporan, memverifikasi bantuan, atau mengubah hak akses.** Aplikasi wajib beroperasi normal 100% tanpa kunci API AI.

---

## 5. Arsitektur teknis

### 5.1 Spesifikasi teknologi

> [!WARNING]
> **Status Repository Aktual:** Lingkungan kerja saat ini baru memuat berkas spesifikasi `AGENTS.md` dan `DESIGN.md`, belum memiliki berkas `package.json` maupun kode sumber aplikasi. Semua tabel teknologi di bawah berstatus **RENCANA IMPLEMENTASI / `BELUM DIVERIFIKASI`** hingga berkas dependensi dibuat. Dilarang memasang paket mandiri sebelum fase implementasi dimulai.

| Pustaka / Komponen | Peran | Status Keputusan | Catatan Evaluasi & Alternatif |
|---|---|---|---|
| Next.js (App Router) + TypeScript | Framework Fullstack | Wajib (FINAL) | Mode TypeScript `strict`, isolasi server/client ketat. |
| Prisma ORM + Neon PostgreSQL | Database & Migrasi | Wajib (FINAL) | Menggunakan pooling connection string (`DATABASE_URL`) dan direct URL migrasi (`DIRECT_URL`). |
| Zod | Validasi Skema | Wajib (FINAL) | Skema validasi bersama di `lib/validators.ts` untuk server dan form klien. |
| bcrypt / @node-rs/bcrypt | Password Hashing | Wajib (FINAL) | Salt rounds minimal 10-12, hashing wajib di server. |
| Leaflet + React-Leaflet | Visualisasi Peta | Wajib (FINAL) | Wajib dynamic import dengan `{ ssr: false }` untuk mencegah galat window di SSR. |
| Motion (`motion/react`) | Animasi Antarmuka | Wajib (FINAL) | Dipakai selektif pada transisi panel, modal, dan sheet. Dibatasi pada properti `transform` dan `opacity`. |
| Serwist + IndexedDB (`idb`) | Service Worker & Offline Queue | Rencana Tingkat 2 | Pilihan IndexedDB: direkomendasikan pustaka tipis `idb` daripada Dexie demi ukuran bundel `[NEEDS DECISION]`. |
| Pustaka Autentikasi | Manajemen Sesi | `[NEEDS DECISION]` | Pilihan: **Auth.js v5 (NextAuth)** atau **iron-session**. Rekomendasi: `iron-session` lebih transparan, mudah dijelaskan ke juri, dan stateless via encrypted cookie. |
| Pendekatan Styling | Styling & Tokens | `[NEEDS DECISION]` | Pilihan: **Tailwind CSS v3/v4** atau **CSS Modules**. Rekomendasi: Tailwind dengan pemetaan token CSS variables dari `DESIGN.md`. |
| Penyedia Ubin Peta (Map Tile) | Layer Peta Dasar | `[NEEDS DECISION]` | Pilihan: CartoDB Positron / OSM Standard / Stamen. Wajib mencantumkan atribusi legal dan ramah kuota bebas. |
| Kerangka Testing | Pengujian Kode | `[NEEDS DECISION]` | Rekomendasi: Vitest untuk unit test logika inti (selisih, skor, idempotensi). |
| Rate Limiter Serverless | Pencegahan Brute-Force | `[NEEDS DECISION]` | Penyimpanan limit hitung di tabel database Postgres untuk keandalan arsitektur serverless. |

### 5.2 Struktur direktori rujukan (`SEMENTARA`)

```
d:/trasec_lomba/
├── AGENTS.md                  # Sumber kebenaran operasional, bisnis, dan teknis
├── DESIGN.md                  # Sumber kebenaran visual, interaksi, dan token UI
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx     # Halaman masuk
│   ├── (public)/
│   │   ├── page.tsx           # Rute utama (FINAL: Opsi C — Peta publik + Bottom Sheet pengantar)
│   │   ├── laporan/[id]/      # Detail laporan publik (hanya VERIFIED)
│   │   ├── dashboard/         # Dashboard statistik agregat publik
│   │   ├── darurat/           # Direktori kontak darurat cepat (luring)
│   │   └── antrean/           # Antrean pengiriman lokal perangkat
│   ├── (relawan)/
│   │   └── lapor/             # Form pelaporan 5W+1H (dukung luring)
│   ├── (verifikator)/
│   │   └── verifikasi/        # Antrean tinjauan laporan & konfirmasi bantuan
│   ├── (admin)/
│   │   └── admin/             # Panel master wilayah, kontak darurat, lembaga
│   ├── api/
│   │   ├── offline/sync/      # Endpoint sinkronisasi antrean idempoten
│   │   └── sitemap.xml/       # Sitemap dinamis hanya laporan publik
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Komponen atomik (Button, Input, Badge, Tabel)
│   ├── map/                   # Komponen peta Leaflet (Client Only) + Kontrol Layer/Info
│   ├── sheet/                 # Bottom Sheet pengantar dan panel ringkasan lokasi
│   ├── report/                # Komponen detail, selisih, 5W+1H
│   └── layout/                # Navigasi, footer, tombol darurat terapung
├── lib/
│   ├── prisma.ts              # Client Prisma singleton
│   ├── auth.ts                # Logika sesi dan cookie
│   ├── access.ts              # Pengecekan otorisasi peran & IDOR
│   ├── calculations.ts        # Kalkulasi selisih & validasi satuan
│   ├── trust-score.ts         # Kalkulasi deterministik skor kepercayaan
│   ├── report-transitions.ts  # Mesin status laporan & revisi
│   ├── validators.ts          # Skema validasi Zod
│   ├── public-queries.ts      # Kueri publik terisolasi status VERIFIED
│   └── offline/               # Manajemen IndexedDB (Client Only)
├── prisma/
│   ├── schema.prisma          # Skema model database
│   └── seed.ts                # Data benih sampel fiktif
└── public/
    └── assets/                # Aset media terverifikasi + ASSETS.md
```

#### 5.2.1 Kontrak Arsitektur Rute Root `/` (FINAL: Opsi C)
- **Keputusan:** FINAL (Diputuskan pada 19 November 2026). Rute root `/` mengimplementasikan **Opsi C — Peta Operasional + Bottom Sheet Pengantar Terintegrasi**.
- **Karakteristik Halaman:**
  1. **Konten Utama:** Peta Leaflet interaktif langsung dimuat dan membentang memenuhi ruang pandang layar (*full viewport*).
  2. **Lapisan Pengantar (*Orientation Layer*):** Bottom sheet pengantar ditampilkan di atas peta saat pertama kali dibuka, memuat penjelasan singkat visi platform, cara membaca selisih kebutuhan vs bantuan, dan arti kode penanda peta.
  3. **Penutupan Fleksibel:** Pengguna dapat menutup bottom sheet melalui tombol aksi ("Jelajahi Peta Langsung"), ikon silang (`X`), tombol `Escape`, atau gestur sapuan ke bawah pada perangkat mobile.
  4. **Peta Penuh Pasca-Tutup:** Setelah bottom sheet ditutup, peta tetap memenuhi area tampilan layar tanpa terhalang elemen dekoratif.
  5. **Mekanisme Buka Ulang (*Reopen Control*):** Pengguna dapat membuka kembali pengantar kapan saja melalui tombol kontrol panduan/bantuan (`HelpCircle` atau "Panduan") yang disematkan secara konsisten pada bar kontrol peta atau header navigasi.
  6. **Bebas Obstruksi Permanen:** Bottom sheet tidak boleh menutupi secara permanen kontrol navigasi utama peta (tombol zoom, filter, layer) maupun Tombol Akses Darurat terapung.
  7. **Responsivitas:**
     - Pada mobile (<768px): Menempel di sisi bawah layar dengan batas tinggi maksimal ~50–60vh, mendukung interaksi sentuh dan tidak mengganggu navigasi peta di luar sheet.
     - Pada desktop (>=1024px): Ditampilkan sebagai panel mengambang proporsional (lebar 380px–420px di pojok kiri bawah) atau panel terpusat yang menjamin minimal 65% area peta tetap terlihat leluasa.
  8. **Pemisahan Halaman Pemasaran:** Rute `/` secara eksklusif diperuntukkan bagi Peta Operasional. Halaman pemasaran konvensional, apabila kelak diperlukan, dialihkan ke rute terpisah (misal `/tentang` atau rute khusus) melalui keputusan tim baru.

### 5.3 Batasan server dan klien

- Modul `lib/` yang mengelola kueri basis data atau rahasia server **wajib menyertakan `import "server-only";`** di baris pertama.
- Komponen klien (`"use client"`) dibatasi hanya pada elemen yang membutuhkan event listener browser, state antarmuka lokal, API IndexedDB, atau Leaflet.
- Seluruh pengambilan data dilakukan di React Server Components. Data yang dikirim ke komponen klien harus berupa plain object yang telah disaring ketat (dilarang mem-passing seluruh object entitas yang memuat data pribadi seperti email, hash password, atau nomor telepon pelapor).

### 5.4 Konvensi API dan format galat

Respons Server Actions dan Route Handlers wajib mengikuti bentuk standar seragam:
```typescript
// Sukses
type ActionSuccess<T> = {
  ok: true;
  data: T;
};

// Gagal
type ActionFailure = {
  ok: false;
  code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMITED" | "SERVER_ERROR";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResponse<T> = ActionSuccess<T> | ActionFailure;
```

Kode status HTTP pada route API:
- `400`: Input gagal validasi Zod.
- `401`: Permintaan membutuhkan autentikasi login.
- `403`: Peran pengguna tidak memiliki hak pada aksi tersebut.
- `404`: Objek tidak ditemukan atau pemohon tidak berhak mengetahui keberadaan objek (proteksi IDOR).
- `409`: Konflik status pada mesin transisi state laporan.
- `429`: Melebihi batas frekuensi pengiriman (rate limit).

### 5.5 Skema basis data dan konvensi penamaan

- Penamaan tabel/model menggunakan PascalCase (`Report`, `Need`, `Aid`).
- Penamaan kolom menggunakan camelCase (`reportId`, `itemCategory`, `clientId`).
- Enum menggunakan UPPER_SNAKE_CASE (`PENDING`, `VERIFIED`, `REJECTED_FINAL`).
- Kolom relasi luar wajib diberi `@@index` untuk menjaga kecepatan kueri join: `[status]`, `[regionId]`, `[type, status]`.
- Entitas `Report` dan `Aid` wajib memiliki kolom `clientId String @unique` untuk mencegah duplikasi kiriman jaringan/offline.
- Seluruh data seed di `prisma/seed.ts` wajib menggunakan identitas, nomor telepon, dan narasi fiktif yang secara jelas ditandai sebagai data simulasi lomba.

---

## 6. Tata kelola alur kerja AI coding agent

Agen AI yang beroperasi pada repositori ini wajib mematuhi 8 tahapan kerja berikut tanpa melompati langkah:

```
[1. Understand] ──► [2. Inspect] ──► [3. Plan] ──► [4. Implement]
                                                         │
[8. Report]    ◄── [7. Verify]  ◄── [6. Review] ◄── [5. Test (TDD)]
```

### 6.1 Rincian 8 langkah kerja

1. **Understand**: Baca menyeluruh dokumen `AGENTS.md` dan `DESIGN.md`. Pahami batasan peran, aturan bisnis, dan kriteria penerimaan sebelum menyentuh file apa pun.
2. **Inspect**: Periksa kondisi fisik direktori kerja dan berkas konfigurasi aktual. Jangan berasumsi pustaka tertentu sudah terpasang jika belum melihat buktinya di file konfigurasi.
3. **Plan**: Buat rencana kerja atomik terstruktur. Tentukan fungsi yang akan dibuat, berkas yang akan disentuh, dan dampak pada aturan bisnis.
4. **Implement**: Tulis kode yang mematuhi standar TypeScript strict, menggunakan token desain resmi, dan terdokumentasi rapi.
5. **Test**: Jalankan pengujian otomatis untuk logika inti (TDD) dan jalankan pemeriksaan tipe/linting.
6. **Review**: Periksa ulang diff perubahan. Pastikan tidak ada `console.log`, tidak ada tipe `any`, tidak ada kebocoran IDOR, dan tidak ada komponen tanpa fungsi.
7. **Verify**: Uji kesesuaian terhadap *Definition of Done* (bagian 11).
8. **Report**: Laporkan hasil modifikasi secara faktual, jujur, dan terstruktur sesuai format standar (bagian 6.5).

### 6.2 Kewajiban Test-Driven Development (TDD)

TDD **wajib diterapkan** sebelum menulis implementasi pada domain logika inti berikut:
- Kalkulasi selisih kebutuhan vs bantuan beserta validasi kecocokan satuan (`unit`).
- Formula perhitungan deterministik skor kepercayaan (*Trust Score*).
- Mesin transisi status laporan dan pembatasan revisi maksimal.
- Pengecekan idempotensi penyimpanan data offline berbasis `clientId`.
- Proteksi transaksi konkurensi batas atas bantuan (*concurrency race condition*).
- Kueri pengaburan koordinat kategori sensitif pada modul data publik.

### 6.3 Kondisi wajib berhenti dan meminta persetujuan manusia

Agen AI **wajib segera berhenti dan meminta instruksi tim** apabila menemui situasi berikut:
1. Membutuhkan modifikasi atau penambahan pada aturan bisnis (bagian 4).
2. Perubahan pada skema basis data yang menghapus tabel, kolom, atau mengubah tipe data yang sudah ada.
3. Memasang dependensi baru atau menginstal skill agen AI dari pihak ketiga.
4. Menemukan pertentangan instruksi antardokumen yang tidak dapat diselesaikan dengan hierarki pasal 1.3.
5. Membutuhkan aset grafis nyata, foto bukti, atau data kontak resmi (bagian 16).
6. Menemukan keputusan arsitektur yang berlabel `[NEEDS DECISION]`.
7. Dilarang menyentuh, mengedit, atau membocorkan file `.env` dan kredensial produksi.

### 6.4 Larangan keras bagi agen AI

- Dilarang membuat tombol atau interaksi antarmuka tipuan (*mockup dummy*) tanpa fungsi nyata di belakangnya.
- Dilarang menyamarkan status pengujian: Mengklaim "Lolos pengujian" padahal tes tidak dijalankan secara riil pada terminal adalah pelanggaran fatal.
- Dilarang menonaktifkan pemeriksaan tipe menggunakan `@ts-ignore`, `@ts-nocheck`, atau mengecor tipe ke `any` demi meloloskan kompilasi.
- Dilarang mengarang narasi kemitraan instansi resmi, logo, atau nomor telepon darurat fiktif yang menyerupai institusi negara tanpa izin tim.

### 6.5 Format baku laporan akhir agen AI

Setiap penyelesaian tugas wajib dilaporkan dengan format:
1. **Daftar Berkas yang Dimodifikasi**: Nama berkas dan alasan pengubahan.
2. **Perintah Terminal yang Dijalankan**: Menampilkan sintaks dan ringkasan output riil (status lolos/gagal, jumlah tes, waktu eksekusi).
3. **Pekerjaan yang Belum Dikerjakan / Belum Teruji**: Keterbatasan yang memerlukan verifikasi manual pengguna.
4. **Dampak terhadap Aturan Bisnis & Keamanan**: Konfirmasi kepatuhan terhadap checklist keamanan.
5. **Keputusan yang Butuh Tindak Lanjut Tim**: Butir `[NEEDS DECISION]` baru jika ditemukan di lapangan.

---

## 7. Standar penulisan kode

- **TypeScript Strict**: `noImplicitAny: true`, `strictNullChecks: true`. Dilarang menggunakan `any`. Gunakan `unknown` yang dipadukan dengan skema Zod parsing untuk data eksternal.
- **Gaya Penulisan**: Indentasi 2 spasi, semi-colon konsisten, penamaan PascalCase untuk komponen React (`ReportCard.tsx`), camelCase untuk fungsi dan variabel (`calculateDeficit`), UPPER_SNAKE_CASE untuk konstanta global dan enum (`MAX_REVISION_COUNT`).
- **Komentar Berbahasa Indonesia**: Berikan komentar padat yang menjelaskan **alasan arsitektural (*why*)**, bukan mendeskripsikan ulang sintaks bahasa (*what*). Terutama pada alur kalkulasi selisih, isolasi transaksi, dan pembobotan skor.
- **Komponen Modular**: Terapkan *Single Responsibility Principle*. Hindari komponen monolitik di atas 200 baris. Komponen UI atomik ditempatkan di `components/ui/`.
- **Bebas Kode Mati**: Tidak meninggalkan `console.log`, komentar kode yang tidak terpakai, fungsi yang tidak pernah dipanggil, atau tag `TODO` tanpa tiket keputusan terbuka.

---

## 8. Panduan keamanan aplikasi (OWASP Top 10)

Kepatuhan keamanan dievaluasi langsung pada kode, bukan mengandalkan klaim skill eksternal.

### 8.1 Matriks checklist keamanan

| Aspek Keamanan | Aturan Wajib | Metode Verifikasi |
|---|---|---|
| Kata Sandi | Wajib di-hash menggunakan bcrypt dengan salt rounds minimal 10. Kata sandi mentah dilarang dicatat di log. | Review kode `auth.ts`; tes unit memastikan nilai kolom database berupa hash bcrypt valid. |
| Pengelolaan Sesi | Cookie sesi wajib bertanda `httpOnly: true`, `secure: true` (pada produksi), `sameSite: "lax"`, dan memiliki masa berlaku terukur. Logout menghapus sesi di server. | Inspeksi header `Set-Cookie` via peramban/curl; uji penghapusan token saat logout. |
| Otorisasi Objek (IDOR) | Setiap pembacaan atau mutasi entitas wajib memeriksa hak kepemilikan pengguna. Akses tidak sah wajib menghasilkan respons **404 Not Found**. | Uji coba pengubahan parameter ID ke data milik pengguna lain tanpa izin. |
| Sanitasi & SQL Injection | Wajib menggunakan API Prisma bertipe atau tagged template literal `$queryRaw`. Dilarang merangkai string mentah (*string concatenation*) ke dalam kueri SQL. | Audit statis pencarian kata kunci `$queryRawUnsafe` dan penggabungan teks SQL. |
| Cross-Site Scripting (XSS) | Teks masukan pengguna wajib di-escape oleh React. Dilarang menggunakan `dangerouslySetInnerHTML` untuk menampilkan narasi laporan atau komentar verifikasi. | Uji payload skrip `<script>alert(1)</script>` pada semua kolom formulir 5W+1H. |
| Proteksi CSRF | Server Actions Next.js mengandalkan verifikasi origin bawaan. Rute API yang memutasi data wajib memvalidasi kecocokan header `Origin` atau token anti-CSRF. | Tes pengiriman payload lintas domain (*cross-origin fetch*). |
| Privasi Data Sensitif | Nomor kontak koordinator, identitas pelapor, dan koordinat tepat lokasi sensitif dilarang keluar ke respon publik. | Inspeksi payload JSON pada endpoint publik dan modul Server Component. |
| Header Keamanan | Menetapkan header HTTP: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`. | Audit header pada respons produksi via `curl -I`. |
| Isolasi Antrean Offline Multi-Pengguna | Antrean IndexedDB wajib mengisolasi data per `userId`. Jika pengguna A logout dan pengguna B login di perangkat yang sama, antrean pengguna A dilarang terbaca atau dikirimkan oleh pengguna B. | Uji coba login bergantian pada satu profil browser dengan antrean luring aktif. |
| Sanitasi Unggah Foto (Tingkat 2) | Validasi tipe MIME riil di server (bukan ekstensi), batas ukuran maksimal 2MB, tolak SVG aktif, dan **wajib menghapus metadata EXIF (terutama tag koordinat GPS)** sebelum berkas disimpan/dipublikasikan. | Uji unggah berkas berekstensi ganda; inspeksi metadata gambar luaran menggunakan alat pembaca EXIF. |

---

## 9. Kebijakan SEO dan pengindeksan mesin pencari

Tujuan: Memastikan laporan terverifikasi dapat terindeks dengan baik untuk kebutuhan pencarian informasi bencana/sosial publik, tanpa membocorkan halaman operasional internal.

| Kategori Halaman | Kebijakan Indeks Mesin Pencari | Konfigurasi Metadata |
|---|---|---|
| Halaman Publik | Boleh diindeks (`index: true, follow: true`): Halaman utama (`/`), detail laporan `VERIFIED`, dashboard statistik agregat publik, dan informasi darurat. | Menggunakan `generateMetadata` dinamis dengan judul spesifik, deskripsi kontekstual non-sensitif, tag OpenGraph, dan URL kanonikal. |
| Halaman Privat & Sensitif | **Wajib `noindex, nofollow`**: `/login`, `/lapor`, `/verifikasi`, `/admin`, `/antrean`, dan seluruh laporan berstatus non-`VERIFIED`. | Ditetapkan pada layout induk masing-masing: `robots: { index: false, follow: false }`. |

- **Daftar Lokasi Server-Side**: Karena peta Leaflet dirender di sisi klien, sediakan daftar lokasi teks dan ringkasan selisih yang dirender di server (HTML semantik) agar mesin pencari dan pembaca layar dapat membaca data tanpa mengeksekusi JavaScript peta.
- `sitemap.xml`: Dihasilkan secara dinamis hanya untuk memuat rute publik dan URL laporan yang berstatus `VERIFIED`.

---

## 10. Pengujian dan jaminan kualitas (QA)

| Kategori Tes | Perintah Terminal | Kapan Dijalankan | Kriteria Keberhasilan |
|---|---|---|---|
| Linter | `npm run lint` | Setiap ada modifikasi berkas | Nol kesalahan (*zero errors*), nol peringatan (*warnings*). |
| Pemeriksa Tipe | `npx tsc --noEmit` | Sebelum commit / pelaporan | Lolos kompilasi tanpa kompromi tipe `any`. |
| Pengujian Unit | `npm run test` (Vitest `[NEEDS DECISION]`) | Logika bisnis inti (bagian 6.2) | 100% tes pada modul kalkulasi, skor, dan transisi lulus. |
| Pengujian Integrasi | `npm run test:integration` | Alur mutasi database & otorisasi | Kueri publik terbukti menyaring data non-`VERIFIED`. |
| Kompilasi Produksi | `npm run build` | Tahap akhir sebelum rilis/laporan | Bundel produksi berhasil terbuat tanpa peringatan fatal. |
| Audit Dependensi | `npm audit` | Saat penambahan dependensi baru | Nol kerentanan berstatus *high* atau *critical*. |
| Aksesibilitas | axe DevTools / Lighthouse | Halaman antarmuka baru | Skor aksesibilitas Lighthouse >= 95, memenuhi WCAG 2.2 AA. |

---

## 11. Definisi selesai (*Definition of Done*)

Pekerjaan dianggap **belum selesai** jika salah satu poin berikut belum terpenuhi:

- [ ] Logika bisnis berjalan sesuai spesifikasi bagian 4 tanpa deviasi diam-diam.
- [ ] Seluruh input masukan tervalidasi skema Zod di sisi server.
- [ ] Pengujian hak akses RBAC berhasil; akses ilegal terhadap objek privat menghasilkan respon HTTP 404.
- [ ] Pengujian logika inti (TDD) telah ditulis dan lulus 100%.
- [ ] Seluruh perintah `npm run lint`, `npx tsc --noEmit`, dan `npm run build` berhasil dijalankan tanpa galat.
- [ ] Tampilan antarmuka responsif diuji pada lebar 360px, 768px, dan 1280px sesuai standar `DESIGN.md`.
- [ ] Halaman memenuhi seluruh kriteria *Anti-Slop Quality Gate* (`DESIGN.md` bagian 14).
- [ ] Tidak ada berkas yang menyimpan `console.log`, tipe `any`, atau tombol tanpa aksi nyata.
- [ ] Variabel lingkungan baru dicatat pada `.env.example` dan dokumentasi terkait diperbarui.
- [ ] Laporan akhir disusun runut sesuai format bagian 6.5.

---

## 12. Prioritas tingkatan fitur

Pengembangan dilakukan secara disiplin berjenjang:

### Tingkat 1 (Fondasi Wajib & Minimal Berfungsi Penuh)
1. Autentikasi sesi aman dan manajemen 4 peran pengguna.
2. Formulir pelaporan terstruktur 5W+1H dengan validasi Zod lengkap.
3. Skema database: `User`, `Region`, `Report`, `Need`, `Aid`, `Verification`.
4. Rute root `/` terpadu (FINAL: Opsi C): Peta interaktif Leaflet sebagai konten utama dilengkapi bottom sheet pengantar (*orientation layer*) yang dapat ditutup dan dibuka kembali via kontrol bantuan/info.
5. Halaman detail laporan publik (hanya `VERIFIED`) dengan tabel selisih kebutuhan vs bantuan terkonfirmasi.
6. Pencatatan bantuan relawan (`Aid`) dengan validasi transaksi pencegah alokasi berlebih.
7. Alur antrean verifikasi untuk peran `VERIFIKATOR` dan `ADMIN`.
8. Perhitungan skor kepercayaan (*Trust Score*) deterministik dengan daftar alasan terbuka.
9. Dashboard ringkasan wilayah prioritas dan kebutuhan mendesak.
10. Tombol Akses Darurat mengambang yang dapat dibuka luring.
11. Komponen antarmuka dasar dengan transisi halus berbasis Motion.

### Tingkat 2 (Penyempurnaan Lapangan & Ekosistem Terverifikasi)
1. Arsitektur pengiriman luring (*Offline-First Queue*) berbasis IndexedDB dan sinkronisasi idempoten.
2. Modul entitas Lembaga (`Organization`, `OrganizationMember`, verifikasi institusi oleh admin).
3. Verifikasi tingkat `OFFICIAL` oleh lembaga terakreditasi.
4. Unggah foto bukti lapangan dengan kompresi browser dan sanitasi data privasi EXIF.
5. Indikator dan filter laporan data basi (*stale data tracker*).
6. Fitur pembantu AI "Rapikan Laporan ke 5W+1H" (server-side, opsional).
7. Animasi mikro Lottie (di bawah 50 KB) untuk status konfirmasi berhasil/kosong.

### Tingkat 3 (Eksplorasi Visi Lanjutan — Bahan Presentasi Juri)
1. Caching ubin peta offline penuh berskala regional.
2. Lapisan visual spasial risiko bencana InaRISK BNPB.
3. Hak jawab dan klarifikasi resmi penanganan lembaga (`Response`).
4. Ekspor rekapitulasi data bantuan ke format CSV/PDF untuk koordinasi posko darurat.
5. Sistem notifikasi peringatan dini wilayah berbasis Web Push.

---

## 13. Rantai pasok dan tata kelola skill agen AI

Agen AI hanya diperbolehkan menggunakan skill resmi yang telah dievaluasi fungsinya.

### 13.1 Prinsip pemakaian skill
- Jumlah skill yang terpasang aktif dibatasi maksimal 8 skill agar tidak membebani konteks kerja agen.
- Skill bersifat **pemberi masukan teknis**, bukan pemegang keputusan bisnis atau visual. Jika instruksi skill bertentangan dengan `AGENTS.md` atau `DESIGN.md`, kedua dokumen ini adalah pemenang mutlak.
- Dilarang memasang skill secara otomatis tanpa persetujuan tim.

### 13.2 Matriks skill yang terpasang dan aktif (TERVERIFIKASI)

> [!NOTE]
> Skill telah diaudit keamanannya (bebas dari skrip berbahaya), dipasang ke direktori `.agents/skills/` (proyek) dan `~/.gemini/config/skills/` (global), serta terbukti kompatibel dengan Antigravity.

| Nama Skill | Sumber / Lokasi | Peran Kerja | Status |
|---|---|---|---|
| `frontend-design` | `anthropics/skills` (`.agents/skills`) | Arah desain visual antarmuka berkarakter, anti-template. | **TERPASANG (Proyek)** |
| `web-design-guidelines` | `vercel-labs/agent-skills` (`.agents/skills`) | Audit standar web modern, performa antarmuka, dan kepatuhan UI. | **TERPASANG (Proyek)** |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` (`.agents/skills`) | Optimasi performa React & Next.js App Router (RSC, paralel fetch). | **TERPASANG (Proyek)** |
| `accessibility-engineering` | `addyosmani/agent-skills` (`.agents/skills`) | Audit kepatuhan standar WCAG 2.2 AA dan remedi aksesibilitas. | **TERPASANG (Proyek)** |
| `prisma-client-api` | `prisma/skills` (`.agents/skills`) | Panduan kueri model, agregasi aman, dan transaksi Prisma. | **TERPASANG (Proyek)** |
| `antislop` (Suite) | `~/.gemini/config/skills/antislop*` | Filter pencegah generic AI-slop (code, copywriting, human, layout, UI). | **TERPASANG (Global)** |
| `impeccable` | `pbakaus/impeccable` (`~/.gemini/config/skills`) | Penyempurnaan hierarki antarmuka, copywriting, dan detail UX. | **TERPASANG (Global)** |
| `superpowers` | Marketplace (`plugin/superpowers`) | Alur kerja terstruktur (TDD, rencana, debugging, verifikasi). | **Marketplace Plugin** |

---

## 14. Kebijakan animasi dan performa antarmuka

Animasi bertujuan memperjelas hierarki aksi dan perubahan status antarmuka, bukan sebagai dekorasi semata.

- Maksimal 2 pustaka animasi pada bundle aplikasi (Motion untuk transisi, dan dotLottie opsional untuk status).
- Wajib menghormati preferensi pengguna `prefers-reduced-motion: reduce`. Jika aktif, seluruh transisi gerak dinonaktifkan atau diganti dengan transisi pudar instan.
- Animasi antarmuka hanya memanipulasi properti `transform` dan `opacity` yang diakselerasi oleh GPU (kompositor peramban). Dilarang menganimasikan `width`, `height`, `margin`, atau `padding`.
- Peta Leaflet dilarang disematkan efek scroll halus (*smooth scroll*) yang memperlambat interaksi pengguna.
- Aset Lottie (Tingkat 2) dibatasi berukuran di bawah 50 KB per berkas animasi.

---

## 15. Kirim offline (antrean lokal dan sinkronisasi otomatis)

### 15.1 Cakupan versi lomba
Fitur luring difokuskan pada **pengisian formulir laporan dan pencatatan bantuan**. Kerangka cangkang aplikasi (*app shell*) dapat dimuat tanpa sinyal melalui Service Worker. Peta Leaflet menampilkan cache titik yang telah dimuat sebelumnya.

### 15.2 Alur operasional antrean luring
1. Pengguna menekan tombol kirim saat perangkat tidak memiliki koneksi internet.
2. Aplikasi klien mendeteksi ketiadaan sinyal, menghasilkan UUID v4 sebagai `clientId`, mengikat data dengan `userId` akun yang sedang aktif, lalu menyimpannya ke IndexedDB dengan status `MENUNGGU`.
3. UI menampilkan konfirmasi: "Tersimpan di perangkat. Laporan akan dikirim otomatis saat sinyal kembali."
4. Proses sinkronisasi otomatis dipicu ketika:
   - Terdeteksi event browser `window.addEventListener("online")`.
   - Halaman aplikasi dibuka kembali atau tab aktif (`visibilitychange`).
   - Pengguna menekan tombol manual "Kirim Sekarang" pada halaman `/antrean`.
5. Server memproses payload via endpoint idempoten. Jika `clientId` telah tercatat di basis data, server mengembalikan data yang telah tersimpan tanpa membuat duplikasi.
6. Setelah server merespons sukses (200/201), item dengan status `TERKIRIM` langsung **dihapus dari IndexedDB lokal** guna menjaga privasi perangkat.
7. Jika server menolak kiriman (misal: validasi gagal atau laporan induk ditolak), status diubah menjadi `GAGAL` disertai pesan alasan penolakan dan tombol opsi "Perbaiki Data".

### 15.3 Keamanan antrean pada perangkat bersama (*Shared Devices*)
- Setiap baris antrean di IndexedDB wajib menyimpan bidang `userId`.
- Saat membaca antrean di halaman `/antrean`, klien hanya menampilkan item yang cocok dengan ID pengguna yang sedang login.
- Jika pengguna melakukan *Logout*, dilarang menghapus antrean tertunda milik pengguna tersebut secara sembrono; sistem memberi peringatan: "Terdapat draf antrean luring yang belum tersinkronisasi. Pastikan Anda masuk kembali dengan akun yang sama untuk melanjutkan pengiriman."

---

## 16. Manajemen aset non-kode

Aset grafis (foto dokumentasi, logo resmi, favicon, font eksternal, berkas animasi, GeoJSON batas wilayah resmi) merupakan hak prerogatif tim manusia.

- **Agen AI dilarang keras:**
  - Menggambar ilustrasi SVG kompleks buatan sendiri untuk menggantikan kebutuhan foto riil.
  - Mengunduh gambar secara sembarangan dari web tanpa verifikasi lisensi bebas royalti.
  - Mengarang nama korban, nomor darurat, kutipan testimoni, atau logo lembaga resmi (BNPB, BPBD, PMI, Basarnas).
- Seluruh aset sah disimpan di direktori `public/assets/` dan wajib dicatat pada `public/assets/ASSETS.md` mencakup: nama berkas, fungsi, sumber lisensi, pembuat, dan tanggal pengambilan.
- Jika aset belum tersedia, gunakan placeholder teks geometris netral (misal: panel abu-abu dengan label `[Placeholder Foto Dokumentasi 16:9]`).

---

## 17. Layanan darurat dan protokol keselamatan

Aplikasi ini adalah media transparansi informasi logistik, **bukan sistem pemanggilan gawat darurat (bukan pengganti 112/110/115/119)**.

- **Tombol Darurat Cepat (Terapung):**
  - Tampil konsisten di seluruh halaman aplikasi pada pojok layar yang mudah dijangkau satu jempol.
  - Menampilkan teks wajib: *"Dalam kondisi darurat mengancam keselamatan jiwa, hubungi saluran darurat resmi pemerintah segera. Aplikasi ini bukan layanan panggilan tanggap darurat."*
  - Menyediakan daftar nomor kontak darurat nasional yang langsung dapat ditekan via skema `tel:`.
  - Berfungsi 100% tanpa jaringan internet (*cached in service worker*).
- **Nomor Kontak Nasional Rujukan** (`BELUM DIVERIFIKASI`: Tim wajib memverifikasi operasional nomor pada wilayah uji coba):
  - `112`: Layanan Panggilan Darurat Terpadu Nasional (pada wilayah kabupaten/kota yang mendukung).
  - `110`: Kepolisian RI.
  - `113` / `1131`: Pemadam Kebakaran & Penyelamatan.
  - `115`: BASARNAS (Pencarian dan Pertolongan).
  - `117`: Pusat Pengendalian Operasi BNPB.
  - `119`: Layanan Ambulans Gawat Darurat Medis.
- Data kontak dikelola melalui model `EmergencyContact` dan diverifikasi tanggal periksa berkala (`checkedAt`).

---

## 18. Etika kemitraan dan integritas data lembaga

- Aplikasi memposisikan diri sebagai sarana kolaboratif terbuka, bukan kompetitor bagi organisasi kemanusiaan yang telah ada.
- Dilarang mencantumkan logo institusi negara (BNPB, BPBD, Basarnas, Kemensos, PMI) atau organisasi non-pemerintah tanpa bukti perjanjian kerja sama tertulis yang diserahkan oleh tim.
- Akun demo dan organisasi contoh pada database seed wajib menggunakan nama fiktif yang eksplisit (misal: "Komunitas Siaga Mandiri - Wilayah Contoh A").
- Pernyataan kebutuhan atau klaim efektivitas platform wajib ditulis berbasis data teruji atau hipotesis yang jujur di hadapan dewan juri lomba.

---

## 19. Daftar keputusan terbuka (`[NEEDS DECISION]`)

> [!NOTE]
> **Catatan Keputusan Final:** Keputusan Rute Root `/` telah ditetapkan secara **FINAL** pada 19 November 2026 sebagai **Opsi C — Peta Operasional + Bottom Sheet Pengantar** (lihat Bagian 5.2.1 dan `DESIGN.md` Bagian 8.1).  
> Tersisa **20 butir keputusan terbuka** di bawah ini yang memerlukan konfirmasi tertulis dari tim:

| # | Butir Keputusan | Konteks & Alternatif Pilihan | Rekomendasi Teknis | Dampak Arsitektur / Bisnis |
|---|---|---|---|---|
| 1 | Pustaka Autentikasi | Opsi A: Auth.js v5 (NextAuth).<br>Opsi B: iron-session (cookie terenkripsi stateless). | **iron-session** (Lebih ringan, tidak bergantung adapter rumit, sangat mudah diaudit juri). | Menentukan implementasi `lib/auth.ts`, penanganan CSRF, dan variabel env. |
| 2 | Kualifikasi "Verifikator Komunitas" | Opsi A: Pengguna dengan akun khusus peran `VERIFIKATOR`.<br>Opsi B: Pengguna `RELAWAN` yang memiliki reputasi teruji (minimal 3 laporan `VERIFIED`). | **Opsi A** untuk versi lomba demi menjaga kesederhanaan dan kontrol hak akses. | Mempengaruhi aturan RBAC di `lib/access.ts` dan antrean verifikasi. |
| 3 | Status laporan setelah 1 persetujuan verifikator | Opsi A: Tetap `PENDING` dengan status internal `verificationCount = 1`.<br>Opsi B: Menjadi status transisi `PENDING_SECOND_REVIEW`. | **Opsi A** (Mempertahankan 4 status utama pada enum Prisma). | Mempengaruhi kueri agregasi dan filter antrean verifikasi. |
| 4 | Nilai awal & waktu aktivasi `verificationLevel` | Opsi A: Bernilai default `COMMUNITY` saat disetujui verifikator.<br>Opsi B: Nullable, baru terisi nilai saat laporan beralih status ke `VERIFIED`. | **Opsi B** (Nilai `verificationLevel` hanya relevan ketika laporan sudah `VERIFIED`). | Mempengaruhi skema Prisma dan validasi Zod. |
| 5 | Formula final & skala maksimum Trust Score | Skala 0-100 dengan bobot sementara bagian 4.6, atau penyederhanaan indikator biner (Terverifikasi/Belum). | Pertahankan formula skoring deterministik 0-100 dengan daftar alasan terbuka. | Mempengaruhi tampilan badge skor di antarmuka dan modul `lib/trust-score.ts`. |
| 6 | Ambang persentase tingkat kekurangan | Nilai persentase untuk penentuan warna penanda peta: Kekurangan Besar (<30% terpenuhi / >70% selisih), Kekurangan Sedang (30%-80%), Hampir Terpenuhi (>80%). | Gunakan batas: **Merah** (selisih > 50%), **Kuning** (selisih 10%-50%), **Hijau** (selisih < 10%). | Menentukan pewarnaan penanda peta Leaflet (`DESIGN.md` 4.4). |
| 7 | Ambang batas hari data basi (*stale data*) | Ambang waktu tanpa pembaruan logistik: 3 hari, 5 hari, atau 7 hari. | **7 hari** untuk laporan umum; **48 jam** untuk laporan bencana darurat. | Mempengaruhi indikator peringatan visual di detail laporan dan dashboard. |
| 8 | Perhitungan batas atas bantuan | Apakah catatan `Aid` berstatus `PENDING` ikut dihitung dalam mengurangi sisa kuota bantuan yang boleh dicatat? | **Tidak ikut memotong**, namun sistem memberikan peringatan info: "Terdapat X bantuan menunggu konfirmasi". | Menghindari potensi pemblokiran alokasi bantuan riil oleh draf palsu. |
| 9 | Satuan pengukuran (`unit`) dan pemisahan nama bidang | Pemisahan tegas kolom `itemCategory` pada `Need`/`Aid` dan kewajiban enum/string satuan (`unit`). | **Wajib disetujui:** Terapkan kolom `itemCategory` dan `unit` pada `Need` dan `Aid`. | Mencegah bencana matematika kalkulasi agregasi pada kueri database. |
| 10 | Kerangka pengujian otomatis | Vitest vs Jest untuk unit/integrasi. | **Vitest** (Cepat, dukungan bawaan TypeScript dan ESM modern tanpa konfigurasi berat). | Mempengaruhi konfigurasi skrip `package.json` dan CI. |
| 11 | Mekanisme rate limiting serverless | Tabel hitung di PostgreSQL vs Redis (Upstash) vs in-memory LRU. | **Tabel penghitung di PostgreSQL** (Menghemat dependensi luar untuk lingkungan serverless). | Menentukan keamanan endpoint form lapor dan rute login. |
| 12 | Penyedia ubin peta (Tile Provider) & atribusi | CartoDB Positron, OpenStreetMap Standard, atau Mapbox (free tier). | **CartoDB Positron** (Tampilan bersih, kontras tinggi terhadap penanda warna kemanusiaan). | Mempengaruhi konfigurasi Content Security Policy (CSP) dan visual peta. |
| 13 | Metode pengaburan lokasi sensitif | Pembulatan koordinat 2 desimal (~1,1 km) vs Centroid batas desa resmi. | **Pembulatan 2 desimal di server** (Dapat langsung dieksekusi tanpa ketergantungan GeoJSON master). | Menjamin perlindungan privasi kelompok rentan pada respon publik. |
| 14 | Pendekatan pustaka styling antarmuka | Tailwind CSS vs Vanilla CSS Modules. | **Tailwind CSS** dengan konfigurasi token variabel CSS dari `DESIGN.md`. | Menentukan setup konfigurasi frontend dan kecepatan penataan UI. |
| 15 | Pustaka IndexedDB antrean luring | Pustaka tipis `idb` (Jake Archibald) vs Dexie.js. | **idb** (Ukuran sangat kecil ~1 KB, minim abstraksi tersembunyi). | Menentukan implementasi modul klien `lib/offline/db.ts`. |
| 16 | Persetujuan token warna sekunder | Menyetujui nilai heksadesimal warna status dan teks sekunder pada `DESIGN.md` 4.2. | Setujui nilai heksa yang telah divalidasi rasio kontras WCAG 2.2 AA. | Menjadi dasar deklarasi CSS variables di `globals.css`. |
| 17 | Tumpukan tipografi antarmuka | Menggunakan system font stack gratis (ringan) vs memuat Google Font web (Inter / Plus Jakarta Sans). | **System Font Stack** untuk versi lomba (Nol beban jaringan, performa 100% instan). | Mempengaruhi kecepatan First Contentful Paint di jaringan lemah. |
| 18 | Dukungan mode gelap (*Dark Mode*) | Dikerjakan pada versi lomba atau dinonaktifkan (hanya mode terang terkalibrasi). | **Tunda ke Tingkat 2/3**; fokus penuh pada kontras tajam mode terang di lapangan. | Mengurangi kompleksitas audit kontras token warna di antarmuka. |
| 19 | Bentuk geometri penanda peta per kategori | Pemilihan bentuk ikon SVG penanda Leaflet untuk membedakan 6 kategori dan tipe `PEMANTAUAN`. | Terapkan penanda lingkaran penuh untuk `KEBUTUHAN`, dan belah ketupat/garis putus untuk `PEMANTAUAN`. | Memastikan aksesibilitas penanda peta tidak hanya bergantung pada warna. |
| 20 | Aset visual identitas (Logo & Favicon) | Menunggu kiriman aset resmi tim manusia. | Gunakan logo tipografis minimalis sembari menunggu aset final dari tim. | Memenuhi integritas bagian 16 tanpa mengarang aset palsu. |
