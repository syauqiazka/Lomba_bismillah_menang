# DESIGN.md

Sumber kebenaran untuk tampilan, rasa, sistem interaksi, token desain, spesifikasi antarmuka, dan sistem anti-slop.
Aturan kode, aturan bisnis, arsitektur teknis, otorisasi, dan keamanan ada di `AGENTS.md`.

Terakhir diperbarui: 2026-11-19.

---

## 1. Konteks dan filosofi desain

### 1.1 Arah: Humanitarian Intelligence Platform
Platform ini adalah instrumen operasional kemanusiaan yang digunakan relawan, koordinator lapangan, dan masyarakat untuk mengambil keputusan taktis yang cepat, akurat, dan transparan.
- **Bukan situs penggalangan dana**: Tidak ada tombol donasi uang, tidak ada visualisasi kartu rekening bank, dan tidak ada dramatisasi penderitaan.
- **Bukan media sosial**: Tidak ada umpan (*feed*) algoritma yang tak berujung, tidak ada tombol suka (*like*), dan tidak ada metrik popularitas yang dangkal.
- **Berorientasi tindakan nyata**: Menjawab kebutuhan langsung lapangan dengan mengedepankan data selisih logistik dan verifikasi faktual.

### 1.2 Karakter visual dan operasional
- **Tenang & Profesional**: Memberikan rasa kendali dan kepastian di tengah situasi krisis yang panik.
- **Berpusat pada Manusia**: Menghargai martabat pihak terdampak tanpa mengekspos identitas pribadi mereka.
- **Tepercaya & Transparan**: Setiap angka memiliki sumber, tanggal pembaruan, dan status verifikasi yang jelas.
- **Operasional & Berbasis Data**: Mengutamakan tabel keterbacaan tinggi, penanda peta yang tegas, dan angka tabular yang mudah dibandingkan.
- **Ringan & Cepat Diakses**: Dirancang untuk ponsel kelas menengah ke bawah dengan koneksi jaringan 3G yang tidak stabil di area bencana.

### 1.3 Lima pertanyaan operasional dalam 3 detik
Setiap layar antarmuka harus mampu menjawab lima pertanyaan mendasar relawan seketika:
1. **Apa yang sedang terjadi?** (Kategori dan jenis insiden/kebutuhan jelas).
2. **Di mana lokasinya?** (Nama wilayah administratif dan patokan akses aman).
3. **Seberapa mendesak?** (Tingkat urgensi operasional: Darurat, Mendesak, atau Terencana).
4. **Berapa selisih kebutuhan yang belum terpenuhi?** (Kuantitas logistik/tenaga yang riil kurang).
5. **Bagaimana cara membantu?** (Kontak posko/koordinator atau formulir pencatatan bantuan).

---

## 2. Prinsip desain utama

1. **Terbaca dalam 3 Detik**: Status verifikasi dan tingkat kekurangan logistik langsung dikenali tanpa mengharuskan pengguna membaca paragraf narasi panjang.
2. **Warna Tidak Pernah Bekerja Sendirian**: Setiap indikator warna wajib disertai teks penjelas eksplisit dan ikon penegas untuk memastikan aksesibilitas penuh (ramah buta warna).
3. **Transparansi Selalu Terlihat**: Tanggal pembaruan data, tingkat verifikasi, dan rincian pembentuk skor kepercayaan diletakkan berdampingan dengan data pokok.
4. **Ringan pada Jaringan Buruk**: Menghindari beban grafis berat, gambar beresolusi raksasa, font web berlebih, atau pustaka animasi yang tidak esensial.
5. **Peta dan Tabel Selisih sebagai Pahlawan Utama**: Identitas platform diwakili oleh kejelasan peta Leaflet dan ketegasan tabel perbandingan selisih. Elemen di luar itu tampil tenang dan fungsional.
6. **Mobile-First Realistis**: Dirancang dengan basis layar terkecil 360 px pada genggaman satu tangan, sebelum diregangkan ke layar tablet dan desktop.
7. **Setiap Elemen Memiliki Alasan Fungsional**: Segala ornamen visual yang hanya berfungsi sebagai dekorasi tanpa mendukung pengambilan keputusan relawan **wajib dieliminasi**.

---

## 3. Referensi desain eksternal

> [!NOTE]
> **Status:** Seluruh referensi berikut berstatus **KANDIDAT ACUAN / `BELUM DIVERIFIKASI`**. Tim belum melakukan audit langsung pada situs yang bersangkutan. Referensi digunakan sebagai pembanding pola antarmuka dan struktur informasi, bukan untuk disalin mentah identitasnya.

| Platform Referensi | Pola yang Diadaptasi | Pola yang Dilarang Disalin | Halaman yang Memperoleh Manfaat |
|---|---|---|---|
| **Ushahidi** | Struktur penyajian laporan berbasis geospasial, filter kategori insiden, panel detail lokasi. | Identitas visual gelap, alur crowdsourcing terbuka tanpa proses kurasi ketat. | Peta interaktif, Detail laporan. |
| **UNHCR Operational Data Portal** | Hierarki visual statistik agregat, tabel persebaran wilayah, kesederhanaan ringkasan angka. | Warna merek biru UNHCR, logo resmi PBB, grafik makro yang rumit. | Dashboard statistik publik. |
| **HOT Tasking Manager** | Alur verifikasi antrean kerja, status validasi data bertahap, transparansi progres penyelesaian. | Istilah teknis pemetaan OpenStreetMap yang membingungkan relawan umum. | Dashboard verifikator (`/verifikasi`). |
| **Our World in Data** | Ketegasan visualisasi grafik batang, tipografi editorial bersih, pemisahan data jelas. | Format artikel naratif yang terlalu panjang untuk penggunaan taktis lapangan. | Tabel & visualisasi selisih logistik. |
| **PetaBencana.id** | Keselarasan dengan konteks bencana di Indonesia, interaksi peta responsif. | Penekanan warna oranye/kuning cerah yang terlalu dominan pada seluruh bidang layar. | Sistem peta dan kartu ringkasan wilayah. |
| **GOV.UK Design System** | Struktur formulir bertahap (*one question per screen*), kejelasan teks pesan galat, rasio kontras ekstrem. | Font khusus GDS Transport, ikon mahkota kerajaan, aset resmi pemerintah Inggris. | Formulir pelaporan 5W+1H, formulir masuk (`/login`). |

