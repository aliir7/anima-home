import type { Metadata } from "next";
import Vazir from "next/font/local";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, ROOT_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/Toaster";

const vazir = Vazir({
  src: "./fonts/Vazir.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `آنیما هوم - %s`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "انیماهوم",
    "دکوراسیون داخلی",
    "کابینت",
    "کمد دیواری",
    "تی وی وال",
  ],
  applicationName: APP_NAME,
  metadataBase: new URL(ROOT_URL),
  openGraph: {
    title: {
      template: `آنیما هوم - %s`,
      default: APP_NAME,
    },
    description: `${APP_DESCRIPTION}`,
    url: `${ROOT_URL}`,
    siteName: APP_NAME,
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning={true}>
      <body className={`${vazir.className} scroll-smooth`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
