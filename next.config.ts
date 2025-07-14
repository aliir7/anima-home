import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // for allow upload files
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/app/uploads/:path*", // مسیر فیزیکی روی دیسک mount شده
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anima-home.ir",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
