# AGENTS.md — TILARA

> Aturan wajib untuk setiap agen AI (Antigravity, Claude Code, dll.) dan kontributor.
> Baca file ini, `DESIGN.md`, `prisma/schema.prisma`, serta modul autentikasi, RBAC, server actions, dan API **sebelum mengubah kode apa pun**.

## 1. Identitas Produk

**TILARA — Disaster & Humanitarian Aid Transparency Platform**

Memantau kondisi wilayah terdampak, memetakan kebutuhan masyarakat, dan memastikan distribusi bantuan dapat ditelusuri.

**Prinsip inti:** jangan sampai ada wilayah terdampak yang tidak terlihat hanya karena lokasinya jauh dari pusat distribusi bantuan.

TILARA bukan hanya menunjukkan di mana bencana terjadi, tetapi juga bagaimana kondisi masyarakat di sana, bantuan apa yang sudah diterima, dan kebutuhan apa yang masih belum terpenuhi.

**Cakupan & peran (keputusan final):**
- Cakupan bantuan: **kebutuhan dasar masyarakat di wilayah terdampak bencana alam** (pangan, air, tempat tinggal, obat, logistik), berupa bantuan fisik yang dapat dihitung dan dikonfirmasi.
- Peran utama: **pemetaan kebutuhan dan transparansi bantuan**.
- Prioritas utama: **daerah pelosok dan wilayah yang belum terjangkau**.
- Tagline: *Visibility for the Unreached* (Terlihat. Terlacak. Terjangkau.)

## 2. Product Principles (tidak boleh dilanggar)

- TILARA **bukan** platform donasi. Tidak ada donasi uang, crowdfunding, marketplace bantuan, atau pembayaran.
- TILARA **bukan** media sosial (tidak ada feed, like, komentar publik, followers).
- TILARA **bukan** sekadar peta bencana. Peta harus menampilkan kondisi dan kesenjangan bantuan.
- Model bantuan adalah **bantuan fisik** (barang, paket, logistik, tenaga), dengan jenis, jumlah, dan satuan.
- Pengguna utama: **semua pihak dengan hak akses berbeda** (RBAC).
- Pengalaman utama: **story-first** + **peta operasional** + **transparansi bantuan**.

## 3. Aturan Data (WAJIB)

1. Data laporan individual yang terlihat publik harus berstatus `VERIFIED`.
2. Data `PENDING` **tidak boleh** dikirim ke client publik (filter di server, bukan di UI).
3. Bantuan `PENDING` (belum dikonfirmasi diterima) **tidak mengurangi** kekurangan.
4. Jenis laporan `PEMANTAUAN` **tidak boleh** menampilkan defisit bantuan.
5. Jenis laporan `KEBUTUHAN` memakai perhitungan: `kekurangan = kebutuhan − bantuan terkonfirmasi` (minimum 0).
6. Data simulasi/contoh wajib berlabel **DEMO** yang terlihat jelas.
7. Lokasi sensitif **wajib di-mask di server** (mis. pembulatan koordinat / area umum), tidak pernah dikirim presisi ke publik.
8. Semua perubahan status penting (verifikasi, penolakan, konfirmasi bantuan, perubahan role) harus tercatat di audit log: siapa, kapan, dari status apa ke status apa, alasan.
9. **Dilarang** menciptakan statistik, foto, kronologi, nama korban, atau kejadian bencana fiktif sebagai fakta. Foto hanya jika punya sumber jelas.
10. Satuan harus konsisten (kg, paket, liter, unit, dll.) dan tidak boleh dijumlahkan lintas satuan berbeda.

## 4. Peran & Hak Akses (RBAC)

Gunakan model RBAC **yang sudah ada di repository**. Jangan membuat sistem autentikasi kedua.

| Peran | Tanggung jawab |
|---|---|
| Publik | Lihat laporan terverifikasi, peta, kebutuhan/kekurangan, riwayat publik, metodologi. Tanpa akun. |
| Relawan / Pelapor | Buat & perbarui laporan, catat kebutuhan, laporkan bantuan diterima, lihat laporan sendiri, kirim saat offline. |
| Verifikator | Periksa laporan & bukti, validasi lokasi, setujui/tolak dengan alasan tertulis. |
| Koordinator / Lembaga | Lihat kebutuhan, catat alokasi, perbarui status distribusi, konfirmasi penerimaan, pantau kekurangan. |
| Administrator | Kelola akun/role, data referensi, konfigurasi, audit, tangani penyalahgunaan. |

