// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = "https://anima-home.ir";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/admin/*",
          "/sign-in",
          "/sign-up",
          "/reset-password",
          "/forgot-password",
          "/my-account",
          "/my-account/*",
          // دفاع اضافی علیه URLهای عجیب
        ],
      },
    ],
    sitemap: `https://anima-home.ir/sitemap.xml`,
    host,
  };
}
