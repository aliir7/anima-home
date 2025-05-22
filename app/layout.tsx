import type { Metadata } from "next";
import Vazir from "next/font/local";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const vazir = Vazir({
  src: "./fonts/Vazir.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s  - انیماهوم`,
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
      <body className={`${vazir.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster duration={5000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
