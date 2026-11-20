# PANDUAN SKENARIO DEMO JURI (5-7 MENIT) — TRASEC

> Dokumen panduan langkah demi langkah bagi pengembang solo saat mempresentasikan dan mendemonstrasikan **TRASEC (Humanitarian Intelligence Platform)** di hadapan dewan juri **Traspac Competition 2026**.

---

## 🎯 Target Penilaian yang Dijawab

Skenario ini disusun untuk memaksimalkan poin penilaian (Total 100 Poin):
- **Logika Code (15%)**: Menunjukkan formula selisih $\max(0, \text{Need} - \text{Aid})$ dan alur status laporan.
- **User Interface (15%)**: Menunjukkan desain editorial bermartabat bebas generic AI slop, kontras tinggi, dan responsif.
- **Performa Sistem (10%)**: Peta Leaflet OpenStreetMap instan tanpa watermark/API key dan cepat di koneksi rendah.
- **Pengetahuan Dasar Code (10%)**: Pengembang mampu menerangkan alur kode baris per baris tanpa black-box.
- **Penggunaan Database (10%)**: Kueri agregasi SQL anti fan-out dan transaksi database serializable.
- **Kerapihan Code (10%)**: TypeScript strict mode, Zod validation, dan struktur direktori modular.
- **Keamanan Aplikasi (10%)**: Proteksi IDOR (404), pengaburan koordinat lansia di server, sanitasi EXIF di browser.
- **Easy Development (10%)**: Menunjukkan kemudahan menjalankan aplikasi lokal dan tersedianya 4 akun demo 1-klik.
- **Kreativitas Ide (10%)**: Menjawab paradoks nyata ketimpangan logistik bantuan kemanusiaan.

---

## ⏱️ Alur Waktu Skenario Demo (Total: 6 Menit)

```
[00:00 - 00:45] Masalah Nyata & Nilai Kemanusiaan (Hero Landing Page)
       │
[00:45 - 02:00] Peta Operasional Selisih & Pengaburan Sensitif (/peta)
       │
[02:00 - 03:15] Pelaporan 5W+1H, Sanitasi EXIF, & Simulasi Offline (/lapor & /antrean)
       │
[03:15 - 04:30] Verifikasi Dua Lapis & Skor Transparansi (/verifikasi)
       │
[04:30 - 05:30] Pencatatan Bantuan & Proteksi Konkurensi Alokasi Ganda
       │
[05:30 - 06:00] Ringkasan Penutup, Bukti Testing (126 Tests), & Tanya Jawab
```

---

### Menit 00:00 – 00:45: Latar Belakang & Masalah Paradoks Bantuan
1. **Layar**: Buka `http://localhost:3000` (Landing Page Editorial).
2. **Poin yang Disampaikan ke Juri**:
   - *"Selamat pagi/siang Dewan Juri yang terhormat. Dalam setiap bencana dan krisis lingkungan di Indonesia, masalah terbesarnya bukanlah kurangnya kepedulian masyarakat, melainkan **ketimpangan distribusi logistik**."*
   - *"Mi instan dan pakaian bekas sering menumpuk di posko pinggir jalan raya utama, sementara posko pelosok kekurangan air bersih, obat-obatan, dan tenda ramah lansia."*
   - *"TRASEC hadir bukan sebagai platform penggalangan dana uang, melainkan **Humanitarian Intelligence Platform** yang menghitung dan menyajikan selisih riil antara kebutuhan korban dan bantuan fisik terkonfirmasi secara terbuka."*
3. **Sorotan Visual**: Gulir perlahan, tunjukkan kolase foto gotong royong riil Indonesia, bilah progress keterpenuhan kategori yang beranimasi halus, dan pita running text emas.

---

