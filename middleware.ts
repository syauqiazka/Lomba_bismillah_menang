import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session-options";
import { evaluateRouteAccess } from "@/lib/access";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  const evaluation = evaluateRouteAccess(request.nextUrl.pathname, session);

  if (!evaluation.allowed) {
    if (evaluation.redirectUrl) {
      return NextResponse.redirect(new URL(evaluation.redirectUrl, request.url));
    }
    if (evaluation.isForbidden) {
      return new NextResponse(
        "Akses Ditolak (403): Akun Anda tidak memiliki izin untuk mengakses modul ini.",
        {
          status: 403,
          headers: { "content-type": "text/plain; charset=utf-8" },
        }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/lapor/:path*", "/verifikasi/:path*", "/admin/:path*"],
};
