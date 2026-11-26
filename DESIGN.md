# DESIGN.md — TILARA

> Panduan desain untuk seluruh antarmuka TILARA. Berlaku bersama `AGENTS.md` (aturan data & produk menang jika ada konflik).

## 1. Arah Visual

TILARA = **dokumentasi jurnalistik + pemetaan geospasial + transparansi kemanusiaan**.

| Pilar | Wujud |
|---|---|
| Editorial documentary | Homepage bercerita lewat kondisi nyata, tipografi editorial, ruang napas lega |
| Geospatial intelligence | Peta sebagai alat memahami wilayah, bukan hiasan |
| Data storytelling | Kebutuhan, bantuan, dan kekurangan jelas dalam sekali lihat |
| Field documentation | Informasi lapangan transparan, bersumber, dan dapat ditelusuri |

**Dua mode tampilan:**
- **Publik** (`/`, `/laporan`, `/tentang`, `/darurat`): editorial, lapang, bercerita.
- **Operasional** (`/dashboard`, `/verifikasi`, `/distribusi`, dll.): padat, fungsional, cepat dipindai.

Nada: tenang, serius, empatik, faktual. Bukan dramatis berlebihan, bukan eksploitasi penderitaan.

## 2. Brand & Warna

### 2.1 Logo TILARA
- **Nama:** TILARA — **Tagline:** *Visibility for the Unreached* (padanan Indonesia: *Terlihat. Terlacak. Terjangkau.*)
- **Simbol:** garis kontur topografi konsentris (wilayah) dengan satu titik solid di tengah (titik lokasi / visibilitas) dan satu garis kecil yang membuka kontur ke luar (hubungan dengan bantuan).
- **Wordmark:** huruf kapital sans geometris, jarak huruf lebar, huruf A tanpa palang. Gunakan **aset SVG resmi**, jangan mengetik ulang wordmark dengan font.
- **Varian wajib:** lengkap (horizontal), ikon saja, monokrom hitam, monokrom putih, favicon/app icon (ikon di atas kotak hijau).
- **Ukuran minimum:** ikon 16px (versi sederhana: 2 kontur + titik, tanpa garis < 2px); logo lengkap 96px lebar.
- **Area aman:** setinggi titik tengah simbol di semua sisi. Jangan meregangkan, memutar, memberi bayangan, atau mengganti warna di luar palet.
- Harus tetap terbaca di hitam-putih, sablon seragam relawan, dan papan kegiatan lapangan.

### 2.2 Palet (diambil dari papan logo)

| Token | Hex | Pakai untuk |
|---|---|---|
| `--tilara-paper` | `#F5F6F3` | Latar halaman |
| `--tilara-white` | `#FFFFFF` | Permukaan kartu |
| `--tilara-navy` | `#172B3A` | Teks utama, wordmark, panel gelap, gate intro |
| `--tilara-green` | `#246B50` | Warna merek, tombol utama, status terverifikasi |
| `--tilara-amber` | `#E5A13A` | Menunggu / perhatian ringan, aksen garis |
| `--tilara-red` | `#D85B52` | Membutuhkan perhatian / kekurangan |
| `--tilara-red-deep` | `#B83E37` | Kekurangan kritis, teks error (kontras lebih tinggi) |
| `--tilara-stone` | `#8A8D86` | Teks sekunder, garis, status netral |

```css
:root {
  --bg: var(--tilara-paper);
  --surface: var(--tilara-white);
  --surface-muted: #ECEEE9;
  --border: #D9DCD5;
  --text: var(--tilara-navy);
  --text-muted: #55606A;

  --tilara-paper: #F5F6F3;  --tilara-white: #FFFFFF;
  --tilara-navy:  #172B3A;  --tilara-green: #246B50;
  --tilara-amber: #E5A13A;  --tilara-red:   #D85B52;
  --tilara-red-deep: #B83E37; --tilara-stone: #8A8D86;

  /* Status: selalu ikon + teks + warna */
  --status-verified:  var(--tilara-green);
  --status-pending:   var(--tilara-amber);
  --status-attention: var(--tilara-red-deep);
  --status-info:      #2B6CB0;
  --status-demo:      #6B46C1;   /* label DEMO, harus mencolok */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0F1D28; --surface: #172B3A; --surface-muted: #1E3547;
    --border: #2B4457; --text: #F5F6F3; --text-muted: #A9B4BC;
  }
}
```

Aturan: kontras teks minimal **WCAG AA (4.5:1)**. Amber `#E5A13A` **tidak boleh** dipakai sebagai warna teks di atas latar terang (kontras kurang); pakai sebagai latar badge dengan teks navy. Hindari hitam/putih murni untuk latar besar.

## 3. Tipografi

| Peran | Saran | Fallback |
|---|---|---|
| Judul editorial (publik) | Serif ekspresif, mis. *Fraunces* / *Source Serif 4* | Georgia, serif |
| UI & isi | Sans humanis, mis. *Inter* / *Source Sans 3* | system-ui, sans-serif |
| Angka & data | Sans dengan angka tabular (`font-variant-numeric: tabular-nums`) | monospace |

Skala (rem): 0.75 · 0.875 · 1 · 1.125 · 1.25 · 1.5 · 2 · 3 · 4.
Isi minimal 16px di mobile. Panjang baris teks 60–75 karakter.

## 4. Layout & Spasi

- Grid 4/8px; kontainer publik max ±1200px, operasional boleh lebih lebar.
- Radius: 8px (kartu/input), 999px (badge/pill).
- Bayangan halus; utamakan garis tipis `--border` untuk tampilan operasional.
- Mobile-first: relawan memakai ponsel di lapangan. Target sentuh ≥ 44×44px.

## 5. Komponen Kunci

### 5.1 Kartu Kesenjangan Bantuan (komponen inti)
Menampilkan per wilayah & kategori:
- Kebutuhan total · Bantuan terkonfirmasi · **Kekurangan**
- Progress bar (terkonfirmasi vs kebutuhan) dengan label angka + satuan
- Badge status laporan, sumber, tanggal pembaruan terakhir
- Bantuan **PENDING** boleh ditampilkan hanya di area operasional, ditandai jelas "belum dikonfirmasi", dan **tidak** dihitung ke bar utama

Contoh (WAJIB berlabel DEMO bila dipakai sebagai ilustrasi):
`Desa A — Beras: 500 kg dibutuhkan · 150 kg diterima · 350 kg belum terpenuhi`

### 5.2 Badge Status
Terverifikasi (hijau) · Menunggu (kuning) · Membutuhkan perhatian (merah) · Ditolak (abu) · **DEMO** (ungu, selalu mencolok).
Selalu: ikon + teks + warna.

### 5.3 Trust Score
Tampilkan ringkas (angka/tingkat) dengan penjelasan "apa artinya" melalui tooltip/halaman metodologi. Jangan memberi kesan kepastian absolut.

### 5.4 Linimasa Riwayat
Daftar kronologis perubahan status & distribusi: waktu, aktor (peran), perubahan, alasan. Versi publik hanya memuat entri publik.

### 5.5 Formulir Lapor
- Satu kolom, langkah pendek, label di atas input (bukan placeholder-as-label)
- Simpan draf otomatis; indikator **offline / antre / terkirim** yang jelas
- Ambil lokasi dengan fallback pin manual; jelaskan privasi lokasi