---

## 4. Sistem warna dan token desain

Perhitungan rasio kontras dilakukan menggunakan rumus standar **WCAG 2.2 relative luminance**.
- Standar teks normal: minimal 4,5:1
- Standar teks besar (>= 24px atau >= 18.66px bold): minimal 3:1
- Standar komponen antarmuka dan elemen grafis informatif: minimal 3:1

### 4.1 Palet warna dasar (FINAL)

| Nama Warna | Kode Heksadesimal | Peran & Penggunaan Utama |
|---|---|---|
| **Canvas** | `#F5F6F3` | Latar belakang halaman aplikasi; memberikan rasa tenang dan tidak menyilaukan di luar ruangan. |
| **White** | `#FFFFFF` | Permukaan panel kontrol, latar belakang kartu data, form input, dan kontur pemisah. |
| **Navy** | `#172B3A` | Teks utama, judul, navigasi induk, kontur batas tombol sekunder, dan klaster peta netral. |
| **Forest** | `#246B50` | Aksen tindakan utama, tombol konfirmasi, dan indikator "Bantuan Hampir Terpenuhi". |
| **Amber** | `#E5A13A` | Penanda latar "Kekurangan Sedang". **Hanya untuk warna bidang latar/isi, dilarang untuk warna teks.** |
| **Alert** | `#D85B52` | Elemen grafis besar non-teks. Dilarang untuk teks kecil. |
| **Alert Dark** | `#B83E37` | Teks galat, tombol bahaya/darurat, penanda "Kekurangan Besar" (>50% selisih). |
| **Neutral** | `#8A8D86` | Penanda "Belum Ada Data", batas kontrol form aktif, teks keterangan non-kritis. |

### 4.2 Pemetaan token CSS variables (`SEMENTARA`)

Seluruh token berikut wajib dideklarasikan di satu berkas `app/globals.css`:

```css
:root {
  /* Latar & Permukaan */
  --color-bg: #F5F6F3;
  --color-surface: #FFFFFF;
  --color-surface-hover: #ECEEEA;
  
  /* Tipografi */
  --color-text: #172B3A;             /* Kontras 14,55:1 terhadap White; 13,42:1 terhadap Canvas */
  --color-text-secondary: #4A5864;   /* Kontras 7,31:1 terhadap White; 6,74:1 terhadap Canvas */
  --color-text-muted: #6B7077;       /* Kontras 4,99:1 terhadap White */
  
  /* Aksi & Status Pokok */
  --color-primary: #246B50;          /* Kontras teks putih di atasnya: 6,38:1 */
  --color-primary-hover: #1B5440;    /* Kontras teks putih di atasnya: 8,79:1 */
  --color-secondary: #172B3A;
  --color-focus: #172B3A;            /* Cincin fokus 2px dengan offset 2px putih */
  
  /* Pembatas & Garis */
  --color-border: #D3D7D0;           /* Garis pemisah dekoratif */
  --color-border-strong: #8A8D86;    /* Batas input, radio, checkbox (Kontras 3,37:1 di atas White) */
  
  /* Status Fungsional Antarmuka */
  --color-success-text: #1B5440;
  --color-success-bg: #E4F0EA;       /* Kontras teks terhadap latar: 7,51:1 */
  
  --color-warning-text: #8A5A00;
  --color-warning-bg: #FBF0DC;       /* Kontras teks terhadap latar: 5,25:1 */
  
  --color-danger-text: #B83E37;
  --color-danger-bg: #F8E5E3;        /* Kontras teks terhadap latar: 4,58:1 */
  
  --color-info-text: #245C8A;
  --color-info-bg: #E3EDF6;          /* Kontras teks terhadap latar: 5,96:1 */
}
```

### 4.3 Kombinasi warna yang dilarang keras (Hasil Uji Rasio Kontras)

| Kombinasi yang Diuji | Rasio Kontras | Status Evaluasi | Aturan Larangan |
|---|---|---|---|
| Teks Amber (`#E5A13A`) di atas White (`#FFFFFF`) | 2,21:1 | **GAGAL FATAL** | Dilarang keras menggunakan warna Amber sebagai warna teks atau garis tipis. Amber hanya boleh digunakan sebagai latar belakang dengan teks Navy di atasnya (rasio 6,58:1). |
| Teks Putih (`#FFFFFF`) di atas Alert (`#D85B52`) | 3,79:1 | **GAGAL TEKS NORMAL** | Gagal untuk teks berukuran normal (<24px). Gunakan `Alert Dark` (`#B83E37`) untuk tombol dan teks penanda. |
| Teks Neutral (`#8A8D86`) di atas White/Canvas | 3,37:1 | **GAGAL TEKS NORMAL** | Tidak memenuhi batas 4,5:1. Dilarang untuk teks bacaan. Gunakan `--color-text-secondary`. |
| Teks Putih (`#FFFFFF`) di atas Neutral (`#8A8D86`) | 3,37:1 | **GAGAL TEKS NORMAL** | Gagal untuk teks informasi. Gunakan teks Navy di atas Neutral untuk elemen grafis. |
| Forest (`#246B50`) di atas Navy (`#172B3A`) | 2,28:1 | **GAGAL TOTAL** | Dilarang menempatkan kedua warna aksen ini secara bertumpuk. |

### 4.4 Pewarnaan tingkat kekurangan logistik (Penanda Peta & Tabel)

> [!IMPORTANT]
> **Skala warna penanda peta hanya diperuntukkan bagi persentase selisih kebutuhan logistik.**
> Tingkat urgensi laporan (`DARURAT`, `MENDESAK`, `TERENCANA`) **dilarang menggunakan skala warna penanda ini**, melainkan disajikan lewat lencana (*badge*) teks terpisah dengan ikon Lucide spesifik.

| Tingkat Kekurangan | Nilai Heksa | Teks Label Wajib | Ikon Pendamping | Kontras Teks / Ikon |
|---|---|---|---|---|
| **Kekurangan Besar** (Selisih > 50%) | `#B83E37` (Alert Dark) | "Kekurangan Besar" | Ikon Segitiga Peringatan (Putih) | 5,55:1 (Lolos AA) |
| **Kekurangan Sedang** (Selisih 10% - 50%) | `#E5A13A` (Amber) | "Kekurangan Sedang" | Ikon Titik Perhatian (Navy) | 6,58:1 (Lolos AA) |
| **Hampir Terpenuhi** (Selisih < 10%) | `#246B50` (Forest) | "Hampir Terpenuhi" | Ikon Centang Ganda (Putih) | 6,38:1 (Lolos AA) |
| **Belum Ada Data Kebutuhan** | `#8A8D86` (Neutral) | "Belum Ada Data" | Ikon Garis Datar / Tanda Tanya | 4,32:1 (Grafis 3:1) |

