import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 80, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anima-home.storage.c2.liara.space",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "anima-bucket.hot.ir-central1.arvanstorage.ir",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "anima-home.ir",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "trustseal.enamad.ir",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
