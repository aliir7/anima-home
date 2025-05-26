import { Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export const POSTS = [
  {
    id: 1,
    title: "۵ نکته برای طراحی داخلی خانه‌های کوچک",
    summary:
      "فضای کم به معنی محدودیت نیست! با این تکنیک‌ها خانه‌ی کوچک خود را دلبازتر کنید.",
    image: "/images/blog/1.jpg",
    author: "آنیماهوم",
    date: "۲۰ اردیبهشت ۱۴۰۴",
    href: "/blog/design-tips",
  },
  {
    id: 2,
    title: "چگونه رنگ مناسب برای دیوار انتخاب کنیم؟",
    summary:
      "در این مقاله از اصول روان‌شناسی رنگ‌ها برای انتخاب بهتر استفاده کرده‌ایم.",
    image: "/images/blog/2.jpg",
    author: "زهرا محمدی",
    date: "۱۸ اردیبهشت ۱۴۰۴",
    href: "/blog/color-selection",
  },
  {
    id: 3,
    title: "تفاوت طراحی مدرن و کلاسیک چیست؟",
    summary: "اگر بین طراحی مدرن و کلاسیک شک دارید، این مطلب را از دست ندهید.",
    image: "/images/blog/3.jpg",
    author: "آنیماهوم",
    date: "۱۵ اردیبهشت ۱۴۰۴",
    href: "/blog/classic-vs-modern",
  },
];

function BlogSection() {
  return (
    <section className="bg-background rounded-lg px-6 py-16">
      <div className="wrapper">
        <h2 className="h2-bold text-primary mb-12 text-center">
          جدیدترین مقالات
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-muted flex flex-col justify-between overflow-hidden rounded-xl border shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="h3-bold mb-6 dark:text-neutral-200">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-4 text-sm">
                    {post.summary}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                  </div>
                  <Link href={post.href}>
                    <Button
                      variant="default"
                      className="bg-primary mt-8 mb-10 w-full cursor-pointer rounded-full px-4 text-white dark:text-neutral-800"
                    >
                      مطالعه بیشتر
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