- **Garis Kontur Penanda Peta:** Seluruh penanda peta Leaflet wajib diberi garis luar (*stroke*) putih solid berketebalan 2 px untuk menjaga keterpisahan visual dari ubin peta.

### 4.5 Lencana status verifikasi laporan

| Status Laporan | Label Tampilan Antarmuka | Token Tampilan | Ikon Lucide |
|---|---|---|---|
| `PENDING` | "Menunggu Verifikasi" | Background `--color-info-bg`, Teks `--color-info-text` | `Clock` (Jam) |
| `VERIFIED` + `COMMUNITY` | "Diverifikasi Komunitas (2 Verifikator)" | Background `--color-success-bg`, Teks `--color-success-text` | `Users` (Dilarang memakai lencana segel resmi garuda/pemerintah) |
| `VERIFIED` + `OFFICIAL` | "Diverifikasi Lembaga: [Nama]" | Background `--color-success-bg`, Teks `--color-success-text` + Border Forest | `ShieldCheck` |
| `NEEDS_REVISION` | "Perlu Revisi Pelapor" | Background `--color-warning-bg`, Teks `--color-warning-text` | `RotateCcw` |
| `REJECTED_FINAL` | "Ditolak Permanen" | Background `--color-danger-bg`, Teks `--color-danger-text` | `XCircle` |

### 4.6 Kebijakan mode gelap (*Dark Mode*)
Mode gelap **ditunda ke rilis Tingkat 2/3 `[NEEDS DECISION]`**. Seluruh pengembangan versi lomba difokuskan 100% pada keterbacaan mode terang di bawah sinar matahari langsung saat operasional lapangan.

---

## 5. Tipografi dan tata angka

### 5.1 Tumpukan font sistem (`SEMENTARA`)
Guna memangkas beban jaringan dan menghindari lonjakan tata letak (*Cumulative Layout Shift*), aplikasi menggunakan tumpukan font sistem bawaan perangkat:
```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

### 5.2 Skala ukuran tipografi

| Tingkatan Peran | Ukuran Font / Line-Height | Bobot | Aturan Penerapan |
|---|---|---|---|
| **Display Title** | 36px / 44px (Mobile), 44px / 52px (Desktop) | 700 (Bold) | Hanya digunakan pada judul pengantar utama platform. |
| **Heading 1 (H1)** | 28px / 36px (Mobile), 32px / 40px (Desktop) | 700 (Bold) | Satu judul utama per halaman; menjelaskan entitas atau konteks layar. |
| **Heading 2 (H2)** | 22px / 30px | 600 (Semibold) | Pemisah seksi utama (misal: "Tabel Kebutuhan vs Bantuan"). |
| **Heading 3 (H3)** | 18px / 26px | 600 (Semibold) | Judul panel samping, kartu ringkasan, atau sub-seksi form. |
| **Body Utama** | 16px / 24px | 400 (Regular) | Teks bacaan dasar; seluruh masukan form (`<input>`) berukuran minimal 16px agar browser iOS tidak melakukan *auto-zoom* paksa. |
| **Body Ringkasan** | 18px / 28px | 500 (Medium) | Paragraf pengantar dan narasi ringkas 5W+1H. |
| **Label & Tombol** | 14px / 20px (Kecil), 16px / 24px (Normal) | 600 (Semibold) | Huruf kapital hanya pada huruf pertama kata; dilarang menggunakan ALL-CAPS berjarak lebar. |
| **Keterangan / Caption** | 13px / 18px | 400 (Regular) | Tanggal pembaruan, sumber lembaga, dan teks bantuan form (`--color-text-secondary`). |
| **Data Selisih Menonjol** | 28px / 34px | 700 (Bold) | Angka selisih kuantitas logistik pada tabel dan ringkasan. |

### 5.3 Aturan visualisasi angka operasional
- Seluruh angka kuantitas, selisih logistik, persentase, tanggal, dan koordinat **wajib mengaktifkan properti CSS `font-variant-numeric: tabular-nums`**.
- Pada tabel data, angka kuantitas wajib diratakan ke sisi kanan (*text-align: right*).
- Satuan kuantitas (misal: `karung`, `kotak`, `orang`) ditulis berdampingan dengan angka tanpa singkatan ambigu.

---

## 6. Spasi, grid, dan tata letak (*Layout*)

### 6.1 Sistem spasi (Kelipatan 4 px)
Skala spasi: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`.
- Jarak antar-elemen form: `16px` hingga `24px`.
- Padding dalam kartu data: `16px` (Mobile), `24px` (Desktop).

### 6.2 Titik henti (*Breakpoints*) responsif
- `360px`: Layar ponsel terkecil yang didukung secara penuh (batas minimum).
- `480px`: Ponsel berukuran menengah/besar.
- `768px`: Tablet orientasi portrait.
- `1024px`: Tablet orientasi landscape / Laptop standar.
- `1280px`: Desktop lebar (lebar kontainer konten maksimal 1200 px).

### 6.3 Radius sudut (*Border Radius*)
- `4px`: Tombol kecil, badge lencana status, elemen kontrol form (input, select, checkbox).
- `8px`: Kartu data, panel samping, modal dialog, dan bottom sheet.
- `9999px` (Bulat penuh): Hanya untuk penanda peta titik koordinat dan avatar pengguna.

### 6.4 Sistem bayangan (*Shadow Elevation*)
Platform ini **hanya mengizinkan satu jenis bayangan tunggal** untuk mempertahankan ketajaman tampilan dan performa render perangkat:
```css
--shadow-elevated: 0 1px 3px rgba(23, 43, 58, 0.12), 0 1px 2px rgba(23, 43, 58, 0.08);
```
Dilarang menggunakan bayangan bertingkat (*multi-layered blurred shadows*) atau bayangan berwarna (*colored glow*).

