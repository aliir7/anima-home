import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col items-center justify-center text-center">
      <SearchX className="text-primary mb-4 h-16 w-16" />
      <h1 className="mb-2 text-4xl font-bold">۴۰۴ - صفحه پیدا نشد</h1>
      <p className="text-muted-foreground mb-6">
        صفحه‌ای که دنبال آن هستید وجود ندارد.
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-primary/80 rounded-full px-6 py-2 text-white transition"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
