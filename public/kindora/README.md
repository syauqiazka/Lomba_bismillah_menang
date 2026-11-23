# Kindora - Non-Profit & Humanitarian Aid Landing Page

Website landing page responsif, modern, dan bernuansa emosional-hangat untuk organisasi kemanusiaan / non-profit, dirancang persis mengadopsi bahasa visual **Kindora** dan **Hopefy**.

---

## 1. Identitas Visual & Brand

- **Nama Brand**: `Kindora` (dapat dikustomisasi dari satu berkas `js/data.js`).
- **Mood**: Hangat, penuh harapan, bersih, dan profesional.
- **Palet Warna**:
  - **Kuning Emas (Aksen Utama / CTA)**: `#F5B800` (Hover: `#E0A700`)
  - **Hijau Tua (CTA Section, Footer, Secondary Button)**: `#0F2A22` (Dark: `#091B15`)
  - **Krem / Beige (Background Section)**: `#F5F1E6` (Border: `#E6E0D2`)
  - **Putih & Abu Lembut**: `#FFFFFF` & `#F3F3F3` untuk ritme visual selang-seling
  - **Teks Utama**: `#111111` & `#555555`
- **Tipografi**:
  - Heading: *Bricolage Grotesque* (Sans-serif tebal, uppercase, tracking rapat)
  - Aksen Heading: *Playfair Display* (Serif elegan miring untuk kata yang ditekankan, contoh: *Lasting Change*, *Every Child*)
  - Body: *Inter* (Sangat mudah dibaca di mobile dan desktop)
- **Elemen Dekoratif Khusus**:
  - **Torn Paper Edge (Tepi Sobekan Kertas)**: Menggunakan path SVG nyata di tepi atas dan bawah section krem & hero.
  - **Pola Checkerboard Kotak-Kotak Kecil**: Pola geometris di sudut foto hero persis referensi Kindora.
  - **Watermark Teks Raksasa "KINDORA"**: Tipografi abu muda halus di belakang area hero.
  - **Pita Marquee Miring (Continuous Ticker)**: Banner berjalan terus menerus miring (-1 derajat).

---

## 2. Struktur 17 Seksi Lengkap (Atas ke Bawah)

