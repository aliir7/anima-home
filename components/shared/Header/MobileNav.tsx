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
import { EllipsisVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutForm from "../Account/SignOutForm";

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
    <div className="flex md:hidden">
      <Sheet>
        <SheetTrigger asChild className="align-middle">
          <EllipsisVertical />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex h-full flex-col items-start px-6 dark:text-white"
        >
          <SheetTitle></SheetTitle>

          <nav className="mt-6 mr-6 flex flex-col gap-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="categories">
                <AccordionTrigger className="border-none text-lg outline-none">
                  دسته‌بندی
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2">
                    {categories.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="block py-1 pr-2 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link href="/about" className="text-lg hover:underline">
              درباره ما
            </Link>
            <Link href="/contact" className="text-lg hover:underline">
              تماس با ما
            </Link>
          </nav>
          <div>
            {user && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.image || "/public/images/user.png"}
                    />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Button asChild variant="ghost">
                    <Link
                      href="/my-account"
                      className="flex items-center gap-2 text-sm"
                    >
                      <User className="h-4 w-4" />
                      حساب کاربری
                    </Link>
                  </Button>
                  <SignOutForm />
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400"
                    >
                      <User className="h-4 w-4" />
                      پنل ادمین
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {!user && (
            <div className="mt-10 flex flex-col-reverse gap-3">
              <Button asChild variant="outline" className="border-primary">
                <Link href="/sign-in">ورود</Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/80 text-white"
              >
                <Link href="/sign-up">ثبت‌ نام</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