| Halaman | Relawan | Verifikator | Koordinator | Admin |
|---|:-:|:-:|:-:|:-:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Buat laporan | ✓ | — | — | ✓ |
| Laporan saya | ✓ | — | — | ✓ |
| Antrean verifikasi | — | ✓ | — | ✓ |
| Kebutuhan bantuan | ✓ | ✓ | ✓ | ✓ |
| Distribusi bantuan | — | — | ✓ | ✓ |
| Manajemen pengguna | — | — | — | ✓ |
| Audit aktivitas | — | Terbatas | Terbatas | ✓ |

Otorisasi **selalu dicek di server** (server action, route handler, query). Menyembunyikan tombol di UI bukan kontrol akses.

## 5. Route yang Direncanakan

| Route | Fungsi | Akses |
|---|---|---|
| `/` | Story-first homepage | Publik |
| `/peta` | Peta operasional | Publik |
| `/laporan` | Direktori laporan terverifikasi | Publik |
| `/laporan/[id]` | Detail cerita & kondisi | Publik (VERIFIED saja) |
| `/darurat` | Info & panduan darurat | Publik |
| `/tentang` | Metodologi & transparansi | Publik |
| `/statistik` | Statistik agregat (hanya VERIFIED) | Publik |
| `/login` | Autentikasi | Publik |
| `/dashboard` | Dashboard per role | Login |
| `/lapor` | Formulir pelaporan | Relawan, Admin |
| `/antrean` | Antrean laporan offline | Relawan |
| `/verifikasi` | Pemeriksaan laporan | Verifikator, Admin |
| `/kebutuhan` | Pemantauan kebutuhan bantuan | Login |
| `/distribusi` | Pencatatan distribusi | Koordinator, Admin |
| `/admin` | Administrasi sistem | Admin |

Sesuaikan dengan struktur route yang sudah ada. Jangan memindahkan atau menghapus route yang berjalan tanpa persetujuan.

## 6. Yang Harus Dipertahankan

- Trust Score dan verifikasi laporan
- Sistem role relawan, petugas, administrator
- Perhitungan kebutuhan dan kekurangan bantuan
- Peta Leaflet + OpenStreetMap
- Offline queue untuk laporan saat koneksi terbatas
- Privasi lokasi sensitif
- Riwayat perubahan dan status laporan

## 7. Stack (verifikasi di repo, jangan asumsikan)

Kemungkinan besar: Next.js (App Router), TypeScript, Prisma, Leaflet + OpenStreetMap, GSAP (+ `@gsap/react`), Motion. **Konfirmasi dari `package.json` dan struktur repo** sebelum menulis kode. Jangan menambah dependensi besar tanpa alasan tertulis.

## 8. Cara Kerja Agen

1. **Audit dulu, ubah kemudian.** Baca kode terkait; ringkas temuan sebelum mengedit.
2. **Bertahap.** Kerjakan satu tahap per sesi, sesuai `PROMPT_ANTIGRAVITY.md`.
3. **Perubahan minimal & reversibel.** Jangan refactor besar yang tidak diminta.
4. **Jangan mengganti arsitektur atau menghapus fitur** yang sudah berjalan tanpa alasan dan persetujuan eksplisit.
5. **Migrasi database:** hanya aditif jika memungkinkan; jelaskan dampaknya dan jangan jalankan terhadap data produksi.
6. **Jangan commit rahasia** (`.env`, token, kunci). Gunakan variabel lingkungan.
7. Jika instruksi bertentangan dengan Bagian 2 atau 3, **berhenti dan tanyakan**.

## 9. Definition of Done (per tahap)

- [ ] Type-check, lint, dan build lulus
- [ ] Tidak ada data `PENDING` bocor ke endpoint/halaman publik (uji manual + tes)
- [ ] Perhitungan kekurangan benar (termasuk kasus bantuan PENDING & laporan PEMANTAUAN)
- [ ] Cek otorisasi di sisi server untuk setiap aksi baru
- [ ] Perubahan status baru tercatat di audit log
- [ ] Responsif di mobile (≥ 360px) dan lulus cek aksesibilitas dasar (kontras, fokus keyboard, label)
- [ ] Konten simulasi berlabel DEMO
- [ ] Ringkasan perubahan: file diubah, alasan, risiko, cara menguji

## 10. Larangan Mutlak