### 6.5 Tingkatan tumpukan lapisan visual (*Z-Index Stack*)
```css
--z-content: 0;
--z-map: 1;                 /* Lapisan Leaflet diisolasi dengan isolation: isolate */
--z-header: 1000;           /* Navigasi atas tetap */
--z-bottom-sheet: 1100;     /* Panel pengantar / ringkasan lokasi di mobile */
--z-floating-emergency: 1200; /* Tombol darurat melayang */
--z-modal: 1300;            /* Dialog konfirmasi dan direktori darurat */
--z-toast: 1400;            /* Pemberitahuan sinkronisasi offline */
```

---

## 7. Spesifikasi sistem komponen

Setiap komponen dirancang dengan kelengkapan state: *Default, Hover, Focus, Active, Disabled, Loading, Error*.

### 7.1 Tombol (*Button*)
- **Variasi**:
  - *Primary*: Latar `--color-primary`, teks putih. Satu tombol per viewport.
  - *Secondary*: Latar transparan/putih, border 1px `--color-secondary`, teks Navy.
  - *Danger*: Latar `--color-danger-bg`, teks `--color-danger-text`, border 1px `--color-danger-text`.
- **Dimensi**: Tinggi minimal 44 px (layar sentuh mobile); tombol besar 48 px.
- **State Aksesibilitas**: Cincin fokus 2 px `--color-focus` dengan jarak offset 2 px saat navigasi keyboard.
- **Label Aksi**: Wajib berupa kata kerja nyata (misal: "Simpan Laporan", "Konfirmasi Bantuan", bukan "OK" atau "Submit").

### 7.2 Kontrol formulir (*Input, Textarea, Select*)
- Label diletakkan di sisi atas kolom input (terhubung menggunakan atribut `id` dan `htmlFor`). Dilarang mengandalkan placeholder sebagai pengganti label.
- Teks bantuan instruksional diletakkan di bawah label dan sebelum kolom input.
- Pesan galat tampil di bawah kolom input dengan ikon peringatan dan warna `--color-danger-text`. Dilengkapi atribut `aria-invalid="true"` dan `aria-describedby="[id-error]"`.
- Batas kontrol input menggunakan `--color-border-strong` (rasio kontras 3,37:1 di atas latar putih).

### 7.3 Tabel selisih kebutuhan vs bantuan
- Komponen paling penting dalam platform.
- Menggunakan elemen HTML semantik `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`.
- Kolom wajib: `Kategori & Barang`, `Satuan`, `Kebutuhan`, `Terkonfirmasi`, **`Selisih Kurang` (Dicetak tebal 700, teks gelap berlatar halus)**.
- Pada tampilan ponsel (<768px): Tabel otomatis bertransformasi menjadi susunan baris bertumpuk (*stacked row list*) dengan label pasangan nilai di setiap baris, bukan digulir secara horizontal yang rawan terpotong.

### 7.4 Tombol Akses Darurat (Mengambang)
- Tombol permanen di pojok kanan bawah layar (tinggi 48-56 px, target sentuh >= 56x56 px).
- Warna kontras tinggi (`#B83E37` Alert Dark, teks putih tebal, ikon `PhoneCall`).
- Membuka modal direktori nomor darurat nasional dan kontak posko lokal secara instan tanpa ketergantungan sinyal internet.

### 7.5 Kartu ringkasan lokasi peta (*Location Card*)
- Ditampilkan saat penanda peta ditekan (Desktop: panel samping selebar 380px; Mobile: bottom sheet geser).
- Menyajikan: Nama desa/wilayah, lencana urgensi, penanda tingkat kekurangan logistik, 2 kebutuhan logistik terbesar, tanggal pembaruan, dan tombol aksi "Buka Rincian Lengkap".

---

## 8. Spesifikasi antarmuka halaman

### 8.1 Spesifikasi Rute Root `/`: Peta Operasional + Bottom Sheet Pengantar (FINAL: Opsi C)

> [!NOTE]
> **Status Keputusan:** **FINAL (Opsi C)**  
> **Tanggal Disetujui:** 19 November 2026  
> Halaman utama `/` secara resmi ditetapkan sebagai **Peta Operasional Interaktif yang dilengkapi Lapisan Pengantar (Bottom Sheet)**. Rute root ini bukan halaman pemasaran (*landing page*). Jika kelak dibutuhkan halaman pemasaran khusus, hal tersebut harus diletakkan pada rute terpisah (misal `/tentang`) melalui keputusan tim baru.

#### A. Kontrak Antarmuka & Alur Interaksi
1. **Peta Konten Utama:** Peta Leaflet langsung dimuat dan membentang penuh (*full viewport*) di latar belakang sejak pengguna pertama kali membuka aplikasi.
2. **Bottom Sheet Pengantar (*Initial Orientation Layer*):**
   - Muncul di atas kanvas peta saat kunjungan pertama untuk memberikan orientasi instan kepada pengguna.
   - **Tampilan Visual:** Permukaan putih `--color-surface`, border 1px `--color-border`, sudut atas membulat 8px (mobile: radius-t 12px), dengan bayangan `--shadow-elevated`.
   - **Konten Inti:**
     - *Judul:* "Humanitarian Intelligence Platform" (H2/H3 Navy `#172B3A`, bobot 700).
     - *Ringkasan Singkat:* 1–2 kalimat pengantar bahwa platform ini adalah alat transparansi logistik lapangan, bukan situs penggalangan dana.
     - *Panduan 3 Detik:*
       - **Peta Kebutuhan:** Arti warna penanda logistik (Merah: Selisih >50%, Kuning: 10%-50%, Hijau: <10%).
       - **Selisih Transparan:** Menjelaskan cara membaca kebutuhan yang belum terpenuhi per satuan barang/tenaga.
       - **Verifikasi Faktual:** Informasi dikurasi oleh relawan terpercaya dan diverifikasi lembaga resmi.
3. **Kontrol Penutup yang Jelas:**
   - Tombol utama: "Jelajahi Peta Langsung" (Primary Forest `#246B50`, teks putih tebal, tinggi 44px).
   - Ikon tombol silang (`X`) di pojok kanan atas sheet dengan atribut aksesibel `aria-label="Tutup pengantar"`.
   - Mendukung penutupan via tombol keyboard `Escape`.
   - Pada layar sentuh mobile: mendukung gestur sapuan ke bawah (*swipe down to dismiss*).
