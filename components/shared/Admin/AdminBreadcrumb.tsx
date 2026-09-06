"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminRoutes } from "@/lib/constants";

// برچسب صفحات فرزند (جزئیات/ساخت) که خودشان در adminRoutes نیستند —
// چون آن آرایه فقط بخش‌های اصلی ساید‌بار را توصیف می‌کند
function getChildPageLabel(pathname: string): string | null {
  if (pathname === "/admin/products/new") return "افزودن محصول جدید";
  if (/^\/admin\/products\/[^/]+$/.test(pathname)) return "ویرایش محصول";
  if (/^\/admin\/orders\/order\/[^/]+$/.test(pathname)) return "جزئیات سفارش";
  return null;
}

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  if (pathname === "/admin") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>داشبورد</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // مشخص‌ترین (طولانی‌ترین) بخش از adminRoutes که با مسیر فعلی مطابقت دارد
  const matchedSection = [...adminRoutes]
    .filter((route) => route.href !== "/admin" && pathname.startsWith(route.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const childLabel = getChildPageLabel(pathname);
  // اگر یک صفحه‌ی فرزند شناخته‌شده باشیم، خودِ بخش اصلی دیگر صفحه‌ی جاری نیست (لینک است)
  const isChildPage = !!childLabel;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin">داشبورد</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {matchedSection && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isChildPage ? (
                <BreadcrumbLink asChild>
                  <Link href={matchedSection.href}>{matchedSection.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{matchedSection.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {childLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{childLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