### 5.6 Tabel Operasional
Kolom dapat diurutkan, filter status/wilayah/kategori, baris padat, aksi massal hanya untuk role berhak. Di mobile berubah menjadi kartu.

## 6. Peta Operasional (Leaflet + OpenStreetMap)

- Penanda berbeda per status verifikasi dan tingkat kekurangan (bentuk + warna, bukan warna saja)
- Klaster saat zoom jauh; panel samping/bottom-sheet berisi ringkasan wilayah
- Filter: jenis bencana, status, kategori kebutuhan, rentang waktu
- **Posisi sudah di-mask dari server** — UI tidak boleh meminta/menyimpan koordinat presisi untuk publik
- Atribusi OpenStreetMap wajib tampil
- Wilayah pelosok harus tetap terlihat (jangan sembunyikan titik jarang di balik klaster tanpa indikasi)
- Fallback bila tile gagal dimuat atau offline: tampilkan daftar wilayah

## 7. Homepage Story-First

Urutan:
1. **Hero**: pernyataan prinsip + satu kondisi nyata terverifikasi (bila ada), atau ilustrasi berlabel DEMO
2. **Kondisi terkini**: cerita wilayah terdampak (data VERIFIED saja)
3. **Kesenjangan**: ringkasan kebutuhan vs bantuan terkonfirmasi
4. **Peta singkat** → CTA ke `/peta`
5. **Cara kerja & verifikasi** (6 langkah alur transparansi)
6. **Terlibat**: lapor sebagai relawan / masuk sebagai petugas
7. **Footer**: metodologi, darurat, privasi

Larangan: tidak ada tombol "Donasi". Tidak ada angka/foto rekaan sebagai fakta.

### 7.1 Beranda vs Tentang (keputusan: tetap dua halaman)

| | Beranda `/` | Tentang `/tentang` |
|---|---|---|
| Tujuan | Memperlihatkan kondisi wilayah dan mengajak bertindak (lihat peta, lapor) | Membangun kepercayaan: apa TILARA, bagaimana bekerja, siapa yang bertanggung jawab |
| Pembaca | Pengunjung pertama, masyarakat, relawan | Lembaga, jurnalis, mitra, peneliti, orang yang meragukan data |
| Isi | Cerita kondisi, angka kesenjangan, peta singkat, teaser 3–6 langkah, CTA | Misi dan ruang lingkup (bukan donasi), metodologi verifikasi, arti Trust Score, definisi status, privasi lokasi, sumber data, audit, kontak, FAQ |
| Panjang | Pendek (≤ 7 seksi), cepat dimuat | Boleh panjang, punya anchor (`#metodologi`, `#trust-score`, `#privasi`) |
| Perubahan | Sering (mengikuti data) | Jarang |

Alasan tidak digabung: platform transparansi butuh halaman metodologi yang **stabil, dapat ditautkan, dan dapat dikutip** (media, lembaga, mesin pencari). Menumpuk metodologi di beranda membuat beranda panjang dan lambat, dan memecah fokus dari cerita dan aksi.

Aturan:
- Beranda hanya memuat **teaser** "Cara kerja dan verifikasi" dengan tautan ke `/tentang#metodologi`.
- `/tentang` tidak boleh mengulang cerita atau data beranda.
- Jika isi `/tentang` belum mencapai satu layar, boleh sementara dibuat sebagai seksi di beranda dengan anchor, tetapi route `/tentang` tetap ada (redirect ke anchor tersebut).
- `/statistik` dipertahankan hanya bila isinya berbeda dari `/laporan` dan `/peta` (agregat per provinsi/jenis/kategori, hanya data VERIFIED). Jika hanya ringkasan angka, jadikan tab di `/laporan`.

### 7.2 Hero beranda
- Hero **gelap** (navy `#172B3A` + garis kontur SVG statis < 6 KB; atau foto lapangan bersumber jelas dengan overlay navy ≥ 60%) agar header transparan dan teks putih terbaca AA.
- Eyebrow hero memakai positioning resmi ("Transparansi Bantuan Fisik" / "Disaster & Humanitarian Aid Transparency Platform"), bukan frasa lain.
- Sisi kanan hero tidak dibiarkan kosong: tampilkan kartu kesenjangan teratas (data nyata, atau berlabel DEMO) atau pratinjau peta.
- Tombol "Jelajahi Laporan (n)" hanya menampilkan jumlah nyata dari data VERIFIED.

## 8. Motion Kit TILARA

Terinspirasi pola gerak situs properti premium (gate intro, reveal saat scroll, parallax gambar, rel horizontal, penanda peta berdenyut, header yang menyembunyikan diri), tetapi **diimplementasikan ulang dari nol dan ringan**. Kode acuan: **Lampiran B**.

### 8.1 Pemetaan gerak ke halaman TILARA

| Pola gerak | Dipakai di TILARA | Teknik (ringan) |
|---|---|---|
| Gate intro dua panel | Beranda, sekali per sesi (Bagian 12) | CSS keyframes |
| Hero masuk bertahap | Judul, subjudul, CTA beranda | CSS keyframes + `--i` stagger |
| Reveal saat scroll | Semua seksi publik | CSS transition + 1 IntersectionObserver |
| Parallax gambar | Banner "wilayah belum terjangkau", CTA lapor | CSS `animation-timeline: view()` (progressive) |
| Zoom hero saat scroll | Hero beranda | CSS `animation-timeline: scroll()` (progressive) |
| Rel horizontal kartu | Laporan unggulan, ringkasan wilayah | CSS `scroll-snap`, tanpa library |
| Kartu terangkat saat hover | Kartu laporan & wilayah | CSS, hanya `(hover: hover)` |
| Penanda peta berdenyut | Hanya wilayah "membutuhkan perhatian" | CSS pseudo-element, maks. ±20 penanda |
| Bar kesenjangan terisi | Kartu kebutuhan vs bantuan | `scaleX` saat terlihat |
| Count-up angka | Angka kekurangan (nilai nyata dari data) | ±0,5 KB JS, rAF |
| Header transparan → solid saat scroll | Header publik (Bagian 13) | IntersectionObserver pada sentinel, tanpa listener scroll |
| Menu mobile geser | Navigasi mobile | `transform` + `visibility` |
| Sheet/dialog | Form cepat, filter peta | `<dialog>` + CSS |
| Transisi antar halaman | Halaman publik saja | View Transitions API (progressive) |
| Bab cerita saat scroll (story-first) | Beranda dan halaman cerita wilayah | **GSAP + ScrollTrigger** (lazy, Lampiran C) |
| Transisi peta ↔ detail wilayah | `/peta` → `/laporan/[id]` (publik) | GSAP timeline pendek, hanya bila perlu |
| Parallax/zoom untuk browser tanpa `animation-timeline` | Fallback Safari/Firefox lama | GSAP ScrollTrigger, hanya bila `CSS.supports` gagal |