- Menambah fitur donasi uang atau pembayaran
- Menampilkan data PENDING / belum terverifikasi sebagai fakta publik
- Mengirim koordinat presisi lokasi sensitif ke client publik
- Membuat data, foto, atau statistik bencana palsu tanpa label DEMO
- Membuat autentikasi/RBAC paralel
- Menghapus audit log atau riwayat perubahan

## 11. Brand TILARA & Anggaran Performa

- Nama produk resmi: **TILARA**. Tagline: *Visibility for the Unreached*. Nama lama (TRASEC) tidak boleh tersisa di UI, metadata, teks, atau dokumentasi. Identifier teknis (nama package, database, env, repo) **jangan diganti tanpa persetujuan**; laporkan dulu daftarnya.
- Cakupan bantuan: kebutuhan dasar masyarakat di wilayah terdampak bencana alam, prioritas daerah pelosok. Peran: pemetaan kebutuhan dan transparansi bantuan (bukan donasi, bukan penghubung donatur).
- Aset logo dan palet mengikuti `DESIGN.md` bagian 2. Jangan mengarang ulang logo; gunakan aset SVG resmi.
- **Gate intro** (`DESIGN.md` bagian 12): hanya beranda, sekali per sesi, murni CSS, hormati `prefers-reduced-motion`, dan tidak boleh memperburuk LCP/CLS secara berarti.
- **Motion Kit** (`DESIGN.md` bagian 8 dan Lampiran B): hanya di layout publik; JS motion ≤ 3 KB gzip; hanya `transform`/`opacity`; wajib menghormati `prefers-reduced-motion`; konten harus lengkap tanpa JS; animasi angka hanya menganimasikan data nyata.
- Animasi berat (GSAP/video/WebGL) hanya boleh di halaman publik naratif, dimuat *lazy*, dan tidak di area operasional atau jalur pelaporan.
- Target performa halaman publik pada ponsel kelas menengah dan 4G: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms. Laporkan angka sebelum dan sesudah bila mengubah beranda.

## 12. Skill GSAP (`gsap-skills`)

- Skill resmi GreenSock sudah terpasang di proyek (`npx skills add https://github.com/greensock/gsap-skills`). **Wajib dibaca dan diikuti sebelum menulis atau mengubah kode GSAP.**
- Bila isi skill bertentangan dengan aturan TILARA (data, privasi, aksesibilitas, anggaran performa, larangan di area operasional), **aturan TILARA yang menang**; catat konfliknya di laporan.
- Pembagian: gerak sederhana pakai CSS (Motion Kit); GSAP hanya untuk gerak naratif/koreografi (lihat `DESIGN.md` bagian 8.4 dan Lampiran C).
- GSAP wajib: dimuat lazy, hanya rute publik yang memakainya, `useGSAP` + `gsap.matchMedia()` (reduced-motion dan breakpoint), cleanup otomatis, hanya `transform`/`opacity`, ukuran bundel GSAP diukur dan dilaporkan (anggaran ±40 KB gzip).
- Dilarang di `/dashboard`, `/verifikasi`, `/distribusi`, `/lapor`, `/antrean`, `/admin`.

## 13. Navigasi, Header, dan Struktur Halaman Publik

- Header publik mengikuti `DESIGN.md` Bagian 13 dan Lampiran D: transparan di atas hero gelap, solid saat scroll, utility bar hilang, mobile memakai `<dialog>`. **Header tidak disembunyikan saat scroll.**
- Perubahan keadaan header memakai IntersectionObserver, **bukan** listener scroll.
- **Darurat** harus dapat dicapai dengan satu ketukan di semua ukuran layar. Tombol Darurat dan Lapor adalah satu-satunya tautan header berbentuk tombol.
- Area operasional memakai header aplikasi terpisah (tanpa utility bar, tanpa transparansi, tanpa animasi). Jangan memakai `SiteHeader` di sana.
- Teks utility bar (waktu pembaruan, email kontak, nomor darurat) hanya dari data/konfigurasi nyata. **Dilarang mengarang** nomor telepon, email, atau waktu.
- Beranda `/` dan Tentang `/tentang` tetap **dua halaman** (`DESIGN.md` 7.1): beranda memuat teaser cara kerja yang menaut ke `/tentang#metodologi`; `/tentang` memuat metodologi lengkap dan tidak mengulang cerita beranda.
- `/statistik` hanya dipertahankan bila isinya berbeda dari `/laporan` dan `/peta`; selain itu jadikan tab di `/laporan`. Semua angkanya hanya dari data VERIFIED.
