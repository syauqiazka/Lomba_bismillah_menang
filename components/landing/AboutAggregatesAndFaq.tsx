"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, PhoneCall } from "lucide-react";
import type { PublicAggregates } from "@/lib/public-queries";

interface AboutAggregatesAndFaqProps {
  aggregates: PublicAggregates;
}

const FAQS = [
  {
    q: "Bagaimana selisih kebutuhan vs bantuan dihitung di TRASEC?",
    a: "Sistem menghitung selisih secara deterministik dengan rumus max(0, Total Kebutuhan - Total Bantuan Terkonfirmasi) per pasangan kategori barang dan satuan ukur. Bantuan yang masih berstatus PENDING atau REJECTED tidak mengurangi selisih resmi.",
  },
  {
    q: "Mengapa TRASEC tidak menerima donasi uang?",
    a: "TRASEC adalah platform transparansi logistik dan tenaga relawan. Kami fokus mencegah penumpukan barang di satu titik dan tidak memproses transaksi keuangan dalam bentuk apa pun.",
  },
  {
    q: "Bagaimana standar pelaporan 5W+1H bekerja?",
    a: "Setiap laporan wajib mengisi What (kebutuhan/kejadian), Who (penerima manfaat tanpa membocorkan nama pribadi), Where (wilayah dan patokan aman), When (waktu kejadian), Why (latar belakang), dan How (akses penyaluran ke lokasi).",
  },
  {
    q: "Apakah aplikasi tetap dapat digunakan saat sinyal lemah?",
    a: "Ya. Halaman utama menyediakan alternatif daftar teks hemat data, tombol darurat luring selalu tersedia, dan pengisian laporan mendukung antrean lokal (offline-first queue) yang disinkronkan otomatis saat sinyal kembali.",
  },
];

export function AboutAggregatesAndFaq({ aggregates }: AboutAggregatesAndFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Ringkasan Statistik Agregat Aktual */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Ringkasan Data Terpublikasi
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Angka agregat langsung dari basis data laporan terverifikasi (atau data sampel demo saat luring).
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:underline shrink-0"
            >
              <span>Buka Dashboard Statistik</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)] tabular-numbers">
            <div className="p-5">
              <dt className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Laporan Terverifikasi
              </dt>
              <dd className="text-3xl font-bold text-[var(--color-text)] mt-1">
                {aggregates.totalVerifiedReports}
              </dd>
              <dd className="text-xs text-[var(--color-text-muted)] mt-1">
                Status VERIFIED (5W+1H)
              </dd>
            </div>

            <div className="p-5">
              <dt className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Bantuan Terkonfirmasi
              </dt>
              <dd className="text-3xl font-bold text-[var(--color-primary)] mt-1">
                {aggregates.totalConfirmedAidItems}
              </dd>
              <dd className="text-xs text-[var(--color-text-muted)] mt-1">
                Catatan bantuan CONFIRMED
              </dd>
            </div>

            <div className="p-5">
              <dt className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Wilayah Koordinasi
              </dt>
              <dd className="text-3xl font-bold text-[var(--color-text)] mt-1">
                {aggregates.totalActiveRegions}
              </dd>
              <dd className="text-xs text-[var(--color-text-muted)] mt-1">
                Kabupaten/Kota aktif
              </dd>
            </div>

            <div className="p-5">
              <dt className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Menunggu Verifikasi
              </dt>
              <dd className="text-3xl font-bold text-[var(--color-info-text)] mt-1">
                {aggregates.totalPendingReports}
              </dd>
              <dd className="text-xs text-[var(--color-text-muted)] mt-1">
                Hanya angka agregat publik
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* FAQ Akordion */}
      <section id="faq" className="py-12 sm:py-16 px-4 sm:px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-lg">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `faq-panel-${idx}`;
              return (
                <div key={idx} className="bg-[var(--color-surface)]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full min-h-[48px] px-4 py-3.5 flex items-center justify-between gap-4 text-left text-sm sm:text-base font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-focus)] cursor-pointer transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-[var(--color-text-secondary)] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      className="px-4 pb-4 pt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed"
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Bersih */}
      <footer className="bg-[var(--color-secondary)] text-white py-10 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2">
            <div className="font-bold text-sm">TRASEC</div>
            <p className="text-white/80 leading-relaxed">
              Humanitarian Intelligence Platform Indonesia. 100% transparansi logistik fisik dan tenaga relawan, bebas transaksi finansial.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-sm">Navigasi Platform</div>
            <ul className="space-y-1.5 text-white/85">
              <li><Link href="/" className="hover:underline">Peta Operasional</Link></li>
              <li><Link href="/dashboard" className="hover:underline">Dashboard Statistik Publik</Link></li>
              <li><Link href="/lapor" className="hover:underline">Formulir Lapor 5W+1H</Link></li>
              <li><Link href="/antrean" className="hover:underline">Antrean Pengiriman Luring</Link></li>
              <li><Link href="/login" className="hover:underline">Portal Relawan &amp; Verifikator</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-sm">Saluran Darurat Resmi</div>
            <p className="text-white/80 leading-relaxed">
              Dalam kondisi darurat mengancam jiwa, hubungi langsung 112 (Terpadu), 115 (Basarnas), 117 (BNPB), atau 119 (Ambulans).
            </p>
            <Link
              href="/darurat"
              className="inline-flex items-center gap-1.5 mt-1 px-3 py-2 rounded bg-[#B83E37] hover:bg-[#99332D] text-white font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Buka Direktori Darurat</span>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/15 text-[11px] text-white/75 flex flex-col sm:flex-row justify-between gap-2">
          <span>TRASEC &mdash; Transparansi Kebutuhan &amp; Bantuan Relawan Indonesia.</span>
          <span>Bukan layanan pengganti panggilan gawat darurat 112/115/117/119.</span>
        </div>
      </footer>
    </>
  );
}
