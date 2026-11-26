"use client";

import type { PublicReportItem } from "@/lib/public-queries";

interface IncidentContextSectionProps {
  report: PublicReportItem | null;
}

export function IncidentContextSection({ report }: IncidentContextSectionProps) {
  if (!report) return null;

  const formattedWhen = new Date(report.when).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const narrativeItems = [
    { key: "WHAT", label: "Apa yang terjadi", value: report.what },
    { key: "WHO", label: "Siapa yang terdampak", value: report.who },
    {
      key: "WHERE",
      label: "Di mana lokasinya",
      value: `${report.whereDescription} (${report.region.name}, ${report.region.province})${
        report.isLocationBlurred ? " — Koordinat disamarkan ~1,1 km demi privasi" : ""
      }`,
    },
    { key: "WHEN", label: "Kapan tercatat", value: `${formattedWhen} WIB` },
    { key: "WHY", label: "Mengapa mendesak", value: report.why },
    { key: "HOW", label: "Bagaimana akses & penyaluran", value: report.how },
  ];

  return (
    <section
      aria-label="Konteks Kejadian 5W+1H"
      className="py-10 sm:py-12 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Konteks Kejadian (5W+1H)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            Kronologi &amp; Kondisi Akses Lapangan
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Seluruh rincian di samping diambil langsung dari laporan terverifikasi tanpa penambahan informasi atau estimasi yang tidak tercatat.
          </p>
        </div>

        <div className="lg:col-span-8">
          <dl className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
            {narrativeItems.map((item) => (
              <div
                key={item.key}
                data-gsap="story-step"
                className="p-4 sm:px-6 sm:py-4 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4"
              >
                <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] font-mono text-[11px]">
                    {item.key}
                  </span>
                  <span>{item.label}</span>
                </dt>
                <dd className="sm:col-span-8 text-sm text-[var(--color-text)] leading-relaxed tabular-numbers">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

