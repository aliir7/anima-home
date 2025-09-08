import Footer from "@/components/shared/Footer/Footer";
import Header from "@/components/shared/Header/Header";

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