### 8.2 Aturan performa (wajib)
- Hanya animasikan `transform` dan `opacity` (skeleton shimmer pengecualian kecil).
- **Motion Kit (Lampiran B): total JS ≤ 3 KB gzip**, tanpa dependensi.
- **GSAP (core + ScrollTrigger, via `@gsap/react`)** hanya untuk gerak naratif yang tidak cukup dengan CSS. Wajib dimuat **lazy** (dynamic import di client component) **hanya di rute publik yang memakainya**. Anggaran ±40 KB gzip untuk GSAP + ScrollTrigger, diukur nyata dan dilaporkan. **Dilarang** di area operasional dan jalur pelaporan, serta tidak boleh masuk bundel utama.
- Satu `IntersectionObserver` untuk semua reveal; elemen di-`unobserve` setelah tampil.
- Tidak ada listener `scroll` sama sekali; gunakan IntersectionObserver (termasuk untuk header, lihat Lampiran D).
- Fitur modern (`animation-timeline`, `@view-transition`) dibungkus `@supports`/progressive: bila tidak didukung, halaman tetap benar tanpa efek.
- `content-visibility: auto` untuk seksi jauh di bawah lipatan (dengan `contain-intrinsic-size`).
- Gambar: AVIF/WebP, `loading="lazy"` di bawah lipatan, hero di-preload, dimensi eksplisit (tanpa CLS).
- **Area operasional** (`/dashboard`, `/verifikasi`, `/distribusi`, `/lapor`, dll.): tanpa reveal, parallax, atau transisi halaman. Hanya transisi UI kecil (hover, dialog).

### 8.3 Aksesibilitas gerak
- `prefers-reduced-motion: reduce`: matikan reveal, parallax, zoom, denyut, count-up (tampilkan nilai akhir), dan transisi geser.
- Konten harus terbaca penuh tanpa JavaScript: angka asli ada di HTML, JS hanya menganimasikannya.
- Jangan menahan informasi penting di balik animasi. Jangan ada gerak berkedip > 3 kali per detik.
- Count-up dan bar kesenjangan **hanya** menganimasikan data nyata; animasi tidak boleh mengubah atau menyiratkan angka yang berbeda.

### 8.4 Peran GSAP dan skill `gsap-skills`

Proyek ini sudah memasang skill resmi GreenSock (`npx skills add https://github.com/greensock/gsap-skills`). **Sebelum menulis atau mengubah kode GSAP apa pun, agen wajib membaca skill tersebut dan mengikuti panduannya**; bila skill bertentangan dengan Bagian 8.2 atau 8.3, aturan TILARA yang menang.

Pembagian tugas:
| Pakai CSS (Motion Kit) | Pakai GSAP |
|---|---|
| Gate intro, hero masuk, reveal sederhana | Bab cerita berurutan dengan scrub/pin (desktop) |
| Hover, dialog, menu, rel horizontal | Timeline koreografi beberapa elemen |
| Parallax via `animation-timeline` | Fallback parallax bila CSS tidak didukung |
| Denyut penanda, bar kesenjangan | Transisi peta ↔ detail yang melibatkan banyak elemen |

Aturan penggunaan GSAP:
- React: gunakan `useGSAP` (`@gsap/react`) dengan `scope` agar animasi otomatis dibersihkan saat komponen dilepas.
- Reduced motion dan breakpoint lewat `gsap.matchMedia()`: tanpa gerak bila `prefers-reduced-motion: reduce`; `pin`/`scrub` hanya di layar ≥ 900px.
- Animasikan hanya `transform` dan `opacity` (`x`, `y`, `scale`, `autoAlpha`); jangan `top/left/width/height`.
- Untuk ScrollTrigger: seksi di bawah lipatan saja, `once: true` bila tidak perlu bolak-balik, panggil `ScrollTrigger.refresh()` setelah gambar besar selesai dimuat, dan jangan menumpuk `pin` di mobile.
- Konten harus tetap lengkap tanpa JavaScript; GSAP hanya menambah gerak, tidak menyembunyikan informasi di HTML awal.
- Tidak boleh memakai GSAP untuk gerak yang bisa dibuat CSS dengan hasil setara.
- Jangan menambah plugin GSAP lain tanpa persetujuan; laporkan efek ukuran bundel.

## 9. Aksesibilitas (WCAG 2.2 AA)

- Fokus keyboard terlihat; urutan tab logis; skip-link
- Semua gambar bermakna punya alt; peta punya alternatif daftar/tabel
- Status tidak hanya warna; form punya error teks yang spesifik
- Dukungan layar kecil & teks diperbesar hingga 200%
- Bahasa utama Indonesia (`lang="id"`)

## 10. Konten & Suara

- Bahasa Indonesia yang jelas dan hormat; hindari istilah teknis tanpa penjelasan
- Gunakan kata kerja spesifik pada tombol: "Kirim laporan", "Setujui laporan", "Konfirmasi penerimaan" (hindari "Submit", "OK")
- Empty state menjelaskan apa yang bisa dilakukan berikutnya
- Pesan error: apa yang salah + cara memperbaikinya
- Foto: hanya yang bersumber jelas, cantumkan kredit; hindari gambar korban yang mengeksploitasi; hormati martabat dan privasi
- Semua konten simulasi: label **DEMO**

## 11. Checklist Desain per Halaman

- [ ] Mengikuti token warna/tipografi di atas
- [ ] Mobile 360px aman, tanpa scroll horizontal
- [ ] Status memakai ikon + teks + warna
- [ ] Tidak ada data PENDING pada tampilan publik
- [ ] Kondisi loading / kosong / error / offline ditangani
- [ ] Motion menghormati reduced-motion
- [ ] Label DEMO terpasang pada data simulasi
- [ ] Gate intro (bila ada di halaman) memenuhi anggaran performa Bagian 12
- [ ] Header publik mengikuti Bagian 13 (overlay → solid, mobile dialog, Darurat satu ketukan)

## 12. Gate Intro (animasi pembuka "gerbang")

Terinspirasi pola pembuka dua panel yang membelah ke kiri dan kanan lalu memperlihatkan situs (seperti situs properti internestrealty.com). Untuk TILARA, maknanya: **gerbang yang membuka wilayah yang tadinya tak terlihat**, sejalan dengan tagline *Visibility for the Unreached*.

### Urutan (total ≈ 2,2 detik)
| Waktu | Kejadian |
|---|---|
| 0,15 s | Simbol kontur muncul (garis tergambar + fade) tepat di tengah, melintasi belahan kedua panel |
| 0,5 s | Garis tipis amber tumbuh vertikal di celah tengah |
| 1,25 s | Dua panel navy bergeser keluar (kiri ke -100%, kanan ke +100%) selama ±0,95 s, simbol ikut terbelah |
| 1,25 s | Hero di bawahnya turun dari skala 1,06 ke 1 (efek "mendekat") |
| 2,2 s | Overlay disembunyikan (`visibility: hidden`, tidak menghalangi klik) |

### Anggaran performa (wajib)
- **Nol JavaScript animasi.** Murni CSS `transform` dan `opacity` (dipercepat GPU). Tidak memakai GSAP/Motion/video untuk intro ini.
- Simbol berupa **SVG inline < 4 KB**; tanpa gambar, font tambahan, atau video.
- `will-change` hanya pada dua panel dan hanya selama animasi.
- Tidak ada layout shift (overlay `position: fixed`). Konten halaman tetap ada di HTML (SEO dan pembaca layar tidak terpengaruh); overlay `aria-hidden`.
- Hero image tetap di-*preload*; intro tidak boleh menunda render konten di bawahnya.

