"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ListOrdered,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/admin", label: "داشبورد", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/products", label: "محصولات", icon: <Package size={18} /> },
  {
    href: "/admin/categories",
    label: "دسته‌بندی‌ها",
    icon: <Layers size={18} />,
  },
  {
    href: "/admin/gallery",
    label: "گالری پروژه‌ها",
    icon: <Image width={18} height={18} alt="gallery" src={""} />,
  },
  { href: "/admin/orders", label: "سفارش‌ها", icon: <ListOrdered size={18} /> },
  { href: "/admin/settings", label: "تنظیمات", icon: <Settings size={18} /> },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-muted text-foreground hidden w-64 border-r px-4 py-6 md:block">
      <nav className="flex flex-col gap-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "hover:bg-primary/10 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
              pathname === item.href && "bg-primary/10 text-primary",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <form action="/api/auth/signout" method="post" className="mt-10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm"
          >
            <LogOut size={18} />
            خروج
          </Button>
        </form>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
