// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, publicRoutes, adminRoutes } from "./lib/routes";
import { sanitizeUrl } from "./lib/utils/urlUtils";

/**
 * Quick sanitizer + redirect rules for obviously invalid paths:
 *  - paths like "/&" or "/$" => redirect to "/"
 *  - trailing /& or /$ => strip and redirect
 *
 * Put this BEFORE auth checks to avoid unnecessary token reads.
 */
function handleBadPathRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname || "";

  // If path is exactly one or more of & or $ (e.g. "/&", "/$$")
  if (/^\/[&$]+$/.test(pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url, 301);
  }

  // If path ends with & or $ (e.g. "/something&" or "/something/$")
  if (/[&$]+$/.test(pathname)) {
    url.pathname = pathname.replace(/[&$]+$/g, "") || "/";
    // sanitize result
    url.pathname = sanitizeUrl(url.pathname);
    return NextResponse.redirect(url, 301);
  }

  return null;
}

export async function middleware(req: NextRequest) {
  // 1) quick bad-path redirect
  const badRedirect = handleBadPathRedirect(req);
  if (badRedirect) return badRedirect;

  // 2) continue with your auth logic
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isDev = process.env.NODE_ENV === "development";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: !isDev,
  });

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "admin";

  const matchesRoute = (pathname: string, routes: string[]) => {
    return routes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
  };

  const isPublic = matchesRoute(pathname, publicRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);
  const isAdminRoute = matchesRoute(pathname, adminRoutes);

  // ✅ مسیرهای عمومی → دسترسی آزاد
  if (isPublic) {
    return NextResponse.next();
  }

  // 🔒 مسیرهای ادمین فقط برای ادمین‌ها
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 🔄 مسیرهای احراز هویت برای کاربران لاگین‌نشده
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 🔐 مسیرهای محافظت‌شده برای کاربران لاگین‌نشده
  if (!isPublic && !isAuthRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|public|images|media|favicon.ico|robots.txt).*)",
  ],
};