### Aturan penggunaan
- Hanya di **beranda publik (`/`)**, **sekali per sesi** (`sessionStorage`). Tidak pernah di area operasional, `/lapor`, atau `/darurat` (relawan di lapangan dan pengguna darurat tidak boleh menunggu animasi).
- Dilewati otomatis bila `prefers-reduced-motion: reduce`.
- Dilewati bila kunjungan ulang dalam sesi yang sama.
- Pada koneksi lambat (`navigator.connection.saveData`) boleh dilewati (opsional).
- Implementasi acuan: lihat **Lampiran A** di bawah (`GateIntro.tsx` + `gate-intro.css`). Ganti SVG sementara dengan aset logo resmi.

## 13. Navbar (Site Header)

Referensi perilaku: header yang **transparan di atas hero**, lalu saat scroll sedikit menjadi **solid dan ringkas**, dengan utility bar yang menghilang. Diimplementasikan ulang untuk TILARA. Kode acuan: **Lampiran D**.

### 13.1 Anatomi (desktop ≥ 1024px)

| Bagian | Isi |
|---|---|
| Utility bar (40px, hanya varian overlay) | Kiri: "Data terverifikasi diperbarui {waktu}" (waktu nyata dari server). Kanan: "Metodologi verifikasi" (`/tentang#metodologi`) dan email kontak (dari konfigurasi). **Dilarang mengarang** nomor atau email. |
| Bar utama (72px) | Kiri: logo. Tengah: **Peta · Laporan · Statistik · Tentang** (tautan teks, huruf kapital, jarak huruf lebar, garis bawah untuk aktif). Kanan: tombol **Darurat**, tombol **Lapor**, ikon **Masuk / Dashboard**. |

### 13.2 Dua keadaan

| | Di puncak halaman (overlay) | Setelah scroll > ±32px |
|---|---|---|
| Latar | Transparan + scrim gradien navy di atas hero | Putih solid (`rgb(255 255 255 / .97)`) + garis dan bayangan halus |
| Teks & logo | Putih; titik logo putih | Navy; titik logo hijau; simbol mengecil ke 90% |
| Utility bar | Tampil | Hilang (header bergeser `-40px`, tanpa mengubah layout) |
| Transisi | — | ±0,3–0,45 s, hanya `transform` dan `opacity` |

Varian `solid` (semua halaman selain beranda): langsung keadaan kedua, tanpa utility bar; konten diberi `padding-top: var(--main-h)`.

### 13.3 Aturan visual
- Header **fixed**, tidak pernah disembunyikan saat scroll. Tidak memakai `backdrop-filter` (mahal di perangkat menengah).
- Logo **tanpa kotak bergaris**; satu SVG `currentColor` untuk kedua keadaan (tanpa dua file logo).
- Tautan navigasi berupa **teks**, bukan tombol bergaris. Hanya **Darurat** (merah dalam `#B83E37`, teks putih, kontras ≥ 5:1) dan **Lapor** (hijau `#246B50`) yang berbentuk tombol: tinggi 40px (44px di mobile), radius 8px.
- Pill "Transparansi Bantuan Fisik" **dihapus dari header**; dipindah ke eyebrow hero.
- Maksimal 4 tautan utama; tanpa dropdown.
- Status aktif: garis bawah 2px + `aria-current="page"`.

### 13.4 Mobile (< 1024px)
- Utility bar disembunyikan. Bar: logo kiri; kanan: tombol **Darurat** (ikon telepon + teks) dan **Lapor** ringkas, lalu hamburger.
- Menu: **`<dialog>` native** yang membuka dari kanan (fokus terkunci, Esc menutup, klik backdrop menutup, scroll halaman dikunci). Isi: tautan besar, Darurat dan Lapor sebagai tombol penuh di bawah, lalu Masuk/Dashboard.
- **Darurat harus selalu dapat dicapai dengan satu ketukan.**

### 13.5 Aksesibilitas dan performa
- `<header>`, `<nav aria-label="Utama">`, skip-link "Lewati ke konten", tombol menu dengan `aria-expanded` dan `aria-controls`, area sentuh ≥ 44px, fokus terlihat.
- Tanpa JavaScript: header tampil solid (fallback `<noscript>`), semua tautan tetap berfungsi.
- Perubahan keadaan lewat **IntersectionObserver pada elemen sentinel**, bukan listener scroll; atribut `data-scrolled` diubah langsung di DOM (tanpa re-render React).
- `prefers-reduced-motion`: tanpa transisi, perubahan keadaan tetap terjadi.

### 13.6 Area operasional
Memakai **header aplikasi terpisah** yang ringkas (logo, menu per role, notifikasi, akun): tanpa utility bar, tanpa transparansi, tanpa animasi. Jangan memakai `SiteHeader` di sana.

### 13.7 Evaluasi navbar saat ini dan perbaikannya

| Temuan | Perbaikan |
|---|---|
| Logo di dalam kotak bergaris dan terlihat sempit | Hapus kotak; simbol + wordmark lepas dengan jarak yang lega |
| Pill "Transparansi Bantuan Fisik" berdampingan dengan logo | Pindah ke eyebrow hero |
| Semua tautan berbentuk tombol bergaris, hierarkinya datar | Tautan teks; hanya Darurat dan Lapor yang berbentuk tombol |
| Tidak ada indikator halaman aktif yang jelas | Garis bawah + `aria-current` |
| Tidak ada perubahan saat scroll, hero terang kosong di kanan | Hero gelap + header transparan → solid (Bagian 7.2 dan 13.2) |
| Badge hero "Environmental & Humanitarian Intelligence" tidak sama dengan positioning | Samakan dengan positioning resmi |

---

## Lampiran A — Kode Acuan Gate Intro

Simpan sebagai `components/GateIntro.tsx` dan `components/gate-intro.css` (sesuaikan path dengan struktur repo).

### GateIntro.tsx
```tsx
import "./gate-intro.css";

/**
 * Gate Intro TILARA — dua panel membuka ke kiri & kanan.
 * - Murni CSS (0 KB JavaScript animasi), hanya transform + opacity.
 * - Tampil sekali per sesi, hanya di tempat komponen ini dipasang (beranda "/").
 * - Konten halaman tetap ada di HTML; overlay aria-hidden.
 *
 * PASANG:
 * 1) Tambahkan suppressHydrationWarning pada <html> di app/layout.tsx
 *    (skrip kecil di bawah menambahkan atribut data-intro ke <html>).
 * 2) Render <GateIntro /> sebagai elemen PERTAMA di <body> halaman beranda.
 * 3) Beri className="gate-reveal" pada pembungkus hero agar ikut "mendekat".
 * 4) GANTI <Mark /> dengan SVG logo resmi TILARA (ini hanya placeholder kontur).
 */

const SKIP_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem("tilara-intro")){d.dataset.intro="seen"}else{sessionStorage.setItem("tilara-intro","1")}}catch(e){}`;

function Mark() {
  return (
    <svg viewBox="0 0 100 100" width="84" height="84" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path pathLength={1} d="M50 6C68 4 90 16 93 38C96 60 84 90 56 94C30 98 8 80 7 54C6 28 28 8 50 6Z" />
        <path pathLength={1} d="M50 15C65 14 83 24 85 41C87 59 76 83 54 86C34 89 16 74 16 54C15 34 33 16 50 15Z" />
        <path pathLength={1} d="M50 25C62 24 75 32 76 45C77 58 68 75 52 77C38 79 25 67 25 53C25 38 38 26 50 25Z" />
        <path pathLength={1} d="M50 35C58 34 66 40 66 48C66 57 60 66 51 67C42 68 35 60 35 52C35 43 41 35 50 35Z" />
      </g>
      <circle cx="50" cy="50" r="6.5" fill="#246B50" />
    </svg>
  );
}

