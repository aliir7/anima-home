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
    title: "پروژه ها",
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

// plans for packages
export const plans = [
  {
    title: "طرح نوسازی کابینت",

    description:
      "پکیج اقتصادی کابینت برای کسانی طراحی شده که می‌خواهند بدون هزینه سنگین، آشپزخونه‌خودشون رو نو و کاربردی کنن. و یا برای خانواده‌هایی که بودجه محدودی دارند، و برای مستأجرها و زوج‌های جوان، یا حتی کسانی که قبل از فروش و اجاره خونه دنبال تغییر سریع هستند؛ این طرح بهترین انتخابه.",
    features: [
      "تعمیرات کابینت",
      "تعویض یراق‌آلات",
      "تعویض صفحه کابینت",
      "مقاوم‌سازی پایه و اتصالات",
      "تعویض درب و نماهای قدیمی",
      "ایجاد فضا برای تجهیزات جدید",
    ],
    popular: true,
  },
  // {
  //   title: "پکیج استاندارد",
  //   price: "12,900,000 تومان",
  //   description: "بهترین تعادل بین قیمت و کیفیت",
  //   features: [
  //     "تعویض درب‌های کابینت",
  //     "صفحه کابینت مقاوم‌تر",
  //     "مقاوم‌سازی کامل اتصالات",
  //     "گارانتی 12 ماهه خدمات",
  //   ],
  //   popular: true,
  // },
  // {
  //   title: "پکیج لوکس",
  //   price: "25,000,000 تومان",
  //   description: "ویژه کسانی که بهترین‌ها را می‌خواهند",
  //   features: [
  //     "صفحه کابینت سنگ مصنوعی",
  //     "یراق‌آلات برند اروپایی",
  //     "طراحی اختصاصی",
  //     "اجرای تمیز توسط استادکاران حرفه‌ای",
  //   ],
  //   popular: false,
  // },
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
