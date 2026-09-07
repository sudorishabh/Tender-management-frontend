import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasRoutePermission, getRoleDashboard } from "@/lib/auth/types";
import type { DbRole } from "@/lib/auth/types";

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/faq",
  "/terms-and-conditions",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
];

/**
 * Auth routes that should redirect authenticated users
 */
const AUTH_ROUTES = ["/sign-in", "/register", "/accept-invite"];

/**
 * Routes that match tender patterns (public)
 */
const isTenderRoute = (pathname: string): boolean => {
  return (
    /^\/tender\/[^/]+$/.test(pathname) ||
    /^\/tender\/buy\/[^/]+$/.test(pathname)
  );
};

/**
 * Check if route is public
 */
const isPublicRoute = (pathname: string): boolean => {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    isTenderRoute(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    !!pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2)$/)
  );
};

/**
 * Check if route is an auth page
 */
const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
};

/**
 * Check if route is a protected dashboard route
 */
const isDashboardRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/vendor") ||
    pathname.startsWith("/super")
  );
};

// Next.js 16: the proxy file replaces middleware.ts — same API, new file/function name.
export async function proxy(request: NextRequest) {
  // CVE-2025-29927 — Block the internal Next.js subrequest header.
  // An attacker can send this header to bypass all proxy-based auth checks.
  if (request.headers.get("x-middleware-subrequest")) {
    return new NextResponse(null, { status: 403 });
  }

  const { pathname } = request.nextUrl;

  // Skip proxy for static files, API routes, and Next.js internals
  if (isPublicRoute(pathname) && !isDashboardRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as DbRole | undefined;

  // Handle auth routes (sign-in, register, etc.)
  if (isAuthRoute(pathname)) {
    if (isAuthenticated && userRole) {
      // Redirect authenticated users to their dashboard
      const dashboardPath = getRoleDashboard(userRole);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.next();
  }

  // Handle dashboard routes
  if (isDashboardRoute(pathname)) {
    // Check authentication
    if (!isAuthenticated || !userRole) {
      const signInUrl = new URL("/sign-in", request.url);
      // Only allow safe relative paths (no protocol-relative or absolute URLs)
      if (pathname.startsWith("/") && !pathname.startsWith("//")) {
        signInUrl.searchParams.set("callbackUrl", pathname);
      }
      return NextResponse.redirect(signInUrl);
    }

    // Check role-based authorization
    if (!hasRoutePermission(userRole, pathname)) {
      // Redirect to user's appropriate dashboard
      const dashboardPath = getRoleDashboard(userRole);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    return NextResponse.next();
  }

  // Default: allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