function LogoBlock() {
  return (
    <div className="gate-logo">
      <Mark />
      <span className="gate-word">TILARA</span>
      <span className="gate-tag">Visibility for the Unreached</span>
    </div>
  );
}

export default function GateIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SCRIPT }} />
      <div className="gate-intro" aria-hidden="true">
        <div className="gate-panel gate-panel--l">
          <LogoBlock />
        </div>
        <div className="gate-panel gate-panel--r">
          <LogoBlock />
        </div>
        <div className="gate-seam" />
      </div>
    </>
  );
}
```

### gate-intro.css
```css
/* TILARA Gate Intro — murni CSS, transform + opacity saja. Total ≈ 2,2 s */

.gate-intro {
  position: fixed;
  inset: 0;
  z-index: 9999;
  /* setelah animasi selesai: sembunyikan & jangan blokir klik */
  animation: gate-hide 0s linear 2.2s forwards;
}

.gate-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  overflow: hidden;
  background: var(--tilara-navy, #172b3a);
  will-change: transform;
  animation: 0.95s cubic-bezier(0.77, 0, 0.18, 1) 1.25s forwards;
}
.gate-panel--l { left: 0;  animation-name: gate-left; }
.gate-panel--r { right: 0; animation-name: gate-right; }

/* Logo yang sama di kedua panel, pusatnya tepat di celah tengah */
.gate-logo {
  position: absolute;
  top: 50%;
  width: 240px;
  margin-top: -80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--tilara-paper, #f5f6f3);
  opacity: 0;
  animation: gate-fade 0.7s ease-out 0.15s forwards;
}
.gate-panel--l .gate-logo { right: -120px; }
.gate-panel--r .gate-logo { left: -120px; }

.gate-logo path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: gate-draw 1s ease-out 0.2s forwards;
}
.gate-word {
  font: 600 1.6rem/1 system-ui, sans-serif;
  letter-spacing: 0.42em;
  padding-left: 0.42em; /* kompensasi letter-spacing agar tetap simetris */
}
.gate-tag {
  font: 500 0.62rem/1 system-ui, sans-serif;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--tilara-amber, #e5a13a);
}

/* Garis tipis di celah tengah */
.gate-seam {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--tilara-amber, #e5a13a), transparent);
  transform: translateX(-0.5px) scaleY(0);
  animation:
    gate-seam 0.6s ease-out 0.5s forwards,
    gate-fade-out 0.25s ease-in 1.2s forwards;
}

/* Hero di bawahnya "mendekat" saat gerbang membuka (opsional: class gate-reveal) */
.gate-reveal {
  animation: gate-reveal 1.3s cubic-bezier(0.2, 0.7, 0.2, 1) 1.25s both;
}

@keyframes gate-left   { to { transform: translate3d(-100%, 0, 0); } }
@keyframes gate-right  { to { transform: translate3d(100%, 0, 0); } }
@keyframes gate-fade   { to { opacity: 1; } }
@keyframes gate-fade-out { to { opacity: 0; } }
@keyframes gate-draw   { to { stroke-dashoffset: 0; } }
@keyframes gate-seam   { to { transform: translateX(-0.5px) scaleY(1); } }
@keyframes gate-hide   { to { visibility: hidden; pointer-events: none; } }
@keyframes gate-reveal { from { transform: scale(1.06); } to { transform: scale(1); } }

/* Lewati: kunjungan ulang dalam sesi, atau pengguna meminta gerak dikurangi */
html[data-intro="seen"] .gate-intro { display: none; }
html[data-intro="seen"] .gate-reveal { animation: none; }

@media (prefers-reduced-motion: reduce) {
  .gate-intro { display: none; }
  .gate-reveal { animation: none; }
}

/* Layar sempit: logo sedikit lebih kecil */
@media (max-width: 480px) {
  .gate-logo { width: 200px; }
  .gate-panel--l .gate-logo { right: -100px; }
  .gate-panel--r .gate-logo { left: -100px; }
  .gate-word { font-size: 1.3rem; }
}
```

---

## Lampiran B — Kode Acuan Motion Kit

Simpan sebagai `components/motion/motion.css`, `motion.ts`, dan `MotionInit.tsx`. Impor `motion.css` hanya di layout publik. Nilai pada contoh bertanda DEMO bukan data nyata.

### motion.css
```css
/* motion.css — TILARA Motion Kit (ringan, transform + opacity) */
:root {
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-gate: cubic-bezier(0.77, 0, 0.18, 1);
  --t-fast: 0.18s;
  --t-base: 0.45s;
  --t-slow: 0.8s;
}

/* 1) Hero masuk bertahap (CSS saja, tidak menunggu JS) */
.hero-in > * {
  animation: rise 0.9s var(--ease-out) both;
  animation-delay: calc(var(--i, 0) * 90ms + var(--hero-delay, 0s));
}
/* Beranda dengan gate intro: tunda sampai gerbang membuka */
.hero-in--after-gate { --hero-delay: 1.6s; }
html[data-intro="seen"] .hero-in--after-gate { --hero-delay: 0s; }
@keyframes rise { from { opacity: 0; transform: translate3d(0, 20px, 0); } }

/* 2) Reveal saat scroll (aktif hanya setelah JS siap) */
.motion-ready [data-reveal] {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition: opacity var(--t-slow) var(--ease-out), transform var(--t-slow) var(--ease-out);
  transition-delay: calc(var(--i, 0) * 70ms);
}
.motion-ready [data-reveal="left"]  { transform: translate3d(-24px, 0, 0); }
.motion-ready [data-reveal="right"] { transform: translate3d(24px, 0, 0); }
.motion-ready [data-reveal="fade"]  { transform: none; }
.motion-ready [data-reveal].is-in   { opacity: 1; transform: none; }

/* 3) Parallax gambar & zoom hero (progressive enhancement) */
@supports (animation-timeline: view()) {
  .parallax { overflow: hidden; }
  .parallax > img, .parallax > .parallax__media {
    animation: parallax linear both;
    animation-timeline: view();
    animation-range: cover;
  }
  @keyframes parallax {
    from { transform: translate3d(0, -8%, 0) scale(1.12); }
    to   { transform: translate3d(0, 8%, 0) scale(1.12); }
  }
  .hero-zoom {
    animation: hero-zoom linear both;
    animation-timeline: scroll(root block);
    animation-range: 0 80vh;
  }
  @keyframes hero-zoom { to { transform: scale(1.08); } }
}

/* 4) Kartu terangkat (hanya perangkat dengan hover) */
@media (hover: hover) {
  .card-lift { transition: transform var(--t-base) var(--ease-out), box-shadow var(--t-base) var(--ease-out); }
  .card-lift:hover { transform: translate3d(0, -4px, 0); box-shadow: 0 12px 28px rgb(23 43 58 / 0.12); }
  .card-lift .media img { transition: transform 0.9s var(--ease-out); }
  .card-lift:hover .media img { transform: scale(1.04); }
}

/* 5) Rel horizontal (tanpa library) */
.rail {
  display: flex; gap: 1rem; overflow-x: auto;
  scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
  scrollbar-width: none; -webkit-overflow-scrolling: touch;
}
.rail::-webkit-scrollbar { display: none; }
.rail > * { flex: 0 0 min(82%, 380px); scroll-snap-align: start; }