4. **Peta Penuh Pasca-Penutupan:**
   - Begitu sheet ditutup, peta membentang penuh tanpa ada sisa ruang kosong atau elemen yang memblokir tampilan data geospasial.
5. **Mekanisme Buka Ulang (*Reopen Control*):**
   - Kontrol pemicu permanen (ikon tombol `HelpCircle` atau tombol berlabel "Panduan") disematkan secara konsisten pada bar kontrol peta atau header navigasi atas.
   - Mengetuk tombol ini memunculkan kembali bottom sheet pengantar seketika.
6. **Bebas Obstruksi Permanen:**
   - Bottom sheet tidak boleh menutupi kontrol peta esensial (tombol zoom di sisi kiri/kanan atas, pemilih filter, dan Tombol Akses Darurat di pojok kanan bawah).
   - Z-index bottom sheet diatur pada `--z-bottom-sheet` (1100), berada di bawah tombol darurat (`1200`).
7. **Perilaku Responsif:**
   - **Mobile (<768px):** Menempel di sisi bawah layar (*fixed bottom sheet*). Tinggi sheet fleksibel maksimal 55vh, dilengkapi bilah pegangan geser (*drag handle*) 36x4px abu-abu di bagian atas. Gestur cubit/geser di luar area sheet langsung diterima oleh peta.
   - **Desktop (>=1024px):** Ditampilkan sebagai panel kartu mengambang proporsional di sisi kiri bawah layar (lebar 380px–420px, offset 24px dari tepi), atau panel bawah terpusat dengan padding aman, sehingga minimal 65% area peta tetap terlihat dan dapat langsung dioperasikan.
8. **Aksesibilitas (WCAG 2.2 AA):**
   - Atribut semantik: `role="region"` dengan `aria-label="Pengantar Platform"` dan `aria-expanded="true/false"`.
   - Kontrol interaktif di dalam sheet dapat dijelajahi dengan urutan `Tab` yang logis.
   - Saat sheet ditutup via `Escape`, fokus otomatis dikembalikan ke tombol pemicu panduan di kanvas peta.
   - Seluruh teks memenuhi batas kontras minimum 4,5:1.

---

### 8.2 Matriks spesifikasi halaman

| Halaman & Rute | Pengguna Utama | Prioritas Hierarki Konten | Pola Tata Letak Responsif | Ketentuan Khusus & Aksesibilitas |
|---|---|---|---|---|
| **Peta Operasional + Pengantar** (`/`) — **FINAL (Opsi C)** | Relawan lapangan, publik | 1) Peta Leaflet penuh langsung aktif, 2) Bottom sheet pengantar (dapat ditutup/dibuka ulang), 3) Bar filter cepat (kategori, status), 4) Panel ringkasan lokasi terpilih, 5) Tombol alternatif tabel teks. | Layar penuh; panel samping pada desktop, bottom-sheet geser pada mobile. | **Wajib menyediakan tombol "Lihat Sebagai Daftar Teks"** untuk pembaca layar & sinyal lambat. Rute `/` bebas dari landing page pemasaran. |
| **Detail Laporan** (`/laporan/[id]`) | Relawan, publik (laporan `VERIFIED`) | 1) Judul lokasi & waktu kejadian, 2) Lencana verifikasi & skor kepercayaan, 3) **Tabel Selisih Logistik**, 4) Narasi 5W+1H, 5) Kontak koordinator (hanya login). | 1 Kolom sempit di mobile; 2 Kolom asimetris di desktop (Tabel selisih di kiri, riwayat verifikasi di kanan). | Laporan `PEMANTAUAN` dilarang memunculkan tabel selisih. Akses laporan non-`VERIFIED` oleh publik menghasilkan 404. |
| **Formulir Lapor** (`/lapor`) | Relawan terdaftar | 1) Pemilihan jenis laporan, 2) Isian 5W+1H bertahap, 3) Penambahan item kebutuhan & satuan, 4) Tombol simpan luring. | Formulir satu kolom terpusat (maksimal 680 px) dengan indikator langkah. | Mendukung penyimpanan ke antrean lokal IndexedDB jika koneksi jaringan terputus. |
| **Dashboard Publik** (`/dashboard`) | Publik, wartawan, koordinator | 1) Metrik agregat nasional/wilayah, 2) Daftar daerah paling kekurangan, 3) Rekap kebutuhan tertinggi. | Grid kartu data ringkas + tabel perbandingan wilayah. | Dilarang menampilkan data mentah non-`VERIFIED`. Angka `PENDING` hanya tampil sebagai total agregat. |
| **Antrean Verifikasi** (`/verifikasi`) | Peran `VERIFIKATOR` | 1) Daftar tunggu laporan `PENDING`, 2) Panel periksa bukti foto & skor, 3) Tombol aksi Setuju/Minta Revisi/Tolak. | Tampilan daftar-detail (HOT style): List laporan di sisi kiri, lembar periksa bukti di sisi kanan. | Tombol tolak/minta revisi wajib memicu modal pengisian alasan catatan minimal 10 karakter. |
| **Panel Admin** (`/admin`) | Peran `ADMIN` | 1) Manajemen akun & peran, 2) Master data wilayah, 3) Kontak darurat, 4) Verifikasi lembaga kemanusiaan. | Layout dashboard dengan navigasi samping (*sidebar*) desktop. | Tindakan destruktif (hapus/blokir) wajib konfirmasi ganda teks. |
| **Masuk / Login** (`/login`) | Seluruh pengguna terdaftar | 1) Kolom pengenal (email/nomor), 2) Kata sandi, 3) Tombol masuk, 4) Tautan registrasi relawan. | Kotak form terpusat sederhana tanpa elemen visual dekoratif yang mengganggu. | Pesan galat autentikasi bersifat netral ("Identitas atau kata sandi tidak cocok") demi mencegah kebocoran user. |
| **Antrean Offline** (`/antrean`) | Relawan lapangan | 1) Status antrean lokal perangkat, 2) Daftar draf tersimpan, 3) Tombol paksa sinkronisasi. | Daftar kartu draf berstatus: Menunggu, Mengirim, Gagal. | Draf gagal menyertakan tombol edit perbaikan data dan pesan galat server. |

---

## 9. Sistem desain peta interaktif (Leaflet)

