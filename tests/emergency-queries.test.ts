import { describe, it, expect } from "vitest";
import { getEmergencyContacts, FALLBACK_EMERGENCY_CONTACTS } from "@/lib/emergency-queries";

describe("Emergency Queries (/darurat)", () => {
  it("mengembalikan daftar kontak darurat lengkap dengan nomor nasional dan posko daerah", async () => {
    const contacts = await getEmergencyContacts();

    expect(contacts.length).toBeGreaterThanOrEqual(6);

    // Cek kontak darurat nasional esensial
    const numbers = contacts.map((c) => c.number);
    expect(numbers).toContain("117"); // BNPB
    expect(numbers).toContain("115"); // BASARNAS
    expect(numbers).toContain("112"); // Darurat Terpadu
    expect(numbers).toContain("119"); // Kemenkes Ambulans
    expect(numbers).toContain("110"); // Polisi
    expect(numbers).toContain("113"); // Damkar
  });

  it("memiliki struktur data valid dan scope sesuai ketentuan", () => {
    FALLBACK_EMERGENCY_CONTACTS.forEach((c) => {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.number).toBeTruthy();
      expect(["NASIONAL", "PROVINSI", "KABUPATEN"]).toContain(c.scope);
      expect(c.checkedAt).toBeInstanceOf(Date);
      if (c.scope !== "NASIONAL") {
        expect(c.regionName).toBeTruthy();
      }
    });
  });

  it("kontak berlingkup NASIONAL terverifikasi memiliki nomor pendek standar nasional", () => {
    const nationalContacts = FALLBACK_EMERGENCY_CONTACTS.filter((c) => c.scope === "NASIONAL");
    expect(nationalContacts.length).toBeGreaterThanOrEqual(6);
    nationalContacts.forEach((c) => {
      // Nomor darurat nasional berupa 3 digit angka (110, 112, 113, 115, 117, 119)
      expect(c.number).toMatch(/^[0-9]{3}$/);
    });
  });
});

