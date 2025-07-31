import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, publicRoutes, adminRoutes } from "./lib/routes";

export async function middleware(req: NextRequest) {
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