/* 6) Penanda peta berdenyut: hanya "membutuhkan perhatian" */
.marker { position: relative; }
.marker--attention::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid var(--tilara-red, #d85b52);
  animation: pulse 2.2s ease-out infinite; pointer-events: none;
}
@keyframes pulse { from { transform: scale(1); opacity: 0.7; } to { transform: scale(2.4); opacity: 0; } }

/* 7) Bar kesenjangan: lebar = data nyata (--pct), animasi hanya scaleX */
.gap-bar__fill {
  width: calc(var(--pct, 0) * 1%);
  transform-origin: left center;
}
.motion-ready .gap-bar__fill { transform: scaleX(0); transition: transform 1.1s var(--ease-out) 0.15s; }
.motion-ready .gap-bar.is-in .gap-bar__fill { transform: scaleX(1); }

/* 8) Header: lihat Lampiran D (site-header.css). Header TIDAK disembunyikan saat scroll. */

/* 9) Menu mobile geser */
.menu-panel {
  position: fixed; inset: 0 0 0 auto; width: min(88%, 360px);
  transform: translate3d(100%, 0, 0); visibility: hidden;
  transition: transform 0.45s var(--ease-gate), visibility 0s 0.45s;
}
.menu-panel[data-open="true"] { transform: none; visibility: visible; transition-delay: 0s; }

/* 10) Dialog / bottom sheet */
dialog.sheet { border: 0; padding: 0; border-radius: 16px; max-width: min(92vw, 520px); }
dialog.sheet[open] { animation: sheet-in 0.4s var(--ease-out); }
dialog.sheet::backdrop { background: rgb(23 43 58 / 0.55); animation: fade-in 0.3s ease-out; }
@keyframes sheet-in { from { opacity: 0; transform: translate3d(0, 24px, 0); } }
@keyframes fade-in  { from { opacity: 0; } }
@media (max-width: 640px) {
  dialog.sheet { margin: auto 0 0; width: 100%; max-width: none; border-radius: 16px 16px 0 0; }
}

/* 11) Transisi antar halaman (HALAMAN PUBLIK SAJA; jangan muat di layout operasional) */
@view-transition { navigation: auto; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.28s; }

/* 12) Skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--surface-muted) 25%, var(--surface) 50%, var(--surface-muted) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s linear infinite; border-radius: 8px;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* 13) Seksi jauh di bawah lipatan */
.defer-render { content-visibility: auto; contain-intrinsic-size: auto 600px; }

/* Gerak dikurangi */
@media (prefers-reduced-motion: reduce) {
  .hero-in > * { animation: none; }
  .motion-ready [data-reveal] { opacity: 1; transform: none; transition: none; }
  .parallax > *, .hero-zoom { animation: none !important; }
  .marker--attention::after { animation: none; }
  .motion-ready .gap-bar__fill { transform: none; transition: none; }
  .site-header, .menu-panel, .card-lift, .card-lift .media img { transition: none; }
  .skeleton { animation: none; }
  @view-transition { navigation: none; }
}
```

### motion.ts
```ts
// motion.ts — TILARA Motion Kit (vanilla, ±1 KB gzip, tanpa dependensi)
const fmt = new Intl.NumberFormat("id-ID");

function countUp(el: HTMLElement, to: number) {
  const t0 = performance.now();
  const dur = 1100;
  const step = (t: number) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Panggil sekali di layout PUBLIK (bukan layout operasional). Mengembalikan fungsi cleanup. */
export function initMotion(): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal], .gap-bar, [data-count]");

  // Reduced motion / browser lama: tampilkan semuanya apa adanya (HTML sudah berisi nilai akhir).
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    return () => {};
  }

  document.documentElement.classList.add("motion-ready");

  // Angka: HTML berisi nilai nyata. Animasi hanya dari 0 menuju nilai itu.
  const counts = new Map<HTMLElement, number>();
  targets.forEach((el) => {
    const to = Number(el.dataset.count);
    if (el.dataset.count !== undefined && Number.isFinite(to)) {
      counts.set(el, to);
      el.setAttribute("aria-label", fmt.format(to)); // pembaca layar tetap mendengar nilai akhir
      el.textContent = "0";
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.add("is-in");
        const to = counts.get(el);
        if (to !== undefined) countUp(el, to);
        io.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  targets.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    document.documentElement.classList.remove("motion-ready");
  };
}
```

### MotionInit.tsx
```tsx
"use client";
// MotionInit.tsx — pasang di layout PUBLIK saja (app/(public)/layout.tsx)
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMotion } from "./motion";

export default function MotionInit() {
  const pathname = usePathname(); // jalankan ulang saat pindah halaman
  useEffect(() => initMotion(), [pathname]);
  return null;
}
```

### Contoh pemakaian
```html
<!-- Contoh pemakaian -->
<section class="hero-in hero-in--after-gate">
  <h1 style="--i:0">Wilayah yang jauh tetap terlihat.</h1>
  <p  style="--i:1">…</p>
  <a  style="--i:2" class="btn">Lihat peta</a>
</section>

<section class="defer-render">
  <h2 data-reveal>Kesenjangan bantuan</h2>
  <article class="card-lift" data-reveal style="--i:1">
    <div class="gap-bar" style="--pct:30"> <!-- pct = bantuan terkonfirmasi / kebutuhan × 100, dari data nyata -->
      <div class="gap-bar__fill"></div>
    </div>
    <strong data-count="350">350</strong> kg belum terpenuhi  <!-- contoh DEMO -->
  </article>
</section>

