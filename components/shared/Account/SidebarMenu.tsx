import Link from "next/link";

import { LogOut, Package, User } from "lucide-react";

const menu = [
  { label: "اطلاعات حساب", icon: <User />, sectionId: "profile" },
  { label: "سفارش‌ها", icon: <Package />, sectionId: "orders" },
  { label: "خروج از حساب", icon: <LogOut />, sectionId: "logout" },
];

function SidebarMenu() {
  return (
    <nav className="bg-muted sticky top-28 space-y-4 rounded-lg p-4">
      {menu.map((item, index) => (
        <Link
          key={index}
          href={`#${item.sectionId}`}
          className="hover:text-primary flex items-center gap-2 pb-4 text-sm transition dark:hover:text-neutral-300"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default SidebarMenu;