### Menit 00:45 – 02:00: Peta Spasial Selisih & Pengaburan Sensitif
1. **Layar**: Klik tombol **"Lihat Peta Kebutuhan"** menuju `/peta`.
2. **Poin yang Disampaikan ke Juri**:
   - **Kemandirian Peta**: *"Peta kami menggunakan ubin OpenStreetMap murni. Bebas biaya selamanya, tanpa ketergantungan API key pihak ketiga, dan bebas watermark."*
   - **Indikator Spasial Warna Selisih**:
     - 🔴 **Merah**: Kekurangan logistik besar (>50%).
     - 🟡 **Kuning**: Kekurangan logistik sedang (1-50%).
     - 🟢 **Hijau**: Kebutuhan telah terpenuhi (selisih 0).
   - **Fitur Etika & Privasi Korban Rentan**:
     - Klik marker laporan kategori **LANSIA** atau **KESEHATAN**.
     - Tunjukkan badge *"Lokasi Disamarkan"*.
     - Jelaskan ke juri: *"Untuk melindungi privasi keluarga dan tempat tinggal warga lansia atau pasien, server kami secara otomatis membulatkan koordinat GPS ke 2 desimal (~1,1 km radius). Alamat detail dihapus dari API publik."*
   - **Penanda Data Basi**: Tunjukkan penanda peringatan jika laporan tidak memiliki konfirmasi selama lebih dari 7 hari.

---

### Menit 02:00 – 03:15: Pelaporan 5W+1H, Sanitasi EXIF, & Demo Offline
1. **Layar**: Klik menu **"Lapor"** (`/lapor`).
2. **Poin yang Disampaikan ke Juri**:
   - **Kerangka 5W+1H**: *"Setiap laporan wajib memenuhi 6 elemen terstruktur: What, Who, Where, When, Why, How yang divalidasi skema Zod di sisi klien dan server."*
   - **Pemisahan Satuan**: Tunjukkan item kebutuhan memiliki kuantitas dan satuan ukur spesifik (`unit`).
   - **Sanitasi Metadata EXIF Foto**:
     - *"Banyak warga memotret langsung dari kamera ponsel yang menyimpan geotag koordinat rumah pribadi. Sistem kami membersihkan data EXIF foto secara instan di peramban menggunakan Canvas API sebelum data dikirim ke internet."*
   - **Simulasi Lapangan Blank Spot (Offline-First)**:
     - Buka Chrome DevTools (`F12`), masuk ke tab **Network**, pilih **Offline**.
     - Klik kirim formulir laporan.
     - Sistem mendeteksi ketiadaan internet dan secara otomatis menyimpan data ke **IndexedDB** lokal dengan UUID v4.
     - Buka halaman `/antrean` untuk memperlihatkan antrean laporan luring yang siap dikirim begitu sinyal kembali menyala.
     - Kembalikan Network ke status **Online**, klik tombol sinkronisasi idempoten.

---

### Menit 03:15 – 04:30: Alur Verifikasi Dua Lapis & Skor Transparansi
1. **Layar**: Buka halaman masuk `/login`.
2. **Poin yang Disampaikan ke Juri**:
   - Klik tombol demo **"🔍 Verifikator Komunitas"** (`verifikator.komunitas@trasec.id`).
   - Masuk ke modul `/verifikasi`.
3. **Sorotan Verifikasi**:
   - Tunjukkan antrean laporan yang berstatus `PENDING`.
   - **Skor Kepercayaan Deterministik (Trust Score 0-100)**:
     - Buka rincian skor. Tunjukkan butir perhitungan transparan: *Foto terlampir (+30), Pelapor terpercaya (+20), 5W+1H lengkap (+15)*.
     - Jelaskan: *"Skor ini dihitung secara matematis di server, bukan hasil tebakan black-box AI."*
   - **Aturan Dua Lapis**:
     - Tingkat Komunitas membutuhkan minimal 2 verifikator independen.
     - Tingkat Lembaga Resmi (`OFFICIAL`) seperti PMI dapat langsung memvalidasi laporan posko ke publik.
   - Klik tombol **"Setujui Laporan"** dengan catatan tinjauan wajib.

