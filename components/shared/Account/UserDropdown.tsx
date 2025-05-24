import { auth } from "@/lib/auth";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutForm from "./SignOutForm";
import { Button } from "@/components/ui/button";

async function UserDropdown() {
  const session = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
        <Avatar>
          <AvatarImage
            src={session?.user.image || "/public/images/user.png"}
            alt={session?.user.name}
          />
          <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{session?.user.name || "کاربر"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuItem asChild>
          <Button asChild variant="ghost" className="flex w-full">
            <Link href="/my-account">
              <User className="mr-4 h-4 w-4" /> حساب من
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutForm />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
