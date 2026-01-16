import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
  ]
};
