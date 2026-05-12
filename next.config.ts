import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
        hostname: "anima-home.storage.c2.liara.site",
        port: "",
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
