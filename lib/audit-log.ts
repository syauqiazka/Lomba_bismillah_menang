import "server-only";

export interface AuditLogEntry {
  actorId: string;
  actorRole: string;
  action: "ROLE_CHANGE" | "ORG_VERIFY" | "REPORT_REVIEW" | "AID_REVIEW";
  targetId: string;
  fromState: string;
  toState: string;
  reason: string;
  timestamp: string;
}

/**
 * Mencatat perubahan status penting (perubahan role, verifikasi, konfirmasi bantuan)
 * secara terstruktur di server untuk jejak audit.
 * Catatan: Untuk penyimpanan permanen lintas restart di DB, tabel AuditLog aditif
 * dapat ditambahkan pada migrasi Prisma berikutnya.
 */
export function recordServerAuditLog(entry: Omit<AuditLogEntry, "timestamp">): AuditLogEntry {
  const fullEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };
  console.info("[TRASEC_AUDIT]", JSON.stringify(fullEntry));
  return fullEntry;
}

