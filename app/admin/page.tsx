import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { canAdmin } from "@/lib/access";
import { getAdminDashboardData } from "@/lib/admin-queries";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel Administrator Sistem | TRASEC",
  description: "Manajemen peran pengguna, master data, dan verifikasi lembaga kemanusiaan.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession().catch(() => null);

  // 1. Anonim diredirect ke login
  if (!session || !session.userId) {
    redirect("/login?next=/admin");
  }

  // 2. Akses ditolak jika peran pengguna bukan ADMIN
  if (!canAdmin(session)) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] flex items-center justify-center mb-4">
          <span className="text-xl font-bold">403</span>
        </div>
        <h1 className="text-lg font-bold text-[var(--color-text-main)] mb-2">
          Akses Ditolak (403 Forbidden)
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mb-6">
          Modul ini khusus untuk peran <strong>ADMIN</strong>. Akun Anda terdaftar sebagai <strong>{session.role}</strong>.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-md bg-[var(--color-forest-main)] text-white text-xs font-bold hover:bg-[var(--color-forest-dark)] transition-colors"
        >
          Kembali ke Peta Beranda
        </Link>
      </div>
    );
  }

  const adminData = await getAdminDashboardData(session);

  if (!adminData) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] flex flex-col">
      <Navbar session={session} />
      <div className="pt-14 flex-1">
        <AdminDashboardView initialData={adminData} />
      </div>
      <FloatingEmergencyButton />
    </div>
  );
}

