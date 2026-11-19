import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database Humanitarian Intelligence Platform (Trasec)...");

  // 1. Bersihkan data sebelumnya dengan urutan referensial terbalik
  console.log("🧹 Membersihkan data sebelumnya...");
  await prisma.rateLimitRecord.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.aid.deleteMany();
  await prisma.need.deleteMany();
  await prisma.report.deleteMany();
  await prisma.region.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat Pengguna Utama (Bcrypt hash 10 rounds)
  console.log("👤 Membuat akun pengguna contoh...");
  const passwordHashAdmin = await bcrypt.hash("AdminTrasec2026!", 10);
  const passwordHashVerifikator = await bcrypt.hash("Verifikator2026!", 10);
  const passwordHashRelawan = await bcrypt.hash("Relawan2026!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@trasec.id",
      name: "Administrator Sistem Trasec",
      phone: "08110000001",
      role: "ADMIN",
      password: passwordHashAdmin,
      isVerifiedVolunteer: true,
    },
  });

  const verifikatorKomunitas = await prisma.user.create({
    data: {
      email: "verifikator.komunitas@trasec.id",
      name: "Budi Santoso (Verifikator Komunitas)",
      phone: "08110000002",
      role: "VERIFIKATOR",
      password: passwordHashVerifikator,
      isVerifiedVolunteer: true,
    },
  });

  const verifikatorLembaga = await prisma.user.create({
    data: {
      email: "pmi.verifikator@trasec.id",
      name: "Siti Rahma (Verifikator PMI Jawa Barat)",
      phone: "08110000003",
      role: "VERIFIKATOR",
      password: passwordHashVerifikator,
      isVerifiedVolunteer: true,
    },
  });

  const relawanAktif = await prisma.user.create({
    data: {
      email: "dewi.relawan@trasec.id",
      name: "Dewi Kartika (Relawan Terpercaya)",
      phone: "08110000004",
      role: "RELAWAN",
      password: passwordHashRelawan,
      isVerifiedVolunteer: true,
    },
  });

  const relawanBaru = await prisma.user.create({
    data: {
      email: "ahmad.relawan@trasec.id",
      name: "Ahmad Rizki (Relawan Baru)",
      phone: "08110000005",
      role: "RELAWAN",
      password: passwordHashRelawan,
      isVerifiedVolunteer: false,
    },
  });

  // 3. Buat Lembaga Resmi (Organization & Membership)
  console.log("🏢 Membuat data lembaga terverifikasi...");
  const pmiJabar = await prisma.organization.create({
    data: {
      name: "Palang Merah Indonesia (PMI) Wilayah Jawa Barat",
      type: "LEMBAGA_KEMANUSIAAN",
      isVerified: true,
      verifiedAt: new Date(),
      verifiedById: admin.id,
      members: {
        create: {
          userId: verifikatorLembaga.id,
          orgRole: "ORG_ADMIN",
        },
      },
    },
  });

  // 4. Buat Master Data Wilayah (16 Wilayah Representatif Seluruh Indonesia)
  console.log("🗺️ Membuat master wilayah...");
  const regionsData = [
    { id: "reg-jkt-pusat", name: "Jakarta Pusat", province: "DKI Jakarta", city: "Jakarta Pusat", latitude: -6.1805, longitude: 106.8284 },
    { id: "reg-jkt-selatan", name: "Jakarta Selatan", province: "DKI Jakarta", city: "Jakarta Selatan", latitude: -6.2615, longitude: 106.8106 },
    { id: "reg-cianjur", name: "Kabupaten Cianjur", province: "Jawa Barat", city: "Cianjur", latitude: -6.8222, longitude: 107.1394 },
    { id: "reg-bandung", name: "Kota Bandung", province: "Jawa Barat", city: "Bandung", latitude: -6.9175, longitude: 107.6191 },
    { id: "reg-semarang", name: "Kota Semarang", province: "Jawa Tengah", city: "Semarang", latitude: -6.9667, longitude: 110.4167 },
    { id: "reg-lumajang", name: "Kabupaten Lumajang", province: "Jawa Timur", city: "Lumajang", latitude: -8.1331, longitude: 113.2246 },
    { id: "reg-surabaya", name: "Kota Surabaya", province: "Jawa Timur", city: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
    { id: "reg-aceh-besar", name: "Kabupaten Aceh Besar", province: "Aceh", city: "Jantho", latitude: 5.3833, longitude: 95.5167 },
    { id: "reg-padang", name: "Kota Padang", province: "Sumatera Barat", city: "Padang", latitude: -0.9492, longitude: 100.3543 },
    { id: "reg-banjarmasin", name: "Kota Banjarmasin", province: "Kalimantan Selatan", city: "Banjarmasin", latitude: -3.3194, longitude: 114.5908 },
    { id: "reg-samarinda", name: "Kota Samarinda", province: "Kalimantan Timur", city: "Samarinda", latitude: -0.5022, longitude: 117.1536 },
    { id: "reg-denpasar", name: "Kota Denpasar", province: "Bali", city: "Denpasar", latitude: -8.6705, longitude: 115.2126 },
    { id: "reg-kupang", name: "Kota Kupang", province: "Nusa Tenggara Timur", city: "Kupang", latitude: -10.1772, longitude: 123.6070 },
    { id: "reg-makassar", name: "Kota Makassar", province: "Sulawesi Selatan", city: "Makassar", latitude: -5.1477, longitude: 119.4327 },
    { id: "reg-palu", name: "Kota Palu", province: "Sulawesi Tengah", city: "Palu", latitude: -0.8917, longitude: 119.8707 },
    { id: "reg-jayapura", name: "Kota Jayapura", province: "Papua", city: "Jayapura", latitude: -2.5916, longitude: 140.6690 },
  ];

  for (const r of regionsData) {
    await prisma.region.create({ data: r });
  }

  // 5. Buat Kontak Darurat Resmi (Nasional & Lokal)
  console.log("☎️ Membuat kontak darurat resmi...");
  const emergencyContacts = [
    { name: "BNPB (Badan Nasional Penanggulangan Bencana)", number: "117", scope: "NASIONAL" as const, sourceUrl: "https://bnpb.go.id" },
    { name: "BASARNAS (Pencarian dan Pertolongan)", number: "115", scope: "NASIONAL" as const, sourceUrl: "https://basarnas.go.id" },
    { name: "Layanan Darurat Terpadu Nasional", number: "112", scope: "NASIONAL" as const, sourceUrl: "https://layanan112.kominfo.go.id" },
    { name: "Kepolisian Republik Indonesia", number: "110", scope: "NASIONAL" as const },
    { name: "Kemenkes / Ambulans Gawat Darurat", number: "119", scope: "NASIONAL" as const },
    { name: "Pemadam Kebakaran", number: "113", scope: "NASIONAL" as const },
    { name: "Posko Darurat BPBD Cianjur", number: "0263-2280112", scope: "KABUPATEN" as const, regionId: "reg-cianjur" },
    { name: "Posko Tanggap Darurat Bencana Lumajang", number: "0334-881112", scope: "KABUPATEN" as const, regionId: "reg-lumajang" },
    { name: "Posko Siaga Rob Semarang", number: "024-3580011", scope: "KABUPATEN" as const, regionId: "reg-semarang" },
  ];

  for (const c of emergencyContacts) {
    await prisma.emergencyContact.create({ data: c });
  }

  // 6. Buat Laporan Contoh (Semua Kategori & Siklus Status)
  console.log("📝 Membuat laporan kemanusiaan contoh...");

  // Laporan 1: BENCANA - VERIFIED (Cianjur) - Gempa Susulan & Longsor Jalur
  await prisma.report.create({
    data: {
      clientId: "seed-rep-cianjur-001",
      title: "Kebutuhan Mendesak Pengungsian Desa Cibulakan Pasca Gempa Susulan",
      type: "KEBUTUHAN",
      category: "BENCANA",
      urgency: "DARURAT",
      status: "VERIFIED",
      verificationLevel: "COMMUNITY",
      verificationCount: 2,
      revisionCount: 0,
      trustScore: 85,
      trustScoreReasons: JSON.stringify([
        "Foto bukti lapangan terlampir (+30)",
        "Pelapor merupakan relawan terpercaya (+20)",
        "Terdapat laporan lain dalam radius 2 km (+20)",
        "Format 5W+1H lengkap dan spesifik (+15)",
      ]),
      latitude: -6.8123,
      longitude: 107.1287,
      regionId: "reg-cianjur",
      reporterId: relawanAktif.id,
      what: "Gempa susulan berkekuatan M 4.2 menyebabkan 35 rumah rusak berat dan warga mengungsi di lapangan terbuka tanpa tenda yang memadai.",
      who: "85 Kepala Keluarga (sekitar 320 jiwa) termasuk 28 balita dan 15 lansia di RW 04 Desa Cibulakan.",
      whereDescription: "Lapangan samping Kantor Balai RW 04, Desa Cibulakan, Kecamatan Cugenang. Akses jalan utama masih bisa dilalui kendaraan roda 4 kecil.",
      when: new Date("2026-11-18T06:30:00Z"),
      why: "Tenda keluarga dan selimut sangat mendesak karena hujan deras setiap sore dan potensi hipotermia pada anak-anak.",
      how: "Penyaluran logistik fisik dapat diantarkan langsung ke Posko Lapangan RW 04 dengan konfirmasi koordinator di lokasi.",
      needs: {
        create: [
          { itemCategory: "HUNIAN", unit: "unit", qty: 40, kind: "BARANG" },
          { itemCategory: "MAKANAN", unit: "paket", qty: 300, kind: "BARANG" },
          { itemCategory: "MEDIS", unit: "kotak", qty: 50, kind: "BARANG" },
          { itemCategory: "EVAKUASI", unit: "orang", qty: 15, kind: "TENAGA" },
        ],
      },
      aids: {
        create: [
          {
            clientId: "seed-aid-cianjur-001",
            userId: relawanAktif.id,
            itemCategory: "HUNIAN",
            unit: "unit",
            qty: 15,
            status: "CONFIRMED",
          },
          {
            clientId: "seed-aid-cianjur-002",
            userId: relawanAktif.id,
            itemCategory: "MAKANAN",
            unit: "paket",
            qty: 120,
            status: "CONFIRMED",
          },
          {
            clientId: "seed-aid-cianjur-003",
            userId: relawanBaru.id,
            itemCategory: "MEDIS",
            unit: "kotak",
            qty: 20,
            status: "CONFIRMED",
          },
        ],
      },
      verifications: {
        create: [
          {
            userId: verifikatorKomunitas.id,
            decision: "APPROVE",
            note: "Data validasi lapangan telah dikonfirmasi melalui ketua RW dan bukti foto geolokasi.",
          },
          {
            userId: verifikatorLembaga.id,
            decision: "APPROVE",
            note: "Verifikasi lapangan PMI: Kebutuhan tenda keluarga dan paket makanan telah sesuai asesmen awal.",
          },
        ],
      },
    },
  });

  // Laporan 2: LINGKUNGAN - VERIFIED (Semarang) - Tanggul Rob Jebol
  await prisma.report.create({
    data: {
      clientId: "seed-rep-semarang-002",
      title: "Perbaikan Darurat Tanggul Tambak Lorok dan Pasokan Karung Pasir",
      type: "KEBUTUHAN",
      category: "LINGKUNGAN",
      urgency: "MENDESAK",
      status: "VERIFIED",
      verificationLevel: "OFFICIAL",
      verificationCount: 1,
      revisionCount: 0,
      trustScore: 80,
      trustScoreReasons: JSON.stringify([
        "Diverifikasi langsung oleh perwakilan resmi PMI (+50)",
        "Foto bukti tanggul jebol terlampir (+30)",
      ]),
      latitude: -6.9451,
      longitude: 110.4352,
      regionId: "reg-semarang",
      reporterId: relawanAktif.id,
      what: "Tanggul penahan air laut jebol sepanjang 12 meter mengakibatkan genangan rob setinggi 60 cm merendam pemukiman nelayan.",
      who: "Masyarakat pesisir Tambak Lorok RW 13, mencakup 140 rumah warga.",
      whereDescription: "Titik jebol ujung dermaga nelayan Tambak Lorok, Tanjung Mas, Semarang Utara.",
      when: new Date("2026-11-17T14:00:00Z"),
      why: "Jika tidak segera ditimbun dengan karung pasir dan bronjong sebelum pasang malam, genangan air laut akan meluas ke jalan raya utama.",
      how: "Bantuan karung pasir dan terpal dapat diturunkan di dekat gapura masuk dermaga untuk diangkut perahu nelayan ke titik tanggul.",
      needs: {
        create: [
          { itemCategory: "LOGISTIK", unit: "karung", qty: 2000, kind: "BARANG" },
          { itemCategory: "LOGISTIK", unit: "lembar", qty: 100, kind: "BARANG" },
          { itemCategory: "EVAKUASI", unit: "orang", qty: 25, kind: "TENAGA" },
        ],
      },
      aids: {
        create: [
          {
            clientId: "seed-aid-smg-001",
            userId: relawanAktif.id,
            itemCategory: "LOGISTIK",
            unit: "karung",
            qty: 800,
            status: "CONFIRMED",
            organizationId: pmiJabar.id,
          },
        ],
      },
      verifications: {
        create: [
          {
            userId: verifikatorLembaga.id,
            decision: "APPROVE",
            note: "Diverifikasi resmi PMI Jabar: Kebutuhan karung pasir dan personel penanganan darurat rob akurat.",
          },
        ],
      },
    },
  });

  // Laporan 3: LANSIA - VERIFIED (Jakarta Selatan) - Kategori Sensitif (Privasi Koordinat)
  await prisma.report.create({
    data: {
      clientId: "seed-rep-jkt-lansia-003",
      title: "Dukungan Makanan Lunak dan Obat Rutin untuk Panti Jompo Swadaya",
      type: "KEBUTUHAN",
      category: "LANSIA",
      urgency: "TERENCANA",
      status: "VERIFIED",
      verificationLevel: "COMMUNITY",
      verificationCount: 2,
      revisionCount: 0,
      trustScore: 70,
      trustScoreReasons: JSON.stringify([
        "Foto bukti panti jompo terlampir (+30)",
        "Pelapor terverifikasi (+20)",
        "Format 5W+1H lengkap (+15)",
      ]),
      latitude: -6.28452,
      longitude: 106.82413,
      regionId: "reg-jkt-selatan",
      reporterId: relawanAktif.id,
      what: "Kebutuhan pasokan popok dewasa, makanan lunak bergizi, dan obat pemeliharaan hipertensi serta diabetes.",
      who: "42 penghuni panti lansia non-pemerintah dengan rentang usia 68-87 tahun.",
      whereDescription: "Jalan Gandaria Tengah III No. 14, Kebayoran Baru, Jakarta Selatan.",
      when: new Date("2026-11-16T10:00:00Z"),
      why: "Donatur tetap panti mengalami penurunan akibat efisiensi usaha yayasan, persediaan kebutuhan pokok menipis untuk 10 hari ke depan.",
      how: "Paket kebutuhan dapat dikirimkan ke sekretariat yayasan pada jam kerja (09.00 - 16.00 WIB).",
      needs: {
        create: [
          { itemCategory: "MAKANAN", unit: "paket", qty: 50, kind: "BARANG" },
          { itemCategory: "MEDIS", unit: "paket", qty: 40, kind: "BARANG" },
          { itemCategory: "SANITASI", unit: "kotak", qty: 60, kind: "BARANG" },
        ],
      },
      aids: {
        create: [
          {
            clientId: "seed-aid-lansia-001",
            userId: relawanAktif.id,
            itemCategory: "MAKANAN",
            unit: "paket",
            qty: 25,
            status: "CONFIRMED",
          },
          {
            clientId: "seed-aid-lansia-002",
            userId: relawanAktif.id,
            itemCategory: "MEDIS",
            unit: "paket",
            qty: 15,
            status: "CONFIRMED",
          },
        ],
      },
      verifications: {
        create: [
          {
            userId: verifikatorKomunitas.id,
            decision: "APPROVE",
            note: "Telah dikonfirmasi langsung dengan pengurus yayasan dan daftar inventaris kebutuhan diverifikasi.",
          },
          {
            userId: verifikatorLembaga.id,
            decision: "APPROVE",
            note: "Peninjauan data panti selesai.",
          },
        ],
      },
    },
  });

  // Laporan 4: PEMANTAUAN - VERIFIED (Lumajang) - Erupsi Semeru (Tanpa Need / Aid)
  await prisma.report.create({
    data: {
      clientId: "seed-rep-lumajang-pantau-004",
      title: "Pantauan Aktivitas Guguran Lava dan Jalur Evakuasi Curah Kobokan",
      type: "PEMANTAUAN",
      category: "BENCANA",
      urgency: "MENDESAK",
      status: "VERIFIED",
      verificationLevel: "OFFICIAL",
      verificationCount: 1,
      revisionCount: 0,
      trustScore: 85,
      trustScoreReasons: JSON.stringify([
        "Diverifikasi pos pengamatan resmi (+50)",
        "Foto visual guguran terlampir (+30)",
      ]),
      latitude: -8.1189,
      longitude: 113.0845,
      regionId: "reg-lumajang",
      reporterId: relawanAktif.id,
      what: "Aktivitas vulkanik meningkat dengan luncuran awan panas guguran sejauh 3 km ke arah Besuk Kobokan. Belum ada pengungsian warga besar-besaran.",
      who: "Warga Dusun Kajar Kuning dan Dusun Kamarkajang diimbau waspada dan tidak beraktivitas di radius 5 km.",
      whereDescription: "Jalur penyeberangan Besuk Kobokan, Desa Supiturang, Kecamatan Pronojiwo, Lumajang.",
      when: new Date("2026-11-19T04:15:00Z"),
      why: "Peringatan dini bagi relawan dan warga agar tidak melintasi jembatan darurat saat hujan di hulu.",
      how: "Akses pemantauan visual dilakukan dari Pos Pengamatan Gunung Api Semeru di Gunung Sawur.",
    },
  });

  // Laporan 5: PENDIDIKAN - PENDING (Jayapura) - Menunggu Verifikasi
  await prisma.report.create({
    data: {
      clientId: "seed-rep-jayapura-pending-005",
      title: "Kebutuhan Buku Bacaan dan Alat Tulis Sekolah Rimba Skouw",
      type: "KEBUTUHAN",
      category: "PENDIDIKAN",
      urgency: "TERENCANA",
      status: "PENDING",
      verificationCount: 0,
      revisionCount: 0,
      trustScore: 45,
      trustScoreReasons: JSON.stringify([
        "Format 5W+1H lengkap (+15)",
        "Nomor telepon pelapor terdaftar (+15)",
        "Belum ada foto bukti lapangan (+0)",
      ]),
      latitude: -2.6105,
      longitude: 140.7123,
      regionId: "reg-jayapura",
      reporterId: relawanBaru.id,
      what: "Kekurangan buku tulis, alat mewarnai, dan papan tulis darurat untuk kelas belajar anak perbatasan.",
      who: "55 murid sekolah tapal batas usia SD kelas 1 hingga 4.",
      whereDescription: "Balai Komunitas Kampung Mosso, Distrik Muara Tami, Kota Jayapura.",
      when: new Date("2026-11-18T11:00:00Z"),
      why: "Ruang kelas darurat belum memiliki modul pembelajaran memadai menjelang tahun ajaran baru.",
      how: "Bantuan perlengkapan pendidikan dapat dititipkan ke kantor pos perbatasan atau diantar langsung.",
      needs: {
        create: [
          { itemCategory: "PENDIDIKAN", unit: "paket", qty: 60, kind: "BARANG" },
          { itemCategory: "PENDIDIKAN", unit: "unit", qty: 3, kind: "BARANG" },
        ],
      },
    },
  });

  // Laporan 6: KESEHATAN - NEEDS_REVISION (Padang) - Meminta Revisi
  await prisma.report.create({
    data: {
      clientId: "seed-rep-padang-revision-006",
      title: "Permohonan Penjernih Air Pasca Banjir Luapan Batang Kuranji",
      type: "KEBUTUHAN",
      category: "KESEHATAN",
      urgency: "MENDESAK",
      status: "NEEDS_REVISION",
      verificationCount: 0,
      revisionCount: 1,
      trustScore: 30,
      trustScoreReasons: JSON.stringify([
        "Pelapor terdaftar (+15)",
        "Deskripsi parsial (+15)",
      ]),
      latitude: -0.9254,
      longitude: 100.3812,
      regionId: "reg-padang",
      reporterId: relawanBaru.id,
      what: "Sumur warga tergenang lumpur sehingga butuh kaporit dan tablet penjernih air.",
      who: "Warga RW 02 sekitar bantaran sungai Batang Kuranji.",
      whereDescription: "Kelurahan Kuranji, Kota Padang.",
      when: new Date("2026-11-17T09:00:00Z"),
      why: "Air sumur keruh dan berbau tanah.",
      how: "Melalui pos ronda RT 03.",
      needs: {
        create: [
          { itemCategory: "SANITASI", unit: "kotak", qty: 100, kind: "BARANG" },
        ],
      },
      verifications: {
        create: [
          {
            userId: verifikatorKomunitas.id,
            decision: "REJECT",
            note: "Mohon sertakan estimasi jumlah kepala keluarga penerima manfaat dan foto titik sumber air yang tercemar.",
          },
        ],
      },
    },
  });

  // Laporan 7: SOSIAL_LAINNYA - REJECTED_FINAL (Surabaya) - Ditolak Permanen
  await prisma.report.create({
    data: {
      clientId: "seed-rep-surabaya-rejected-007",
      title: "Laporan Duplikat Bantuan Sembako Warga Bantaran Rel",
      type: "KEBUTUHAN",
      category: "SOSIAL_LAINNYA",
      urgency: "TERENCANA",
      status: "REJECTED_FINAL",
      verificationCount: 0,
      revisionCount: 3,
      trustScore: 15,
      trustScoreReasons: JSON.stringify([
        "Akun belum diverifikasi (+0)",
        "Laporan terindikasi duplikasi identik (+15)",
      ]),
      latitude: -7.2612,
      longitude: 112.7489,
      regionId: "reg-surabaya",
      reporterId: relawanBaru.id,
      what: "Bantuan paket sembako untuk warga sekitar rel stasiun.",
      who: "Kelompok warga setempat.",
      whereDescription: "Bantaran rel Surabaya.",
      when: new Date("2026-11-15T08:00:00Z"),
      why: "Kebutuhan warga harian.",
      how: "Datang langsung.",
      verifications: {
        create: [
          {
            userId: verifikatorKomunitas.id,
            decision: "REJECT",
            note: "Laporan teridentifikasi duplikasi dan tidak memenuhi kelengkapan 5W+1H setelah 3 kali batas peninjauan.",
          },
        ],
      },
    },
  });

  console.log("✅ Seeding database selesai dengan sukses!");
  console.log(`
Ringkasan Data Tersimpan:
- 5 Akun Pengguna (Admin, 2 Verifikator, 2 Relawan)
- 1 Lembaga Resmi (PMI Wilayah Jawa Barat)
- 16 Wilayah Administrasi Terdaftar
- 9 Kontak Darurat (6 Nasional, 3 Posko Daerah)
- 7 Laporan Kemanusiaan (VERIFIED, PENDING, NEEDS_REVISION, REJECTED_FINAL, PEMANTAUAN)
  `);
}

main()
  .catch((e) => {
    console.error("❌ Galat saat melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
