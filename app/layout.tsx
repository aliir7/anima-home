import type { Metadata } from "next";
import Vazir from "next/font/local";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

const vazir = Vazir({
  src: "./fonts/Vazir.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s | Anima-Home`,
    default: APP_NAME,
  },
  description: `${APP_DESCRIPTION}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning={true}>
      <body className={`${vazir.className} antialiased`}>{children}</body>
    </html>
  );
}