1. **Top Bar**: Alamat kantor New York, nomor telepon, email resmi, dan ikon sosial media.
2. **Navbar Sticky**: Logo brand, menu navigasi, tombol "Donate Now" kuning, serta hamburger drawer di mobile.
3. **Hero**: Judul raksasa uppercase *"FIND THE POPULAR CAUSE AND DONATE THEM"*, foto anak berbingkai sudut kotak-kotak (checkerboard), badge *"We're Since 2020 – Based in USA"*, teks ajakan, dan watermark teks raksasa.
4. **About / Turning Compassion into Meaningful Impact**: Kolom kiri narasi + 2 pilar (Fundraising Integrity & Donation Marketing), kolom kanan kolase 3 foto asimetris.
5. **Core Values (3 Kartu di Background Krem dengan Tepi Sobekan)**: *Sustainable Impact*, *Transparent Giving*, *Strength in Unity*.
6. **Support Our Mission / Donation Cards**: 4 kartu donasi (Education, Nutritious Food, Healthcare, Clean Water) dengan foto, persentase progress bar donasi interaktif, jumlah pendukung, dan tombol "Donate Now". Dilengkapi panah kontrol carousel.
7. **Mission & Vision**: Teks *"HOPE, CARE, AND OPPORTUNITY FOR EVERY CHILD"*, tab interaktif Our Mission / Our Vision, badge 100% transparan, dan foto anak berpotongan unik.
8. **Transforming Lives Through Meaningful Action**: Slider horizontal program lapangan dengan label kategori, tag lokasi, dan titik navigasi pagination.
9. **Volunteers Section**: Judul *"VOLUNTEERS MAKING A DIFFERENCE LIVES"*, counter 45.000+ relawan, banner video dokumenter dengan tombol Play berdenyut (*pulsating play ring*), dan 4 statistik dampak (52+ Communities, 5.000+ Meals, 2.200+ Children Educated, 100% Non-profit).
10. **Upcoming Events**: 3 kartu vertikal dengan overlay gradien kuning di bagian bawah, tanggal event, lokasi, dan judul kegiatan.
11. **Continuous Marquee / Ticker Kuning**: Pita horizontal miring yang bergerak mulus tanpa putus.
12. **Testimonials**: 4 kartu testimoni putih bersih dengan foto avatar pendukung, asal negara, rating bintang emas 5.00, dan kutipan autentik.
13. **Gift Makes a Difference / Impact Stats**: Banner dengan tepi sobekan krem, judul *"Every Gift Creates a Brighter Tomorrow"*, dan 4 kartu angka statistik (19K, 10K, 19K, 15K).
14. **FAQ Accordion**: 4 pertanyaan & jawaban dengan animasi buka/tutup halus (pertanyaan pertama terbuka otomatis) dan foto potret anak.
15. **Latest News & Stories**: 1 artikel besar unggulan di sisi kiri + 3 artikel ringkas tersusun di sisi kanan lengkap dengan badge kategori dan tanggal.
16. **CTA Section (Background Hijau Tua #0F2A22)**: Headline *"Looking to make a real difference today?"* + kartu hotline 24/7 dan tombol donasi emas.
17. **Footer (Hijau Tua Pekat #091B15)**: Logo brand, ringkasan komitmen, 4 kolom navigasi (Company, Programs, Newsletter dengan validasi email), counter live (35M Supporters & $65,000+ Relief Deployed), dan tautan legal.

---

## 3. Fitur Interaktif & Animasi

- **Scroll Reveal (Intersection Observer)**: Elemen muncul mulus (*fade-up*) saat masuk ke viewport.
- **Count-Up Angka Dinamis**: Angka-angka statistik menghitung naik secara otomatis saat terlihat di layar.
- **Bilah Progress Donasi Beranimasi**: Bar donasi mengisi persentase secara halus saat pengguna menggulir ke seksi donasi.
- **Modal Donasi Interaktif**: Klik tombol "Donate Now" mana pun untuk membuka popup donasi dengan pilihan nominal ($25, $50, $100, $250, Custom), nama program yang didukung, dan simulasi bukti tanda terima digital.
- **Modal Video Dokumenter**: Klik tombol Play di seksi relawan untuk membuka modal pratinjau video.
- **Tab Switcher Misi & Visi**: Perpindahan konten instan antara Misi dan Visi organisasi.
- **FAQ Accordion**: Buka-tutup pertanyaan dengan transisi tinggi otomatis dan rotasi ikon panah.
- **Mobile Drawer Navigasi**: Menu samping yang ramah sentuhan di layar ponsel.

---

## 4. Struktur Berkas Proyek

```
kindora/
├── index.html       # Struktur halaman semantik 17 seksi lengkap
├── css/
│   └── style.css    # Typography, SVG torn paper edge, checker pattern, marquee, keyframes
├── js/
│   ├── data.js      # Single source of truth untuk seluruh teks, angka, & array program
│   └── main.js      # Handler interaksi: IntersectionObserver, accordion, slider, modal
└── README.md        # Panduan teknis & dokumentasi
```

---

## 5. Cara Menjalankan Proyek

Pilih salah satu cara termudah berikut:

### Cara 1: Buka Langsung di Browser (Tanpa Instalasi Apapun)
Cukup buka berkas `kindora/index.html` dengan cara:
- **Windows**: Klik dua kali berkas `index.html`, atau seret (*drag and drop*) ke browser Google Chrome / Microsoft Edge.
- Tailwind CSS, Google Fonts, dan Lucide Icons akan dimuat secara otomatis melalui CDN resmi.

### Cara 2: Menjalankan via Local Static Server
Jalankan salah satu perintah berikut di terminal:
```bash
# Menggunakan npx serve
npx serve kindora -l 5000

# Atau menggunakan Python 3
cd kindora
python -m http.server 5000
```
Lalu buka `http://localhost:5000` di browser Anda.

### Cara 3: Akses via Server Next.js Proyek Ini
Salinan berkas juga tersedia di direktori `public/kindora/`:
```bash
npm run dev
```
Lalu buka:
`http://localhost:3000/kindora/index.html`

---

## 6. Cara Mengubah Data & Brand

Semua teks, foto, program, testimoni, dan nomor telepon dikumpulkan di `js/data.js`.
Contoh jika ingin mengubah nama brand:
```javascript
// Buka js/data.js
const KINDORA_DATA = {
  brand: {
    name: "NamaBrandAnda", // Ganti di sini, seluruh halaman otomatis terupdate!
    primaryPhone: "+62 812 3456 7890",
    ...
  }
}
```
Semua elemen dengan atribut `data-brand-name` akan otomatis menggunakan nama baru tersebut.
