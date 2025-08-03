"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModeToggle from "./ModeToggle";
import SignOutForm from "../Account/SignOutForm";
import { services } from "@/lib/constants";

type MobileNavClientProps = {
  user?: { name?: string; image?: string; role?: string };
};

function MobileNavClient({ user }: MobileNavClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // handling link navigation
  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer text-white"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-72 flex-col justify-start px-6 py-4 transition-all duration-300 ease-in-out data-[state=false]:translate-x-full data-[state=true]:translate-x-0 dark:bg-neutral-950 dark:text-white"
      >
        <SheetTitle /> {/* User Header */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.image || "/images/user.png"}
                    alt={user.name || "کاربر"}
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
        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="services">
              <AccordionTrigger className="text-base">خدمات</AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up my-2 mr-4 transition-all duration-500 dark:bg-neutral-950 dark:text-white">
                <ul className="space-y-2 pr-2 text-sm">
                  {services.map((item) => (
                    <li key={item.title}>
                      <Button
                        variant="link"
                        onClick={() => handleNavigate(item.href)}
                        className="block w-full cursor-pointer text-right hover:underline"
                      >
                        {item.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button
            variant="link"
            onClick={() => handleNavigate("/about")}
            className="cursor-pointer justify-start text-right text-base hover:underline dark:text-white"
          >
            درباره ما
          </Button>
          <Button
            variant="link"
            onClick={() => handleNavigate("/contact")}
            className="justify-start text-right text-base hover:underline dark:text-white"
          >
            تماس با ما
          </Button>
          {user?.role === "admin" && (
            <Button
              variant="link"
              onClick={() => handleNavigate("/admin")}
              className="text-primary mt-2 cursor-pointer justify-start text-right text-base font-medium hover:underline dark:text-white"
            >
              پنل مدیریت
            </Button>
          )}
          {user && user.role !== "admin" && (
            <Button
              variant="link"
              onClick={() => handleNavigate("/my-account")}
              className="text-primary mt-2 cursor-pointer justify-start text-right text-base font-medium hover:underline dark:text-white"
            >
              حساب کاربری من
            </Button>
          )}
        </nav>
        {/* Auth Buttons */}
        <div className="mt-auto flex flex-col gap-3 border-t pt-4">
          {!user ? (
            <>
              <Button
                className="bg-primary mb-2 w-full text-white dark:text-neutral-900"
                onClick={() => handleNavigate("/sign-up")}
              >
                <LogIn className="ml-2 h-4 w-4" /> ثبت‌نام
              </Button>
              <Button
                variant="outline"
                className="mb-6 w-full cursor-pointer"
                onClick={() => handleNavigate("/sign-in")}
              >
                <User className="ml-2 h-4" /> ورود
              </Button>
            </>
          ) : (
            <SignOutForm className="mb-5" />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavClient;
