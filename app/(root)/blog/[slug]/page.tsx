import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 86400; // 1 day
export const metadata: Metadata = {
  title: "بلاگ",
  robots: {
    index: false,
    follow: false,
  },
};
// فرضی: دیتای ثابت (بعداً به API یا DB وصل میشه)
const BLOGS = [
  {
    slug: "design-tips",
    title: "۵ نکته برای طراحی داخلی خانه‌های کوچک",
    content: `
      فضای کوچک لزوماً محدود کننده نیست. با انتخاب هوشمندانه مبلمان چندکاره، استفاده از آینه‌ها، و رنگ‌های روشن می‌توان فضایی دلباز و کاربردی ایجاد کرد.
      در این مقاله به بررسی تکنیک‌هایی می‌پردازیم که طراحان داخلی حرفه‌ای برای خانه‌های کوچک استفاده می‌کنند.
    `,
    author: "آنیماهوم",
    date: "۲۰ اردیبهشت ۱۴۰۴",
    image: "/images/blog/1.jpg",
  },
  // ... مقالات دیگر
];

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

async function BlogPage({ params }: BlogPageProps) {
  const slug = (await params).slug;
  const post = BLOGS.find((item) => item.slug === slug);
  if (!post) {
    return notFound();
  }
  return (
    <section className="wrapper space-y-6 py-12">
      <h1 className="h1-bold text-primary">{post.title}</h1>

      <div className="text-muted-foreground flex gap-6 text-sm">
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {post.date}
        </span>
      </div>

      <div className="relative h-72 w-full overflow-hidden rounded-xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <article className="prose prose-p:leading-8 prose-p:text-foreground dark:prose-invert max-w-none">
        <p>{post.content}</p>
      </article>
    </section>
  );
}

export default BlogPage;
