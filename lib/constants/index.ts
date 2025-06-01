import {
  User,
  Package,
  LogOut,
  LayoutDashboard,
  Boxes,
  Layers3,
  FolderKanban,
  Settings,
} from "lucide-react";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Anima-Home";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce store built with Next.js";

// static data
// user sidebar menu
export const menu = [
  { label: "اطلاعات حساب", icon: User, sectionId: "profile" },
  { label: "سفارش‌ها", icon: Package, sectionId: "orders" },
  { label: "خروج از حساب", icon: LogOut, sectionId: "logout" },
];

// categories items in categories menu
export const categories = [
  { name: "کمد", href: "/categories/کمد" },
  { name: "کابینت", href: "/categories/کابینت" },
  { name: "تی وی وال", href: "/categories/تی-وی-وال" },
  { name: "مارول شیت", href: "/categories/مارول-شیت" },
];

// admin routes
export const adminRoutes = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "محصولات", href: "/admin/products", icon: Boxes },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Layers3 },
  { label: "پروژه‌ها", href: "/admin/projects", icon: FolderKanban },
  { label: "تنظیمات", href: "/admin/settings", icon: Settings },
];
