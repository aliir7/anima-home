"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { accountRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils/utils";
import { getStorageUrl } from "@/lib/utils/urlUtils";
import SignOutForm from "./SignOutForm";

type SidebarMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function SidebarMenu({ user }: SidebarMenuProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-muted sticky top-28 space-y-1 rounded-lg p-4">
      {/* خلاصه‌ی پروفایل بالای سایدبار */}
      <div className="mb-4 flex items-center gap-3 border-b pb-4 dark:border-neutral-700">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={getStorageUrl(user.image)}
            alt={user.name || "کاربر"}
          />
          <AvatarFallback className="text-primary dark:text-primaryDark">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium dark:text-neutral-100">
            {user.name || "کاربر"}
          </p>
          {user.email && (
            <p
              dir="ltr"
              className="text-muted-foreground truncate text-left text-xs"
            >
              {user.email}
            </p>
          )}
        </div>
      </div>

      {accountRoutes.map((item) => {
        const isActive =
          item.href === "/my-account"
            ? pathname === "/my-account"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-neutral-700 hover:bg-neutral-200/70 dark:text-neutral-300 dark:hover:bg-neutral-800",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-2 border-t pt-2 dark:border-neutral-700">
        <SignOutForm className="[&>button]:w-full [&>button]:justify-start [&>button]:px-3 [&>button]:text-neutral-700 dark:[&>button]:text-neutral-300" />
      </div>
    </nav>
  );
}

export default SidebarMenu;
