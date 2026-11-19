import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Menentukan apakah seorang relawan berstatus 'Terpercaya' (Trusted Volunteer).
 * Syarat:
 * 1. Bendera akun 'isVerifiedVolunteer' bernilai true, ATAU
 * 2. Memiliki minimal 1 laporan berstatus VERIFIED, ATAU
 * 3. Memiliki minimal 1 catatan bantuan berstatus CONFIRMED sebelumnya.
 */
export async function isTrustedVolunteer(
  userId: string,
  tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<boolean> {
  if (!userId || typeof userId !== "string") {
    return false;
  }

  const db = tx ?? prisma;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      isVerifiedVolunteer: true,
      _count: {
        select: {
          reports: { where: { status: "VERIFIED" } },
          aids: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  if (!user) {
    return false;
  }

  if (user.isVerifiedVolunteer) {
    return true;
  }

  return user._count.reports + user._count.aids > 0;
}
