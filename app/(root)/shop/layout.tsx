import Footer from "@/components/shared/Footer/Footer";
import ShopHeader from "@/components/shared/Shop/ShopHeader";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeader />

      <main className="container mx-auto px-4" aria-label="محتوای اصلی">
        {children}
      </main>
      <Footer />
    </div>
  );
}
