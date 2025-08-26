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
export const ROOT_URL = "https://anima-home.ir";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "انیما هوم؛ طراحی و اجرای تخصصی دکوراسیون داخلی، کمد، کابینت و تی‌وی‌وال با متریال روز و کیفیت بالا.";

export const PAGE_SIZE = 6;

// static data
// user sidebar menu
export const menu = [
  { label: "اطلاعات حساب", icon: User, sectionLink: "profile" },
  { label: "سفارش‌ها", icon: Package, sectionLink: "/my-account/orders" },
  { label: "خروج از حساب", icon: LogOut, sectionLink: "logout" },
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
    description: "بررسی نمونه‌کارهای اجراشده توسط تیم ما",
    btnText: "برو بریم",
    href: "/projects",
  },
  {
    icon: BookImage,
    title: "متریال",
    description: "مشاهده کاتالوگ و سمپل رنگ‌های MDF، صفحه کابینت و بین‌کابینتی",
    btnText: "برو بریم",
    href: "/materials",
  },
  {
    icon: ShoppingBag,
    title: "محصولات",
    description: "مدل‌های آماده‌ای که می‌تونن برای فضای شما سفارشی بشن",
    btnText: "برو بریم",
    href: "/products",
  },
  {
    icon: Drill,
    title: "یراق‌آلات",
    description: "انتخاب و سفارش انواع یراق‌آلات مخصوص کابینت و دکوراسیون",
    btnText: "برو بریم",
    href: "/tools",
  },
];

// admin routes
export const adminRoutes = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "پروژه‌ها", href: "/admin/projects", icon: FolderKanban },
  { label: "متریال", href: "/admin/materials", icon: BookImage },
  { label: "یراق آلات", href: "/admin/tools", icon: Drill },
  { label: "محصولات", href: "/admin/products", icon: Boxes },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Layers3 },
  { label: "تنظیمات", href: "/admin/settings", icon: Settings },
];
