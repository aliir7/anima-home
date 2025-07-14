import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, publicRoutes, adminRoutes } from "./lib/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: true,
  });

  // console.log("🍪 TOKEN IN PROD:", token?.role);
  // console.log("📍 PATH:", pathname);

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "admin";

  const isPublic = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.includes(pathname);

  if (isPublic) {
    return NextResponse.next();
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (!isPublic && !isAuthRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt).*)",
  ],
};
