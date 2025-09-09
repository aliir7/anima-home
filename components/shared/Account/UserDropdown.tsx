import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutForm from "./SignOutForm";
import { UserSchema } from "@/types";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

type UserDropdownProps = {
  user: Pick<UserSchema, "name" | "email" | "image">;
};

async function UserDropdown({ user }: UserDropdownProps) {
  const session = await auth();
  const admin = session?.user.role === "admin";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <Avatar aria-label="آواتار کاربر" className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || "user"} />
            <AvatarFallback className="text-primary dark:text-primaryDark">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">
            {user.name}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="dark:bg-muted mt-2 w-56 text-right"
        align="start"
      >
        <DropdownMenuItem
          asChild
          className="mt-4 mr-2 mb-2 flex cursor-pointer justify-end px-2 dark:bg-neutral-700"
        >
          {admin ? (
            <Link href="/admin">پنل مدیریت</Link>
          ) : (
            <Link href="/my-account">پروفایل من</Link>
          )}
        </DropdownMenuItem>
        {!admin && (
          <DropdownMenuItem asChild className="mr-2 mb-2 flex justify-end px-2">
            <Link href="/my-account/orders">سفارش‌ها</Link>
          </DropdownMenuItem>
        )}

        <Separator className="my-2" />

        <DropdownMenuItem asChild className="flex justify-end">
          <SignOutForm />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
