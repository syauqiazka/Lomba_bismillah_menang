import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Tooling Sanity Check", () => {
  it("harus menjalankan runner Vitest secara sukses", () => {
    expect(1 + 1).toBe(2);
  });

  it("harus menjalankan validasi skema Zod secara benar", () => {
    const TestSchema = z.object({
      name: z.string().min(1),
      status: z.enum(["PENDING", "VERIFIED"]),
    });

    const validData = { name: "Posko Uji Coba", status: "VERIFIED" };
    expect(TestSchema.safeParse(validData).success).toBe(true);

    const invalidData = { name: "", status: "UNKNOWN" };
    expect(TestSchema.safeParse(invalidData).success).toBe(false);
  });
});

