import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, publicRoutes, adminRoutes } from "./lib/routes";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { nextUrl } = req;
  const isLoggedIn = !!token;
  const isAdmin = token?.role === "admin";

  const pathname = nextUrl.pathname;

  const isPublic = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.includes(pathname);

  // اگر مسیر عمومی است، بدون نیاز به چک اجازه بده
  if (isPublic) {
    return NextResponse.next();
  }

  // اگر مسیر ادمین است ولی کاربر ادمین نیست => ریدایرکت به صفحه اصلی
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // اگر مسیر مربوط به ورود/ثبت نام است و کاربر لاگین کرده => اجازه دسترسی
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl)); // معمولاً کاربر لاگین شده نباید دوباره وارد صفحه ورود بشه
  }

  // اگر مسیر غیر عمومی و کاربر لاگین نیست => ریدایرکت به صفحه ورود
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  // بقیه موارد اجازه ادامه دارند
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt).*)",
  ],
};
