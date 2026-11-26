import { notFound } from "next/navigation";
import { getPublicReportDetail } from "@/lib/public-queries";
import { getSession } from "@/lib/session";
import { ReportDetailView } from "@/components/report/ReportDetailView";
import { getFallbackReportDetail } from "@/lib/fallback-data";
import type { Metadata } from "next";

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ReportDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  let report = null;
  if (!isPlaceholderDb) {
    report = await getPublicReportDetail(id).catch(() => null);
  }
  if (!report) {
    report = getFallbackReportDetail(id);
  }

  if (!report) {
    return {
      title: "Laporan Tidak Ditemukan | TILARA",
    };
  }

  return {
    title: `${report.title} | TILARA`,
    description: `Kebutuhan kemanusiaan di ${report.region.name}, ${report.region.province}. Pantau selisih logistik dan salurkan bantuan secara transparan.`,
  };
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { id } = await params;
  const session = await getSession().catch(() => null);

  let report = null;
  let isDemoMode = false;

  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  if (!isPlaceholderDb) {
    report = await getPublicReportDetail(id, session).catch(() => null);
  }

  if (!report) {
    report = getFallbackReportDetail(id, session);
    if (report) {
      isDemoMode = true;
    }
  }

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} session={session} isDemoMode={isDemoMode} />;
}

