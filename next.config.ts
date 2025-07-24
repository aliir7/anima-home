import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 📁 فایل‌های آپلودشده از دیسک لیارا قابل دسترسی باشن
  async rewrites() {
    return process.env.NODE_ENV === "production"
      ? [
          {
            source: "/uploads/:path*",
            destination: "/app/media/:path*", // مسیر فیزیکی روی mount لیارا
          },
        ]
      : [];
  },

  // 🎯 اجازه‌ی نمایش تصاویر از دامنه خودت
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anima-home.ir",
        port: "",
        pathname: "/**", // برای اطمینان از نمایش همه‌ی مسیرها
      },
    ],
  },
};

export default nextConfig;
