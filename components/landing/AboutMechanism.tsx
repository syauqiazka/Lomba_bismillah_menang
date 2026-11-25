"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, FileCheck2, EyeOff, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { code: "BENCANA", name: "Bencana Alam", scope: "Tenda pengungsian, evakuasi, makanan darurat, dan logistik posko." },
  { code: "LINGKUNGAN", name: "Lingkungan Hidup", scope: "Normalisasi sungai, karung pasir tanggul, pembersihan lahan, dan pemantauan." },
  { code: "LANSIA", name: "Pendampingan Lansia", scope: "Kebutuhan nutrisi, alat bantu mobilitas, dan pendampingan (koordinat dikaburkan)." },
  { code: "KESEHATAN", name: "Kesehatan & Sanitasi", scope: "Paket sanitasi, obat-obatan dasar, dan dukungan posko medis (koordinat dikaburkan)." },
  { code: "PENDIDIKAN", name: "Pendidikan Darurat", scope: "Perlengkapan belajar sementara dan dukungan ruang kelas darurat." },
  { code: "SOSIAL_LAINNYA", name: "Sosial Lainnya", scope: "Dapur umum, dukungan komunitas rentan, dan kebutuhan sosial harian." },
];

export function AboutMechanism() {
  const [activeTab, setActiveTab] = useState<"misi" | "visi">("misi");

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Misi & Visi + 3 Mekanisme Inti */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Mengapa Transparansi Selisih Dibutuhkan
            </h2>

            <div role="tablist" aria-label="Misi dan Visi TRASEC" className="inline-flex rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "misi"}
                onClick={() => setActiveTab("misi")}
                className={`min-h-[40px] px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] ${
                  activeTab === "misi"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                Misi Operasional
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "visi"}
                onClick={() => setActiveTab("visi")}
                className={`min-h-[40px] px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] ${
                  activeTab === "visi"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                Visi Kemanusiaan
              </button>
            </div>

            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              {activeTab === "misi"
                ? "Dalam operasi kemanusiaan, informasi kebutuhan sering tersebar di kanal tak resmi. Akibatnya bantuan menumpuk di titik yang mudah diakses sementara posko terpencil kekurangan pasokan dasar. TRASEC menyajikan selisih terbuka per satuan agar penyaluran tepat sasaran."
                : "Mewujudkan koordinasi kemanusiaan dan kerelawanan yang terukur di seluruh wilayah, di mana setiap posko menerima bantuan sesuai kebutuhan aktual tanpa pemborosan logistik maupun duplikasi pengiriman."}
            </p>
          </div>

          <div className="lg:col-span-7 divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <BarChart3 className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Kalkulasi Selisih Deterministik
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                  Selisih dihitung dengan rumus{" "}
                  <code className="font-mono text-xs bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                    max(0, Kebutuhan - Bantuan Terkonfirmasi)
                  </code>{" "}
                  per pasangan kategori barang dan satuan ukur. Pencatatan bantuan dilindungi transaksi terisolasi agar tidak melebihi kebutuhan.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <FileCheck2 className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Verifikasi Berlapis &amp; Skor Kepercayaan Terbuka
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                  Laporan publik memerlukan persetujuan minimal 2 verifikator independen (tingkat Komunitas) atau 1 verifikator lembaga terakreditasi (tingkat Lembaga). Skor kepercayaan 0–100 dihitung matematis dengan daftar alasan terbuka.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <EyeOff className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Perlindungan Privasi Lokasi Sensitif
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                  Kategori rentan seperti <strong className="text-[var(--color-text)]">Lansia</strong> dan{" "}
                  <strong className="text-[var(--color-text)]">Kesehatan</strong> otomatis dikaburkan koordinatnya (~1,1 km) pada API publik dan halaman peta terbuka.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Kategori Resmi (Daftar Terstruktur Tanpa Angka Simulasi Palsu) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                6 Kategori Penanganan &amp; Pemantauan
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Mencakup tanggap darurat bencana, kerusakan lingkungan hidup, dan kerentanan sosial sehari-hari.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline shrink-0"
            >
              <span>Filter kategori di Peta</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]">
                  <th scope="col" className="p-3">Kategori</th>
                  <th scope="col" className="p-3">Kode</th>
                  <th scope="col" className="p-3">Cakupan Lapangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
                {CATEGORIES.map((cat) => (
                  <tr key={cat.code}>
                    <td className="p-3 font-semibold text-[var(--color-text)] whitespace-nowrap">
                      {cat.name}
                    </td>
                    <td className="p-3 font-mono text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                      {cat.code}
                    </td>
                    <td className="p-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {cat.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