---

### Menit 04:30 – 05:30: Pencatatan Bantuan & Proteksi Konkurensi Database
1. **Layar**: Buka detail laporan yang telah disetujui di `/laporan/[id]`.
2. **Poin yang Disampaikan ke Juri**:
   - Tunjukkan tabel selisih kebutuhan vs bantuan terkonfirmasi per satuan barang.
   - Klik tombol **"Catat Bantuan Masuk"**.
   - Masukkan kuantitas bantuan fisik (misal: 50 kotak mi instan atau 10 buah tenda).
   - Simpan catatan bantuan.
   - **Penjelasan Kritis untuk Dewan Juri**:
     - *"Bagaimana jika dua relawan di dua posko berbeda mencatat bantuan yang sama dalam detik yang bersamaan? Di TRASEC, mutasi ini dibungkus dalam **transaksi serializable database (`prisma.$transaction`)** dengan penguncian baris (`SELECT ... FOR UPDATE`)."*
     - *"Sistem menjamin tidak ada 'alokasi ganda' (double allocation) yang melampaui batas kebutuhan riil."*
     - Tunjukkan bahwa nilai selisih langsung berkurang secara matematis saat bantuan terkonfirmasi.

---

### Menit 05:30 – 06:00: Kualitas Kode, Bukti Testing, & Penutup
1. **Layar**: Buka terminal IDE atau dashboard statistik `/dashboard`.
2. **Tunjukkan Hasil Eksekusi Unit Test**:
   - Jalankan `npm test` di terminal:
     - **126 Tests Passed di 20 Test Suites** dalam ~1.5 detik.
     - Menguji integritas perhitungan selisih, isolasi transaksi bantuan, proteksi IDOR, otentikasi role-based, dan enkripsi sesi.
3. **Kalimat Penutup (Closing Statement)**:
   - *"TRASEC membuktikan bahwa teknologi web modern tidak hanya bisa menggalang donasi uang, melainkan dapat menjadi instrumen intelijen kemanusiaan yang memastikan setiap rupiah logistik fisik tiba di tangan yang benar-benar membutuhkan tanpa ada satu pun wilayah yang terabaikan."*
   - *"Terima kasih Dewan Juri, kami siap untuk sesi tanya jawab."*

---

## 💡 Jawaban Cepat untuk Pertanyaan Kritis Dewan Juri

| Potensi Pertanyaan Juri | Jawaban Tepat & Berdasar Kode |
|---|---|
| **"Mengapa tidak pakai API peta komersial seperti Google Maps atau Mapbox?"** | *"Google Maps dan Mapbox membutuhkan API key berbayar dan rentan limit kuota saat situasi darurat. Kami memilih Leaflet OpenStreetMap Standard: 100% open source, bebas biaya selamanya, tanpa API key, tanpa watermark, dan ringan di ponsel relawan."* |
| **"Kenapa aplikasinya tidak memproses donasi uang saja?"** | *"Platform crowdfunding uang sudah banyak (seperti Kitabisa). Namun masalah di lapangan saat ini adalah ketimpangan fisik logistik: uang ada, tapi barang salah kirim dan menumpuk di jalan utama. TRASEC fokus menyelesaikan selisih logistik fisik."* |
| **"Bagaimana sistem mencegah laporan palsu (hoaks)?"** | *"Melalui verifikasi 2 lapis, validasi skema 5W+1H, foto bukti lapangan yang disanitasi, kalkulasi Trust Score deterministik, serta penolakan wajib beralasan tertulis minimal 10 karakter."* |
| **"Bagaimana jika database down saat demo?"** | *"Kami menerapkan arsitektur Dual-Layer High-Fidelity Fallback di `lib/fallback-data.ts`. Jika koneksi database terputus, seluruh data operasional tetap tersaji utuh tanpa galat layar putih."* |
