import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutForm from "../Account/SignOutForm";
import ModeToggle from "./ModeToggle";

const categories = [
  { name: "کمد", href: "/categories/کمد" },
  { name: "کابینت", href: "/categories/کابینت" },
  { name: "تی وی وال", href: "/categories/تی-وی-وال" },
  { name: "مارول شیت", href: "/categories/مارول-شیت" },
];

export default async function MobileNav() {
  const session = await auth();
  const user = session?.user;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetContent
        side="right"
        className="flex h-full w-72 flex-col justify-start px-6 py-4 dark:bg-neutral-950 dark:text-white"
      >
        {/* Header with user info & toggle */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.image || "/public/images/user.png"}
                    alt={user.name || "گاربر"}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">{user.name}</p>
              </>
            )}
          </div>
          <ModeToggle />
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 flex flex-col gap-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="categories">
              <AccordionTrigger className="text-base">
                دسته‌بندی
              </AccordionTrigger>
              <AccordionContent className="my-2 mr-4">
                <ul className="space-y-2 pr-2 text-sm">
                  {categories.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="block hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link href="/about" className="text-base hover:underline">
            درباره ما
          </Link>
          <Link href="/contact" className="text-base hover:underline">
            تماس با ما
          </Link>

          {user && user.role === "admin" && (
            <Link
              href="/admin"
              className="text-primary mt-2 text-base font-medium hover:underline"
            >
              پنل ادمین
            </Link>
          )}

          {user && (
            <Link
              href="/my-account"
              className="text-primary mt-2 text-base font-medium hover:underline"
            >
              حساب کاربری من
            </Link>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="mt-8 flex flex-col gap-3 border-t pt-4">
          {!user ? (
            <>
              <Button
                asChild
                className="bg-primary mb-2 w-full text-white dark:text-neutral-900"
              >
                <Link href="/sign-up">
                  <LogIn className="ml-2 h-4 w-4" />
                  ثبت‌نام
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">
                  <User className="ml-2 h-4 w-4" />
                  ورود
                </Link>
              </Button>
            </>
          ) : (
            <SignOutForm />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
