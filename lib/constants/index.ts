import {
  User,
  Package,
  LogOut,
  LayoutDashboard,
  Boxes,
  Layers3,
  FolderCheck,
  ShoppingBag,
  Drill,
  BookImage,
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
  { id: "1", name: "کمد", href: "/categories/comod" },
  { id: "2", name: "کابینت", href: "/categories/cabinet" },
  { id: "3", name: "تی وی وال", href: "/categories/تی-وی-وال" },
  { id: "4", name: "مارول شیت", href: "/categories/marvel" },
];

// services in app
export const services = [
  {
    icon: FolderCheck,
    title: "نمونه کارها",
    description:
      "در این بخش می‌توانید نمونه کارها و پروژه‌های اجرا شده را مشاهده کنید",
    btnText: "برو بریم",
    href: "/projects",
  },
  {
    icon: ShoppingBag,
    title: "محصولات",
    description: "تمام محصولات دارای گارانتی اصالت و سلامت فیزیکی هستند",
    btnText: "برو بریم",
    href: "/products",
  },
  {
    icon: Drill,
    title: "ابزارآلات و یراق",
    description: "ابزارآلات و یراق خود را از ما بخواهید",
    btnText: "برو بریم",
    href: "/tools",
  },
  {
    icon: BookImage,
    title: "متریال",
    description: "متریال مورد نظرتان را انتخاب کنید",
    btnText: "برو بریم",
    href: "/materials",
  },
];

// admin routes
export const adminRoutes = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "محصولات", href: "/admin/products", icon: Boxes },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Layers3 },
  { label: "پروژه‌ها", href: "/admin/projects", icon: FolderKanban },
  { label: "تنظیمات", href: "/admin/settings", icon: Settings },
];
