import { describe, it, expect } from "vitest";
import { resolveSessionPassword, getSessionOptions } from "@/lib/session-options";
import { buildContentSecurityPolicy, getSecurityHeaders } from "@/lib/security-headers";

describe("Session Secret Configuration (session-options.ts)", () => {
  it("mengembalikan SESSION_SECRET jika tersedia dan panjang >= 32 karakter di production", () => {
    const validSecret = "a".repeat(32);
    const result = resolveSessionPassword({
      NODE_ENV: "production",
      SESSION_SECRET: validSecret,
    });
    expect(result).toBe(validSecret);

    const opts = getSessionOptions({
      NODE_ENV: "production",
      SESSION_SECRET: validSecret,
    });
    expect(opts.password).toBe(validSecret);
    expect(opts.cookieOptions?.secure).toBe(true);
    expect(opts.cookieOptions?.httpOnly).toBe(true);
    expect(opts.cookieOptions?.sameSite).toBe("lax");
  });

  it("melempar error eksplisit di production jika SESSION_SECRET tidak tersedia", () => {
    expect(() =>
      resolveSessionPassword({ NODE_ENV: "production" })
    ).toThrow(/SESSION_SECRET wajib dikonfigurasi/);

    expect(() =>
      resolveSessionPassword({ NODE_ENV: "production", SESSION_SECRET: "   " })
    ).toThrow(/SESSION_SECRET wajib dikonfigurasi/);
  });

  it("mengizinkan fallback non-production di development tanpa SESSION_SECRET", () => {
    const result = resolveSessionPassword({ NODE_ENV: "development" });
    expect(result.length).toBeGreaterThanOrEqual(32);
  });

  it("mengizinkan fallback non-production di test environment tanpa SESSION_SECRET", () => {
    const result = resolveSessionPassword({ NODE_ENV: "test" });
    expect(result.length).toBeGreaterThanOrEqual(32);
  });

  it("menolak SESSION_SECRET yang panjangnya kurang dari 32 karakter", () => {
    expect(() =>
      resolveSessionPassword({
        NODE_ENV: "production",
        SESSION_SECRET: "terlalu-pendek",
      })
    ).toThrow(/minimal 32 karakter/);

    expect(() =>
      resolveSessionPassword({
        NODE_ENV: "development",
        SESSION_SECRET: "short-secret",
      })
    ).toThrow(/minimal 32 karakter/);
  });
});

describe("HTTP Security Headers & CSP (security-headers.ts)", () => {
  it("menyertakan seluruh header keamanan wajib", () => {
    const headers = getSecurityHeaders(true);
    const map = Object.fromEntries(headers.map((h) => [h.key, h.value]));

    expect(map["X-Content-Type-Options"]).toBe("nosniff");
    expect(map["X-Frame-Options"]).toBe("DENY");
    expect(map["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(map["Content-Security-Policy"]).toBeDefined();
  });

  it("kebijakan CSP production mengizinkan tile OpenStreetMap dan menonaktifkan unsafe-eval", () => {
    const cspProd = buildContentSecurityPolicy(true);
    expect(cspProd).toContain("https://*.tile.openstreetmap.org");
    expect(cspProd).toContain("frame-ancestors 'none'");
    expect(cspProd).toContain("object-src 'none'");
    expect(cspProd).not.toContain("'unsafe-eval'");
  });

  it("kebijakan CSP development mengizinkan unsafe-eval dan websocket HMR", () => {
    const cspDev = buildContentSecurityPolicy(false);
    expect(cspDev).toContain("'unsafe-eval'");
    expect(cspDev).toContain("ws:");
  });
});
