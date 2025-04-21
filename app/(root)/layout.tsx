import BannerCarousel from "@/components/shared/BannerCarousel";
import Header from "@/components/shared/Header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
}
