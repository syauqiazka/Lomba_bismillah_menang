import "server-only";
import { prisma } from "@/lib/prisma";
import { FALLBACK_REGIONS, type RegionOption } from "@/lib/fallback-data";

export type { RegionOption };

/**
 * Mengambil daftar seluruh master wilayah administratif.
 */
export async function getAvailableRegions(): Promise<RegionOption[]> {
  const isPlaceholderDb =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("ep-sample");

  if (!isPlaceholderDb) {
    try {
      const dbRegions = await prisma.region.findMany({
        select: {
          id: true,
          name: true,
          province: true,
          city: true,
          latitude: true,
          longitude: true,
        },
        orderBy: { name: "asc" },
      });
      if (dbRegions.length > 0) {
        return dbRegions;
      }
    } catch (err) {
      console.warn("Gagal mengambil wilayah dari database, menggunakan fallback:", err);
    }
  }

  return FALLBACK_REGIONS;
}
