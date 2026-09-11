import Link from "next/link";
import { ChevronLeft, Mail, MapPin, Smartphone } from "lucide-react";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserById } from "@/lib/actions/user.actions";
import { getCurrentSession } from "@/lib/auth/authGuard";
import { ShippingAddress } from "@/types";

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge className="border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
      تایید شده
    </Badge>
  ) : (
    <Badge className="border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
      تایید نشده
    </Badge>
  );
}

function AccountRow({
  icon: Icon,
  label,
  value,
  badge,
  href,
  actionLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: React.ReactNode;
  href: string;
  actionLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
          <Icon className="text-primary dark:text-primaryDark h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">{label}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              dir="ltr"
              className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100"
            >
              {value}
            </span>
            {badge}
          </div>
        </div>
      </div>

      <Link
        href={href}
        className="text-primary hover:text-primary/80 dark:text-primaryDark flex shrink-0 items-center gap-1 text-sm whitespace-nowrap"
      >
        {actionLabel}
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}

async function UserDetails() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById();

  if (!user) {
    redirect("/");
  }

  const address = user.address as ShippingAddress | null;

  return (
    <section id="profile" className="space-y-4">
      {/* هدر پروفایل */}
      <div className="flex items-center gap-4 rounded-lg border bg-white p-4 dark:bg-neutral-900">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={user.image?.at(0) || ""}
            alt={user.name || "کاربر"}
          />
          <AvatarFallback className="text-primary dark:text-primaryDark text-xl">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="h3-bold text-primary truncate dark:text-neutral-100">
            {user.name ?? "کاربر انیما هوم"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {user.role === "admin" ? "مدیر" : "کاربر"}
          </p>
        </div>

        <Link
          href="/my-account/avatar"
          className="text-primary hover:text-primary/80 dark:text-primaryDark text-sm whitespace-nowrap"
        >
          تغییر عکس
        </Link>
      </div>

      {/* وضعیت اطلاعات حساب */}
      <div className="divide-y rounded-lg border bg-white px-4 dark:divide-neutral-800 dark:bg-neutral-900">
        <AccountRow
          icon={Mail}
          label="ایمیل"
          value={user.email ?? "ثبت نشده"}
          badge={<VerifiedBadge verified={!!user.emailVerified} />}
          href="/my-account/email"
          actionLabel="مدیریت"
        />

        <AccountRow
          icon={Smartphone}
          label="شماره موبایل"
          value={user.phoneNumber ?? "ثبت نشده"}
          badge={<VerifiedBadge verified={!!user.phoneNumberVerified} />}
          href="/my-account/phone"
          actionLabel="مدیریت"
        />

        <AccountRow
          icon={MapPin}
          label="آدرس"
          value={
            address?.city
              ? `${address.city} - ${address.streetAddress}`
              : "ثبت نشده"
          }
          href="/my-account/address"
          actionLabel="مدیریت"
        />
      </div>
    </section>
  );
}

export default UserDetails;
