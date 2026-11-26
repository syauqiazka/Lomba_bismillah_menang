import "server-only";
import { prisma } from "@/lib/prisma";

const memoryBucket = new Map<string, { count: number; expiresAt: number }>();

/**
 * Pembatas frekuensi pengiriman (rate limit) berbasis RateLimitRecord di PostgreSQL
 * dengan fallback memori lokal saat mode demonstrasi tanpa database aktif.
 */
export async function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 10 * 60 * 1000
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const dbUrl = process.env.DATABASE_URL || "";
  const isPlaceholderDb =
    !dbUrl ||
    dbUrl.includes("ep-sample") ||
    dbUrl.includes("placeholder") ||
    dbUrl.includes("ep-example");

  if (isPlaceholderDb) {
    const entry = memoryBucket.get(key);
    if (!entry || entry.expiresAt <= now) {
      memoryBucket.set(key, { count: 1, expiresAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    entry.count += 1;
    return { allowed: true, remaining: maxRequests - entry.count };
  }

  try {
    const existing = await prisma.rateLimitRecord.findUnique({ where: { key } });
    if (!existing || existing.expiresAt.getTime() <= now) {
      await prisma.rateLimitRecord.upsert({
        where: { key },
        create: { key, count: 1, expiresAt: new Date(now + windowMs) },
        update: { count: 1, expiresAt: new Date(now + windowMs) },
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    const updated = await prisma.rateLimitRecord.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return { allowed: true, remaining: Math.max(0, maxRequests - updated.count) };
  } catch {
    return { allowed: true, remaining: maxRequests };
  }
}