<div class="parallax"><img src="/img/wilayah.webp" alt="…" width="1600" height="900" loading="lazy"></div>
<div class="rail"><article class="card-lift">…</article>…</div>
```

---

## Lampiran C — Kode Acuan GSAP (seksi cerita, lazy)

Simpan sebagai `components/story/StoryScroll.tsx`. Instal hanya `gsap` dan `@gsap/react` (ScrollTrigger sudah termasuk dalam paket `gsap`). Selalu cocokkan dengan panduan skill `gsap-skills` yang terpasang.

### StoryScroll.tsx
```tsx
"use client";
// StoryScroll.tsx — bab cerita saat scroll (publik, beranda/halaman cerita).
// Muat LAZY, mis. di client component pembungkus:
//   const StoryScroll = dynamic(() => import("./StoryScroll"), { ssr: false });
// Baca skill gsap-skills terlebih dahulu; sesuaikan bila skill menyarankan pola lain.
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function StoryScroll({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          ok: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 900px)",
        },
        (ctx) => {
          const { ok, desktop } = ctx.conditions as { ok: boolean; desktop: boolean };
          if (!ok) return; // reduced motion: biarkan konten statis apa adanya

          // 1) Tiap bab: elemen masuk bertahap saat bab mendekati viewport
          gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((chapter) => {
            const items = chapter.querySelectorAll("[data-chapter-item]");
            if (!items.length) return;
            gsap.from(items, {
              y: 32,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: { trigger: chapter, start: "top 75%", once: true },
            });
          });

          // 2) Desktop saja: media sticky berubah halus mengikuti scroll bab
          if (desktop) {
            gsap.utils.toArray<HTMLElement>("[data-chapter-media]").forEach((media) => {
              gsap.fromTo(
                media,
                { scale: 1.08 },
                {
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: media.closest("[data-chapter]") ?? media,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              );
            });
          }
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
```

### Contoh pemakaian
```html
<!-- Contoh pemakaian -->
<StoryScroll>
  <section data-chapter>
    <h2 data-chapter-item>Desa yang belum terlihat</h2>
    <p data-chapter-item>…cerita dari laporan VERIFIED…</p>
    <figure data-chapter-media><img src="/img/wilayah.webp" alt="…" width="1600" height="900" /></figure>
  </section>
</StoryScroll>
```

---

## Lampiran D — Kode Acuan Header Publik

Simpan sebagai `components/layout/SiteHeader.tsx` dan `components/layout/site-header.css` (sesuaikan path). Ganti `<Logo />` dengan SVG logo resmi. Isi `lastUpdated` dan `contactEmail` hanya dari data/konfigurasi nyata.

### SiteHeader.tsx
```tsx
"use client";
// SiteHeader.tsx — header publik TILARA (layout PUBLIK saja).
// Layout operasional memakai header aplikasi yang lebih ringkas.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./site-header.css";

type Props = {
  /** overlay: transparan di atas hero GELAP lalu solid saat scroll. solid: halaman lain. */
  variant?: "overlay" | "solid";
  isAuthenticated?: boolean;
  /** Teks siap tampil dari server, mis. "26 Nov 2026, 08:10 WIB". Jangan dikarang. */
  lastUpdated?: string;
  /** Dari konfigurasi. Jangan dikarang; bila kosong tidak ditampilkan. */
  contactEmail?: string;
};

const NAV = [
  { href: "/peta", label: "Peta" },
  { href: "/laporan", label: "Laporan" },
  { href: "/statistik", label: "Statistik" },
  { href: "/tentang", label: "Tentang" },
];

// Placeholder kontur: GANTI dengan SVG logo resmi (gunakan currentColor + class "logo-dot" untuk titik).
function Logo() {
  return (
    <svg className="logo-mark" viewBox="0 0 100 100" width="38" height="38" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M50 6C68 4 90 16 93 38C96 60 84 90 56 94C30 98 8 80 7 54C6 28 28 8 50 6Z" />
        <path d="M50 15C65 14 83 24 85 41C87 59 76 83 54 86C34 89 16 74 16 54C15 34 33 16 50 15Z" />
        <path d="M50 25C62 24 75 32 76 45C77 58 68 75 52 77C38 79 25 67 25 53C25 38 38 26 50 25Z" />
        <path d="M50 35C58 34 66 40 66 48C66 57 60 66 51 67C42 68 35 60 35 52C35 43 41 35 50 35Z" />
      </g>
      <circle className="logo-dot" cx="50" cy="50" r="6.5" />
    </svg>
  );
}

const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PHONE = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z";
const USER = "M20 21a8 8 0 0 0-16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const BURGER = "M4 7h16M4 12h16M4 17h16";
const CLOSE = "M6 6l12 12M18 6L6 18";

export default function SiteHeader({
  variant = "overlay",
  isAuthenticated = false,
  lastUpdated,
  contactEmail,
}: Props) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparan → solid: IntersectionObserver pada sentinel (tanpa listener scroll, tanpa re-render)
  useEffect(() => {
    const header = headerRef.current;
    const sentinel = sentinelRef.current;
    if (!header) return;
    if (variant === "solid" || !sentinel || !("IntersectionObserver" in window)) {
      header.dataset.scrolled = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        header.dataset.scrolled = String(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [variant]);

  // Tutup menu mobile saat pindah halaman
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const account = isAuthenticated
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/login", label: "Masuk" };

  const openMenu = () => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <a className="skip-link" href="#konten">Lewati ke konten</a>
      <div ref={sentinelRef} className="header-sentinel" aria-hidden="true" />
      <noscript>
        <style>{`.site-header{color:#172b3a}.site-header__main::before{opacity:1}.site-header::before{opacity:0}`}</style>
      </noscript>

      <header
        ref={headerRef}
        className="site-header"
        data-variant={variant}
        data-scrolled={variant === "solid" ? "true" : "false"}
      >
        {variant === "overlay" && (
          <div className="site-header__util">
            <div className="hdr-container">
              <span>
                {lastUpdated
                  ? `Data terverifikasi diperbarui ${lastUpdated}`
                  : "Transparansi bantuan fisik untuk wilayah terdampak bencana"}
              </span>
              <span className="util-links">
                <Link href="/tentang#metodologi">Metodologi verifikasi</Link>
                {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
              </span>
            </div>
          </div>
        )}

        <div className="site-header__main">
          <div className="hdr-container site-header__row">
            <Link href="/" className="brand" aria-label="TILARA, beranda">
              <Logo />
              <span className="brand__text">
                <span className="brand__name">TILARA</span>
                <span className="brand__tag">Visibility for the Unreached</span>
              </span>
            </Link>

            <nav aria-label="Utama" className="nav">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav__link"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="actions">
              <Link href="/darurat" className="btn btn--danger">
                <Icon d={PHONE} size={16} />
                <span>Darurat</span>
              </Link>
              <Link href="/lapor" className="btn btn--primary">Lapor</Link>
              <Link href={account.href} className="icon-btn account" aria-label={account.label}>
                <Icon d={USER} />
              </Link>
              <button
                type="button"
                className="icon-btn burger"
                aria-label="Buka menu"
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                onClick={openMenu}
              >
                <Icon d={BURGER} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <dialog
        id="menu-mobile"
        ref={dialogRef}
        className="menu-dialog"
        aria-label="Menu navigasi"
        onClose={() => setMenuOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu(); // klik backdrop
        }}
      >
        <div className="menu-inner">
          <div className="menu-top">
            <Link href="/" className="brand" aria-label="TILARA, beranda"><Logo /><span className="brand__name">TILARA</span></Link>
            <button type="button" className="icon-btn" aria-label="Tutup menu" onClick={closeMenu}>
              <Icon d={CLOSE} />
            </button>
          </div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="menu-link" aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <Link href={account.href} className="menu-link">{account.label}</Link>
          <div className="menu-cta">
            <Link href="/darurat" className="btn btn--danger"><Icon d={PHONE} size={16} /><span>Darurat</span></Link>
            <Link href="/lapor" className="btn btn--primary">Lapor</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
```

### site-header.css
```css
/* site-header.css — Header publik TILARA (transparan → solid, ringan) */
:root {
  --util-h: 40px;
  --main-h: 72px;
  --hdr-ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}
@media (max-width: 1023px) { :root { --util-h: 0px; } }

/* Offset konten: halaman solid memakai .page-offset; hero gelap memakai .hero-offset */
.page-offset { padding-top: var(--main-h); }
.hero-offset { padding-top: calc(var(--util-h) + var(--main-h) + 3rem); }

.hdr-container { width: min(100% - 2rem, 1200px); margin-inline: auto; }

/* Sentinel untuk IntersectionObserver (di puncak dokumen) */
.header-sentinel { position: absolute; top: 0; left: 0; width: 1px; height: 32px; pointer-events: none; }

/* Skip link (di luar header agar tidak ikut transform) */
.skip-link {
  position: fixed; top: -100px; left: 1rem; z-index: 60;
  padding: 0.5rem 1rem; border-radius: 8px; background: #fff; color: #172b3a; font-weight: 600;
}
.skip-link:focus { top: 0.5rem; }

/* ---------- Header ---------- */
.site-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  color: #fff;
  transition: transform 0.45s var(--hdr-ease), color 0.3s var(--hdr-ease);
}
.site-header[data-variant="solid"] { --util-h: 0px; }
.site-header[data-scrolled="true"] {
  color: var(--tilara-navy, #172b3a);
  transform: translate3d(0, calc(var(--util-h) * -1), 0); /* utility bar keluar layar */
}

/* Scrim gradien di atas hero (hilang saat scroll) */
.site-header::before {
  content: ""; position: absolute; left: 0; right: 0; top: 0; pointer-events: none;
  height: calc(var(--util-h) + var(--main-h) + 32px);
  background: linear-gradient(rgb(23 43 58 / 0.7), transparent);
  transition: opacity 0.3s var(--hdr-ease);
}
.site-header[data-scrolled="true"]::before { opacity: 0; }

/* Utility bar */
.site-header__util { height: var(--util-h); font-size: 0.75rem; letter-spacing: 0.02em; border-bottom: 1px solid rgb(255 255 255 / 0.18); }
.site-header__util .hdr-container { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.util-links { display: flex; gap: 1.5rem; }
.util-links a { color: inherit; text-decoration: none; opacity: 0.85; }
.util-links a:hover { opacity: 1; text-decoration: underline; }

/* Bar utama + latar solid (hanya opacity yang dianimasikan) */
.site-header__main { position: relative; isolation: isolate; height: var(--main-h); }
.site-header__main::before {
  content: ""; position: absolute; inset: 0; z-index: -1; opacity: 0;
  background: rgb(255 255 255 / 0.97);
  box-shadow: 0 1px 0 var(--border, #d9dcd5), 0 10px 30px rgb(23 43 58 / 0.08);
  transition: opacity 0.3s var(--hdr-ease);
}
.site-header[data-scrolled="true"] .site-header__main::before { opacity: 1; }
.site-header__row { height: 100%; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; }

/* Brand */
.brand { display: inline-flex; align-items: center; gap: 0.65rem; color: inherit; text-decoration: none; justify-self: start; }
.brand__text { display: flex; flex-direction: column; line-height: 1; }
.brand__name { font-weight: 700; font-size: 1.05rem; letter-spacing: 0.32em; }
.brand__tag { margin-top: 0.4rem; font-size: 0.5625rem; letter-spacing: 0.24em; text-transform: uppercase; opacity: 0.8; }
.logo-mark { transition: transform 0.45s var(--hdr-ease); }
.site-header[data-scrolled="true"] .logo-mark { transform: scale(0.9); }
.logo-dot { fill: currentColor; transition: fill 0.3s var(--hdr-ease); }
.site-header[data-scrolled="true"] .logo-dot { fill: var(--tilara-green, #246b50); }

/* Navigasi tengah (tautan teks) */
.nav { display: flex; gap: 2rem; }
.nav__link {
  position: relative; padding: 0.5rem 0.125rem; color: inherit; text-decoration: none;
  font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
}
.nav__link::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -4px; height: 2px; background: currentColor;
  transform: scaleX(0); transform-origin: center; transition: transform 0.35s var(--hdr-ease);
}
.nav__link:hover::after, .nav__link[aria-current="page"]::after { transform: scaleX(1); }

/* Aksi kanan */
.actions { display: flex; align-items: center; gap: 0.5rem; justify-self: end; }
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  height: 40px; padding: 0 1rem; border-radius: 8px; color: #fff; text-decoration: none;
  font-size: 0.875rem; font-weight: 600; line-height: 1; transition: transform 0.2s var(--hdr-ease), filter 0.2s;
}
.btn--primary { background: var(--tilara-green, #246b50); }
.btn--danger  { background: var(--tilara-red-deep, #b83e37); }
.btn:hover { filter: brightness(1.08); }
@media (hover: hover) { .btn:hover { transform: translateY(-1px); } }
.icon-btn {
  display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 8px;
  border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; opacity: 0.9;
}
.icon-btn:hover { opacity: 1; }
.burger { display: none; }

.site-header :focus-visible, .menu-dialog :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; border-radius: 6px; }

/* ---------- Mobile ---------- */
@media (max-width: 1023px) {
  .site-header__util, .nav, .account, .brand__tag { display: none; }
  .site-header__row { grid-template-columns: 1fr auto; }
  .burger { display: inline-grid; }
  .btn, .icon-btn { height: 44px; }
  .icon-btn { width: 44px; }
}

/* ---------- Menu mobile (dialog native) ---------- */
.menu-dialog {
  margin: 0 0 0 auto; padding: 0; border: 0; height: 100dvh; max-height: none;
  width: min(88vw, 360px); max-width: none;
  background: var(--tilara-navy, #172b3a); color: var(--tilara-paper, #f5f6f3);
}
.menu-dialog[open] { animation: menu-in 0.4s var(--hdr-ease); }
.menu-dialog::backdrop { background: rgb(0 0 0 / 0.55); }
@keyframes menu-in { from { transform: translate3d(100%, 0, 0); } }
.menu-inner { display: flex; flex-direction: column; height: 100%; padding: 1rem 1.25rem 1.5rem; overflow-y: auto; }
.menu-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.menu-link {
  padding: 1rem 0; color: inherit; text-decoration: none;
  font-size: 1.125rem; font-weight: 600; border-bottom: 1px solid rgb(255 255 255 / 0.12);
}
.menu-link[aria-current="page"] { color: var(--tilara-amber, #e5a13a); }
.menu-cta { margin-top: auto; display: grid; gap: 0.75rem; padding-top: 1.5rem; }
.menu-cta .btn { height: 48px; }
html:has(dialog.menu-dialog[open]) { overflow: hidden; }
@media (min-width: 1024px) { .menu-dialog { display: none; } }

/* ---------- Mode gelap & gerak dikurangi ---------- */
@media (prefers-color-scheme: dark) {
  .site-header[data-scrolled="true"] { color: var(--tilara-paper, #f5f6f3); }
  .site-header__main::before { background: rgb(23 43 58 / 0.97); box-shadow: 0 1px 0 #2b4457, 0 10px 30px rgb(0 0 0 / 0.3); }
  .site-header[data-scrolled="true"] .logo-dot { fill: #4fae86; }
}
@media (prefers-reduced-motion: reduce) {
  .site-header, .site-header::before, .site-header__main::before, .logo-mark, .logo-dot,
  .nav__link::after, .btn { transition: none; }
  .menu-dialog[open] { animation: none; }
}
```

### Contoh pemakaian
```tsx
// Layout publik — beranda (hero GELAP):
<SiteHeader variant="overlay" isAuthenticated={!!session} lastUpdated={fmtLastUpdated} contactEmail={config.contactEmail} />
<main id="konten">
  <section className="hero hero-offset hero-in hero-in--after-gate">…hero gelap…</section>
</main>

// Halaman publik lainnya (/peta, /laporan, /tentang, /statistik, /laporan/[id], /darurat):
<SiteHeader variant="solid" isAuthenticated={!!session} />
<main id="konten" className="page-offset">…</main>
```
Catatan: `variant="overlay"` hanya boleh dipakai bila hero di bawahnya **gelap**. Jika hero terang, pakai `variant="solid"`.
