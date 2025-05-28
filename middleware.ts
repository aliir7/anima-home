import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, publicRoutes } from "./lib/routes";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { nextUrl } = req;
  const isLoggedIn = !!token;

  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.next();
  }

  if (!isPublic && !authRoutes) {
    return NextResponse.redirect(new URL("sign-in", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt).*)",
  ],
};
