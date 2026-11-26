import { getDashboardData, getRoleWorkspaceData } from "@/lib/dashboard-queries";
import { getSession } from "@/lib/session";
import { PublicDashboardView } from "@/components/dashboard/PublicDashboardView";
import { RoleWorkspacePanel } from "@/components/dashboard/RoleWorkspacePanel";
import { Navbar } from "@/components/common/Navbar";
import { FloatingEmergencyButton } from "@/components/common/FloatingEmergencyButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Statistik Agregat Kemanusiaan | TILARA",
  description:
    "Statistik selisih kebutuhan vs bantuan kemanusiaan terkonfirmasi nasional, rekapitulasi logistik, dan pemetaan wilayah prioritas darurat.",
  robots: { index: true, follow: true },
};

export default async function DashboardPage() {
  const [dashboardData, session] = await Promise.all([
    getDashboardData(),
    getSession().catch(() => null),
  ]);

  const isLoggedIn = Boolean(session && session.userId);
  const workspaceData =
    isLoggedIn && session ? await getRoleWorkspaceData(session) : null;

  return (
    <div className="relative min-h-screen bg-[var(--color-bg-base)] flex flex-col">
      <Navbar session={session} />
      <main id="main-content" className="pt-14 flex-1">
        {workspaceData && session && (
          <RoleWorkspacePanel
            workspace={workspaceData}
            userName={session.name || "Pengguna"}
            regionPriorities={dashboardData.regionPriorities}
          />
        )}
        <PublicDashboardView data={dashboardData} />
      </main>
      <FloatingEmergencyButton />
    </div>
  );
}

