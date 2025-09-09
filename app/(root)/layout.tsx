import Footer from "@/components/shared/Footer/Footer";
import Header from "@/components/shared/Header/Header";
import { APP_DESCRIPTION } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  description:
    `${APP_DESCRIPTION}` ||
    "انیما هوم؛ طراحی و اجرای تخصصی دکوراسیون داخلی، کمد، کابینت و تی‌وی‌وال با متریال روز و کیفیت بالا.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto px-4" aria-label="محتوای اصلی">
        {children}
      </main>
      <Footer />
    </div>
  );
}
