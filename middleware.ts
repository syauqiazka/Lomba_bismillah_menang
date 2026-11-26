import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session-options";
import { evaluateRouteAccess } from "@/lib/access";
import { getSecurityHeaders } from "@/lib/security-headers";

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const { key, value } of getSecurityHeaders()) {
    res.headers.set(key, value);
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  const evaluation = evaluateRouteAccess(request.nextUrl.pathname, session);

  if (!evaluation.allowed) {
    if (evaluation.redirectUrl) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(evaluation.redirectUrl, request.url))
      );
    }
    if (evaluation.isForbidden) {
      return applySecurityHeaders(
        new NextResponse(
          "Akses Ditolak (403): Akun Anda tidak memiliki izin untuk mengakses modul ini.",
          {
            status: 403,
            headers: { "content-type": "text/plain; charset=utf-8" },
          }
        )
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/lapor/:path*",
    "/antrean/:path*",
    "/verifikasi/:path*",
    "/kebutuhan/:path*",
    "/distribusi/:path*",
    "/admin/:path*",
  ],
};
