import type { Viewport } from "next";

// رنگ برندت رو اینجا بذار
const lightColorBrand = "#4a5a45";
const darkColorBrand = "#1e1e1e";

export const viewport: Viewport = {
  // اگه برای لایت/دارک میخوای یکی باشه، هر دو رو همون رنگ برند بذار
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: lightColorBrand },
    { media: "(prefers-color-scheme: dark)", color: darkColorBrand },
  ],
};

export default viewport;
