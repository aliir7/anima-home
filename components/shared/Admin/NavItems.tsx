"use client";
import { useState } from "react";
import { adminRoutes } from "@/lib/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function NavItems() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col">
      {adminRoutes.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            href={item.href}
            key={item.label}
            onClick={() => setIsOpen(false)}
            className={cn(
              "hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
              isActive || isOpen
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <Separator className="mt-4" />
      <Link
        className="hover:bg-muted my-4 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all"
        href="/"
      >
        <ArrowRight className="h-4 w-4" />
        <span>بازگشت به صفحه اصلی</span>
      </Link>
    </nav>
  );
}

export default NavItems;