1. **Pewarnaan Penanda Geospasial**:
   - Ditentukan secara ketat oleh persentase selisih kebutuhan logistik (bagian 4.4).
   - Bentuk penanda laporan `KEBUTUHAN`: Lingkaran solid berdiameter 32px dengan kontur putih 2px dan ikon Lucide kategori di dalamnya.
2. **Penanda Khusus Laporan `PEMANTAUAN`**:
   - Laporan pemantauan lingkungan/sosial yang tidak memiliki selisih logistik ditampilkan dengan **bentuk geometris belah ketupat (*diamond*) berkontur tanpa latar penuh**, menggunakan warna Navy/Neutral. Dilarang menggunakan warna merah atau hijau tingkat kekurangan logistik.
3. **Klasterisasi Titik (*Clustering*)**:
   - Klaster menggunakan warna netral Navy (`#172B3A`) dengan angka penunjuk jumlah titik di tengahnya.
   - Klaster dilarang diberi warna merah/kuning/hijau agar tidak disalahartikan sebagai level bahaya regional.
4. **Interaksi Penanda**:
   - Mengetuk penanda tidak membuka tooltip bawaan Leaflet yang kecil, melainkan membuka kartu ringkasan lokasi terstruktur.
5. **Aksesibilitas Alternatif Peta**:
   - Di atas kanvas peta disediakan tombol yang selalu terlihat: *"Tampilkan data peta dalam format tabel teks"*. Tombol ini membuka daftar lokasi terurut tingkat kebutuhan untuk pembaca layar atau pengguna dengan koneksi data lambat.
6. **Lisensi & Atribusi Ubin Peta**:
   - Menampilkan atribusi legal penyedia ubin peta di pojok kanan bawah kanvas peta.
   - Penyedia yang digunakan: **OpenStreetMap Standard** (bebas watermark, tanpa API key, 100% terbuka dan kaya detail wilayah Indonesia).

---

## 10. Visualisasi data selisih

- **Diagram Batang Selisih Horizontal**:
  - Batang terbagi menjadi dua segmen: Bagian terkonfirmasi (Warna Forest `#246B50`) dan bagian selisih kekurangan (Warna Alert Dark `#B83E37`).
  - Setiap batang wajib mencantumkan angka nilai riil di atas/dalamnya, tidak hanya mengandalkan skala sumbu grafis.
- **Tabel Selisih adalah Sumber Utama**: Diagram grafis hanya pelengkap visual; tabel teks terstruktur tetap menjadi elemen primer pembacaan data.
- **Pembedaan Data Kosong vs Nol**:
  - Jika suatu kebutuhan bernilai 0 (sudah terpenuhi), tuliskan secara gamblang `0 [satuan] (Terpenuhi)`.
  - Jika data belum tercatat atau belum dilaporkan, tuliskan tanda pisah `—` atau label `Belum ada data`, **dilarang menampilkan angka 0** yang menyesatkan.
- **Indikator Data Basi (*Stale Data Warning*)**:
  - Angka yang tidak diperbarui selama lebih dari batas waktu yang ditentukan diberi ikon jam pasir dan label peringatan latar kuning `--color-warning-bg`.

---

## 11. Interaksi, gerak (*Motion*), dan micro-interactions

Penerapan gerak mengacu pada aturan performa `AGENTS.md` bagian 14.

### 11.1 Parameter transisi antarmuka (`SEMENTARA`)
- **Durasi Mikro**: 150 ms – 200 ms untuk respon tombol, toggle, dan hover.
- **Durasi Makro**: 250 ms – 300 ms untuk pergeseran panel samping, modal masuk, dan bottom-sheet.
- **Kurva Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (Transisi keluar halus tanpa pantulan elastis berlebihan).
- **Properti yang Boleh Dianimasikan**: Hanya `opacity` dan `transform` (`translateY`, `scale`).

### 11.2 Sinkronisasi implementasi animasi (Tingkat 1 vs Tingkat 2)
- **Tingkat 1 (Wajib & Default)**: Seluruh indikator pemuatan (*loading*), konfirmasi sukses, dan transisi modal **wajib menggunakan komponen CSS native atau animasi SVG ringan bawaan**.
- **Tingkat 2 (Opsional)**: Animasi dotLottie/Lottie (<50 KB) hanya diterapkan sebagai peningkatan kosmetik halus jika aset berkas telah disediakan oleh tim. **Dilarang menahan penyelesaian fitur Tingkat 1 hanya demi menunggu aset Lottie.**

### 11.3 Kepatuhan preferensi gerak (*Reduced Motion*)
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 12. Aksesibilitas komprehensif (Target: WCAG 2.2 Level AA)

1. **Rasio Kontras Terkalibrasi**: Seluruh pasangan warna teks dan latar belakang mematuhi tabel pengujian pada bagian 4.
2. **Ukuran Target Sentuh (WCAG 2.5.8)**: Seluruh elemen interaktif memiliki bidang klik minimal 44x44 px dengan jarak aman antar-elemen minimal 8 px.
3. **Fokus Tidak Tertutup (WCAG 2.4.11)**: Elemen tetap di layar (*sticky header*, *floating emergency button*, *bottom sheet*) tidak boleh menutupi elemen masukan yang sedang menerima fokus navigasi keyboard.
4. **Navigasi Keyboard Penuh**:
   - Seluruh form, filter peta, dan modal dialog dapat dioperasikan penuh via tombol `Tab`, `Panah`, `Spasi`, `Enter`, dan `Escape`.
   - Disediakan tautan pintas *"Lompat ke konten utama"* (*Skip to content*) di baris teratas dokumen HTML.
5. **Dukungan Pembaca Layar (*Screen Reader*)**:
   - Menggunakan elemen semantik (`<main>`, `<nav>`, `<header>`, `<article>`, `<section>`).
   - Ikon yang tidak memiliki teks pendamping wajib diberi atribut `aria-label` yang bermakna. Ikon dekoratif diberi `aria-hidden="true"`.
   - Status pembaruan jaringan dan antrean offline diumumkan secara sopan menggunakan kontainer `aria-live="polite"`.

---

## 13. Perilaku responsif lintas perangkat

- **Ponsel Lebar 360 px**:
  - Tata letak satu kolom penuh.
  - Peta membentang penuh layar dengan panel informasi berupa bottom-sheet yang dapat disapu (*swipeable*).
  - Tabel data bertransformasi menjadi daftar kartu pasangan kunci-nilai.
  - Tombol Darurat tetap berada di posisi aman tanpa menutupi tombol simpan form.
