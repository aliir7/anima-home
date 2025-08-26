import type { Viewport } from "next";

// رنگ برندت رو اینجا بذار
const lightColorBrand = "#4a5a45";
const darkColorBrand = "#1e1e1e";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: lightColorBrand },
    { media: "(prefers-color-scheme: dark)", color: darkColorBrand },
  ],
};
