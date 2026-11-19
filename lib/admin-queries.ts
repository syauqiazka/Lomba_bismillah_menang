import "server-only";
import { prisma } from "@/lib/prisma";
import { canAdmin } from "@/lib/access";
import type { SessionData } from "@/lib/session-options";

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "VERIFIKATOR" | "RELAWAN";
  isVerifiedVolunteer: boolean;
  reportsCount: number;
  aidsCount: number;
  createdAt: Date;
}

export interface AdminOrgData {
  id: string;
  name: string;
  type: string;
  isVerified: boolean;
  verifiedAt: Date | null;
  membersCount: number;
}

export interface AdminDashboardData {
  users: AdminUserData[];
  organizations: AdminOrgData[];
  systemStats: {
    totalUsers: number;
    totalReports: number;
    totalVerifiedReports: number;
    totalOrganizations: number;
  };
}

const FALLBACK_ADMIN_DATA: AdminDashboardData = {
  users: [
    {
      id: "usr-admin",
      name: "Administrator Sistem Trasec",
      email: "admin@trasec.id",
      phone: "08110000001",
      role: "ADMIN",
      isVerifiedVolunteer: true,
      reportsCount: 0,
      aidsCount: 0,
      createdAt: new Date("2026-11-01T00:00:00Z"),
    },
    {
      id: "usr-verif-komunitas",
      name: "Budi Santoso",
      email: "verifikator.komunitas@trasec.id",
      phone: "08110000002",
      role: "VERIFIKATOR",
      isVerifiedVolunteer: true,
      reportsCount: 2,
      aidsCount: 0,
      createdAt: new Date("2026-11-05T00:00:00Z"),
    },
    {
      id: "usr-verif-pmi",
      name: "Siti Rahma",
      email: "pmi.verifikator@trasec.id",
      phone: "08110000003",
      role: "VERIFIKATOR",
      isVerifiedVolunteer: true,
      reportsCount: 1,
      aidsCount: 0,
      createdAt: new Date("2026-11-08T00:00:00Z"),
    },
    {
      id: "usr-dewi-relawan",
      name: "Dewi Kartika",
      email: "dewi.relawan@trasec.id",
      phone: "08110000004",
      role: "RELAWAN",
      isVerifiedVolunteer: true,
      reportsCount: 3,
      aidsCount: 4,
      createdAt: new Date("2026-11-10T00:00:00Z"),
    },
    {
      id: "usr-relawan-baru",
      name: "Ahmad Rizki",
      email: "ahmad.relawan@trasec.id",
      phone: "08110000005",
      role: "RELAWAN",
      isVerifiedVolunteer: false,
      reportsCount: 1,
      aidsCount: 1,
      createdAt: new Date("2026-11-18T00:00:00Z"),
    },
  ],
  organizations: [
    {
      id: "org-pmi-jabar",
      name: "Palang Merah Indonesia (PMI) Wilayah Jawa Barat",
      type: "LEMBAGA_KEMANUSIAAN",
      isVerified: true,
      verifiedAt: new Date("2026-11-12T00:00:00Z"),
      membersCount: 4,
    },
    {
      id: "org-act-relawan",
      name: "Komunitas Relawan Siaga Banjir Pantura",
      type: "KOMUNITAS_LOKAL",
      isVerified: false,
      verifiedAt: null,
      membersCount: 2,
    },
  ],
  systemStats: {
    totalUsers: 5,
    totalReports: 7,
    totalVerifiedReports: 4,
    totalOrganizations: 2,
  },
};

/**
 * Mengambil data komprehensif untuk modul Panel Admin (/admin).
 */
export async function getAdminDashboardData(
  session?: SessionData | null
): Promise<AdminDashboardData | null> {
  if (!canAdmin(session)) {
    return null;
  }

  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example") ||
    dbUrl.includes("localhost:5432/trasec_dev");

  if (isPlaceholderDb) {
    return FALLBACK_ADMIN_DATA;
  }

  try {
    const [users, orgs, totalReports, totalVerifiedReports] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerifiedVolunteer: true,
          createdAt: true,
          _count: {
            select: {
              reports: true,
              aids: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.organization.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          isVerified: true,
          verifiedAt: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.count(),
      prisma.report.count({ where: { status: "VERIFIED" } }),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isVerifiedVolunteer: u.isVerifiedVolunteer,
        reportsCount: u._count.reports,
        aidsCount: u._count.aids,
        createdAt: u.createdAt,
      })),
      organizations: orgs.map((o) => ({
        id: o.id,
        name: o.name,
        type: o.type,
        isVerified: o.isVerified,
        verifiedAt: o.verifiedAt,
        membersCount: o._count.members,
      })),
      systemStats: {
        totalUsers: users.length,
        totalReports,
        totalVerifiedReports,
        totalOrganizations: orgs.length,
      },
    };
  } catch (err) {
    console.warn("Gagal mengambil data admin dari DB, menggunakan data demonstrasi:", err);
    return FALLBACK_ADMIN_DATA;
  }
}