- **Tablet (768 px – 1023 px)**:
  - Tata letak 8 kolom. Filter peta tampil sebagai panel laci samping yang dapat disembunyikan.
- **Desktop (>= 1024 px)**:
  - Tata letak 12 kolom dengan lebar kontainer maksimal 1200 px.
  - Peta berdampingan dengan panel informasi stasioner.
  - Antrean verifikasi menggunakan tata letak dua bilah terpisah (daftar antrean di kiri, lembar periksa bukti di kanan).
- **Layar Pendek (Tinggi < 600 px / Ponsel Lanskap)**:
  - Header navigasi menciut (*compact*), modal dialog membatasi tinggi maksimal 85vh dengan bilah gulir vertikal internal yang jelas.

---

## 14. Sistem Anti-Slop Design (Keputusan Berbobot, Bukan Dekorasi Generik)

### 14.1 Filosofi Anti-Slop
Antarmuka Humanitarian Intelligence Platform harus mencerminkan kepedulian manusia dan ketepatan instrumen lapangan. Desain harus terlihat **dibuat berdasarkan keputusan desain yang matang**, bukan sekadar susunan template otomatis generator AI.

### 14.2 Matriks skill penjamin kualitas visual yang terpasang dan aktif (TERVERIFIKASI)

> [!NOTE]
> Skill telah terpasang di direktori `.agents/skills/` (proyek) dan `~/.gemini/config/skills/` (global). Skill berfungsi sebagai alat bantu evaluasi (*advisor*), bukan penentu aturan baru. Jika saran skill bertentangan dengan token `DESIGN.md`, dokumen ini memegang kendali mutlak.

| Skill | Lokasi / Sumber | Tanggung Jawab Evaluasi | Status |
|---|---|---|---|
| `frontend-design` | `anthropics/skills` (`.agents/skills`) | Menghasilkan struktur antarmuka yang memiliki identitas kuat dan fungsional. | **TERPASANG (Proyek)** |
| `web-design-guidelines` | `vercel-labs/agent-skills` (`.agents/skills`) | Memeriksa kepatuhan teknis DOM, standar CSS modern, dan performa peramban. | **TERPASANG (Proyek)** |
| `accessibility-engineering` | `addyosmani/agent-skills` (`.agents/skills`) | Mengaudit pemenuhan standar aksesibilitas WCAG 2.2 AA. | **TERPASANG (Proyek)** |
| `impeccable` | `pbakaus/impeccable` (`~/.gemini/config/skills`) | Mengaudit ketepatan copywriting mikro, ritme hierarki visual, dan polesan akhir UX. | **TERPASANG (Global)** |
| `antislop` (Suite) | `~/.gemini/config/skills/antislop*` | Filter komprehensif pencegah generic AI-slop (UI, copywriting, layout mobile, human). | **TERPASANG (Global)** |

### 14.3 Daftar periksa Anti-Slop Design Review
Sebelum suatu halaman antarmuka dinyatakan selesai dikerjakan, jalankan pemeriksaan 7 dimensi berikut:

1. **Visual Identity**: Apakah tampilan terasa seperti instrumen kemanusiaan yang berwibawa, ataukah tampak seperti dashboard SaaS komersial generik?
2. **Layout**: Apakah seluruh informasi dibungkus secara seragam ke dalam kotak-kotak kartu identik? (Gunakan variasi tabel data, lembar panel, dan daftar pembatas garis bersih).
3. **Typography**: Apakah perbedaan hierarki judul, isi, dan angka data terlihat kontras secara proporsional tanpa menggunakan trik warna-warni yang ramai?
4. **Color**: Apakah setiap warna memiliki makna operasional fungsional yang jelas? Apakah rasio kontras telah memenuhi syarat?
5. **Components**: Apakah tombol memiliki tujuan tindakan yang gamblang? Apakah komponen memiliki state interaktif yang lengkap?
6. **Motion**: Apakah animasi hanya hadir untuk memperjelas konteks perubahan data tanpa memperlambat interaksi relawan?
7. **Content Quality & Copywriting**: Apakah istilah bahasa Indonesia yang digunakan mudah dipahami warga dan relawan tanpa jargon teknis yang kaku?

### 14.4 Karakter visual khusus per halaman
Setiap modul halaman memiliki spesialisasi peruntukan:
- **Peta Interaktif + Pengantar**: Visual geospasial yang dingin, fokus pada penandaan titik kebutuhan dan kemudahan filtrasi cepat, didukung lapisan pengantar yang bersahabat namun tidak menghalangi.
- **Detail Laporan**: Gaya editorial operasional yang menonjolkan data selisih logistik dan transparansi verifikasi.
- **Dashboard Relawan**: Padat informasi, menyajikan tabel perbandingan daerah prioritas tanpa grafik hiasan yang tak bermakna.
- **Dashboard Verifikator**: Tata letak dua panel (*split-view*) yang mengutamakan kecepatan evaluasi bukti foto dan kemudahan pengetikan alasan catatan.
- **Panel Admin**: Tata letak tabel terstruktur untuk efisiensi audit data dalam jumlah besar.
- **Formulir Lapor**: Langkah pengisian bertahap yang tenang, fokus, dan bebas dari distraksi elemen lain.

### 14.5 Daftar larangan keras Anti-Slop
Dilarang menyematkan pola-pola generik AI berikut:
- ❌ **Dilarang menggunakan latar belakang gradasi dekoratif** ungu/biru neon (*SaaS glow gradients*).
- ❌ **Dilarang menggunakan efek kaca berlebih (*glassmorphism*)** yang mengaburkan teks di bawahnya.
- ❌ **Dilarang memaksakan tata letak Bento Grid** pada data yang lebih cocok disajikan dalam bentuk tabel perbandingan.
- ❌ **Dilarang menampilkan angka statistik raksasa tanpa label konteks**, sumber tanggal, dan satuan yang jelas.
- ❌ **Dilarang menggunakan karakter emoji sebagai ikon antarmuka**. Gunakan ikon resmi Lucide secara konsisten.
- ❌ **Dilarang membuat seluruh lencana status berbentuk kapsul (*pill shape*)**. Gunakan radius terkalibrasi 4 px.
- ❌ **Dilarang menyematkan animasi scroll berlebihan** yang memicu *jank* pada ponsel kelas menengah ke bawah.
- ❌ **Dilarang membungkus seluruh konten ke dalam kartu (*card soup*)**. Padukan tabel semantik, panel pemisah, dan ruang kosong terukur.
- ❌ **Dilarang menggunakan ilustrasi kartun generik AI** tanpa lisensi dan persetujuan tim manusia.

