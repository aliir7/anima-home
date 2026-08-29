import type { NextConfig } from "next";

// دامنه‌های واقعی که این پروژه ازشون عکس/فایل لود می‌کنه — دقیقاً همون‌هایی
// که در images.remotePatterns پایین‌تر هم تعریف شدن
const STORAGE_ORIGINS = [
  "https://anima-home.storage.c2.liara.space",
  "https://anima-bucket.hot.ir-central1.arvanstorage.ir",
  "https://anima-home.ir",
  "https://trustseal.enamad.ir",
].join(" ");

// یک CSP پایه که واقعاً با چیزهایی که این اپ استفاده می‌کنه سازگاره:
// - 'unsafe-inline' روی script لازمه چون SchemaScript.tsx یک JSON-LD
//   inline رندر می‌کنه (بدون nonce-based CSP که پیچیدگی اضافه می‌آورد)
// - connect-src به درگاه زیبال برای فلوی پرداخت نیاز داره
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: ${STORAGE_ORIGINS};
  font-src 'self' data:;
  connect-src 'self' https://gateway.zibal.ir;
  form-action 'self' https://gateway.zibal.ir;
  frame-ancestors 'self';
  object-src 'none';
  base-uri 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=15768000; includeSubDomains",
  },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
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
