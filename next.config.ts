import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
