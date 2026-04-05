import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthApi = pathname.startsWith("/api/auth");
  const isPublicPage =
    pathname === "/" ||
    pathname === "/results" ||
    pathname === "/auth/verify";
  const isLoginPage = pathname === "/login";

  // Always allow auth API routes
  if (isAuthApi) return NextResponse.next();

  // Public pages: always accessible
  if (isPublicPage) return NextResponse.next();

  // Login page: redirect to admin if already authenticated
  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Admin routes: require authentication
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