### 14.6 Gerbang Kualitas Anti-Slop (*Anti-Slop Quality Gate*)
Sebelum halaman UI dinyatakan selesai, wajib menjawab **YA** pada seluruh pertanyaan berikut:
- [ ] Apakah antarmuka memiliki karakter khas instrumen kemanusiaan yang tenang dan fungsional?
- [ ] Apakah tata letak terbebas dari jebakan *card soup* dan bento-grid artifisial?
- [ ] Apakah seluruh elemen visual memiliki fungsi nyata bagi relawan atau publik?
- [ ] Apakah seluruh rasio kontras teks dan kontrol memenuhi standar WCAG 2.2 AA?
- [ ] Apakah antarmuka terbukti nyaman dibaca dan dioperasikan pada layar ponsel 360 px?

---

## 15. Manajemen aset visual

Seluruh aset grafis (foto bukti lapangan, logo aplikasi, favicon, gambar pratinjau media sosial / Open Graph, GeoJSON batas wilayah) **disediakan secara eksklusif oleh tim manusia** (`AGENTS.md` bagian 16).
- Agen AI dilarang menghasilkan gambar ilustrasi mandiri.
- Selama aset resmi belum diserahkan, gunakan elemen placeholder berlabel ukuran geometris netral.
- Pustaka ikon antarmuka dikunci tunggal menggunakan **Lucide Icons** dengan ketebalan garis konsisten (1,75 px – 2 px).

---

## 16. Tata kelola saran skill desain

- `DESIGN.md` adalah sumber kebenaran tertinggi untuk segala keputusan visual dan interaksi.
- Skill agen AI tidak memiliki wewenang untuk menimpa palet warna dasar, tumpukan font sistem, skala spasi, atau token yang telah ditetapkan.
- Jika rekomendasi suatu skill berpotensi meningkatkan kualitas desain namun memerlukan perubahan token pokok, usulan tersebut wajib dicatat sebagai butir `[NEEDS DECISION]` baru kepada tim.

---

## 17. Standar evaluasi penyelesaian antarmuka

Sebelum suatu pekerjaan antarmuka diserahkan:
1. **Inspeksi Hierarki**: Apakah elemen terpenting pada halaman tersebut menjadi hal pertama yang tertangkap oleh mata pengguna?
2. **Kepatuhan Token**: Memastikan tidak ada kode CSS atau kelas styling yang menggunakan nilai warna heksadesimal atau ukuran piksel di luar token resmi.
3. **Uji Responsif**: Memeriksa tampilan antarmuka secara teliti pada lebar 360px, 768px, dan 1280px.
4. **Uji Fungsional Lengkap**: Memastikan semua tombol memicu aksi riil, formulir memiliki validasi pesan galat, dan state pemuatan/kosong telah terdesain rapi.
5. **Kepatuhan Anti-Slop**: Lolos 100% pemeriksaan *Anti-Slop Quality Gate* (bagian 14.6).

---

## 18. Daftar keputusan terbuka desain antarmuka (`[NEEDS DECISION]`)

> [!NOTE]
> **Catatan Keputusan Final:** Keputusan Rute Root `/` telah ditetapkan secara **FINAL** pada 19 November 2026 sebagai **Opsi C — Peta Operasional + Bottom Sheet Pengantar** (lihat Bagian 8.1).  
> Tersisa **10 butir keputusan terbuka visual** di bawah ini yang memerlukan konfirmasi tertulis dari tim (tersinkronisasi penuh dengan `AGENTS.md` Bagian 19):

| # | Butir Keputusan Desain | Alternatif Pilihan | Rekomendasi Desain |
|---|---|---|---|
| 1 | Persetujuan token warna status tambahan | Menyetujui nilai heksa `--color-surface-hover`, `--color-warning-text`, dll. pada bagian 4.2. | **Setujui** (Telah terbukti lolos uji kontras WCAG 2.2 AA). |
| 2 | Pilihan tumpukan font antarmuka | Tumpukan font sistem (gratis, instan, ringan) vs Font web Google Fonts (Inter / Plus Jakarta Sans). | **Font Sistem** (Performa terbaik pada jaringan 3G darurat). |
| 3 | Penyedia ubin peta (Tile Provider) & atribusi | CartoDB Positron vs OpenStreetMap Standard vs Mapbox. | **OpenStreetMap Standard** (100% Terbuka, Tanpa Watermark, Bebas API Key). |
| 4 | Ambang persentase tingkat kekurangan penanda | Merah (>50% selisih), Kuning (10%-50%), Hijau (<10% selisih). | **Setujui** formula batas persentase selisih tersebut. |
| 5 | Penandaan visual data basi (*stale data*) | Ambang waktu pembaruan: 3 hari, 5 hari, atau 7 hari. | **7 hari** (Laporan umum) / **48 jam** (Bencana darurat). |
| 6 | Geometri penanda peta tipe `PEMANTAUAN` | Bentuk belah ketupat tanpa latar penuh vs bentuk heksagon. | **Belah ketupat kontur Navy** (Pembeda bentuk tegas tanpa warna). |
| 7 | Evaluasi referensi desain oleh tim | Tim membuka dan memvalidasi langsung 6 situs referensi bagian 3. | Tunggu masukan tim mengenai pola spesifik yang disukai. |
| 8 | Pendekatan pustaka styling kode | Tailwind CSS dengan CSS variables vs CSS Modules murni. | **Tailwind CSS** (Kecepatan penataan dan konsistensi token). |
| 9 | Identitas visual logo dan favicon resmi | Menunggu kiriman berkas SVG/PNG resmi dari tim. | Gunakan tipografi teks minimalis sementara waktu. |
| 10 | Penerapan mode gelap (*Dark Mode*) | Dikerjakan pada versi lomba vs Ditunda ke Tingkat 2/3. | **Ditunda ke Tingkat 2/3** (Fokus pada kontras tajam mode terang). |
