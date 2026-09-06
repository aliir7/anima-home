"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// فقط همین صفحات واقعاً از پارامتر query پشتیبانی می‌کنند (سمت سرور
// getAllOrders/getAllUsers/getAllProducts/getAllCoupons همگی این پارامتر
// را می‌خوانند). صفحات دیگر (متریال، پروژه‌ها، دسته‌بندی‌ها، ابزارها،
// تنظیمات، داشبورد) فعلاً جستجو ندارند — به‌جای نمایش یک باکس جستجوی
// گمراه‌کننده که یا هیچ کاری نمی‌کند یا به صفحه‌ی اشتباهی می‌رود، روی
// آن صفحات اصلاً چیزی رندر نمی‌کنیم.
const SEARCHABLE_ADMIN_ROUTES = [
  "/admin/orders",
  "/admin/users",
  "/admin/products",
  "/admin/coupons",
  "/admin/materials",
  "/admin/projects",
];

function AdminSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  // فقط دقیقاً همان صفحات لیست (نه صفحات جزئیات/ساخت زیرمجموعه‌شان)
  const isSearchable = SEARCHABLE_ADMIN_ROUTES.includes(pathname);

  if (!isSearchable) return null;

  return (
    <form action={pathname} method="GET">
      <Input
        type="search"
        placeholder="جستجو..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="outline-light dark:outline-dark rounded-full placeholder:text-xs md:w-25 lg:w-75"
      />
      <button className="sr-only" type="submit">
        جست و جو
      </button>
    </form>
  );
}

export default AdminSearch;
