import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = "https://anima-home.ir"; // دامنه

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // مسیرهایی که نباید ایندکس شوند:
      {
        userAgent: "*",
        disallow: [
          "/admin",
          "/admin/*",
          "/signin",
          "/signup",
          "/reset-password",
          "/forgot-password",
          "/my-account",
          "/my-account/*",
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
