import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, publicRoutes, adminRoutes } from "./lib/routes";
import { sanitizeUrl } from "./lib/utils/urlUtils";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname || "";

  // متغیری برای نگهداری پاسخ نهایی
  let response: NextResponse | null = null;

  // 1) Quick bad-path redirect
  if (/^\/[&$]+$/.test(pathname)) {
    url.pathname = "/";
    response = NextResponse.redirect(url, 301);
  } else if (/[&$]+$/.test(pathname)) {
    url.pathname = pathname.replace(/[&$]+$/g, "") || "/";
    url.pathname = sanitizeUrl(url.pathname);
    response = NextResponse.redirect(url, 301);
  }

  // 2) Optimistic Auth Check (فقط اگر تا الان ریدایرکتی تنظیم نشده باشد)
  //    توجه: این فقط "وجود کوکی سشن" را چک می‌کند، نه اعتبار واقعی آن و نه نقش کاربر.
  //    این چک صرفاً برای تجربه‌ی کاربری (ریدایرکت سریع، بدون Query دیتابیس در Edge) است.
  //    گیت امنیتی واقعی (از جمله چک نقش ادمین) در لایه‌ی سرور انجام می‌شود:
  //    - برای صفحات ادمین: requireAdmin() در app/admin/layout.tsx
  //    - برای صفحات خصوصی دیگر: getCurrentSession() در همان page/action
  if (!response) {
    const sessionCookie = getSessionCookie(req);
    const isLoggedIn = !!sessionCookie;

    const matchesRoute = (pathname: string, routes: string[]) => {
      return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      );
    };

    const isPublic = matchesRoute(pathname, publicRoutes);
    const isAuthRoute = matchesRoute(pathname, authRoutes);
    const isAdminRoute = matchesRoute(pathname, adminRoutes);

    if (isAdminRoute && !isLoggedIn) {
      // نقش ادمین را نمی‌توان اینجا چک کرد؛ کاربر واردنشده که مطمئناً ادمین نیست را رد می‌کنیم
      // و بررسی واقعی نقش را به requireAdmin() در admin/layout.tsx می‌سپاریم.
      response = NextResponse.redirect(new URL("/", req.nextUrl));
    } else if (isAuthRoute && isLoggedIn) {
      response = NextResponse.redirect(new URL("/", req.nextUrl));
    } else if (!isPublic && !isAuthRoute && !isAdminRoute && !isLoggedIn) {
      const signInUrl = new URL("/sign-in", req.nextUrl);
      signInUrl.searchParams.set("callbackUrl", pathname);
      response = NextResponse.redirect(signInUrl);
    } else {
      // اگر مشکلی نبود، اجازه عبور بده
      response = NextResponse.next();
    }
  }

  // 3) Set Session Cart ID Cookie on the FINAL response
  // حالا چه ریدایرکت شده باشد چه نشده باشد، کوکی را روی پاسخ نهایی ست می‌کنیم
  const hasSessionCartId = req.cookies.has("sessionCartId");
  if (!hasSessionCartId) {
    response.cookies.set("sessionCartId", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|public|images|media|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
