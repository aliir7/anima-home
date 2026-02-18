"use client";

import { usePathname } from "next/navigation";
import { adminRoutes } from "@/lib/constants";
import { NavMain } from "@/components/nav-main";

export function AdminNavItems() {
  const pathname = usePathname();

  const items = adminRoutes.map((route) => {
    const isActive =
      route.href === "/admin"
        ? pathname === "/admin"
        : pathname === route.href || pathname.startsWith(route.href + "/");

    return {
      title: route.label,
      url: route.href,
      icon: route.icon,
      isActive,
    };
  });

  return <NavMain items={items} />;
}
