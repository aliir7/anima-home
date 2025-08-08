import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anima-home.storage.c2.liara.space",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "anima-home.ir",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
