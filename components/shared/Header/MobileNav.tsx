import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const categories = [
  { name: "کمد", href: "/categories/کمد" },
  { name: "کابینت", href: "/categories/کابینت" },
  { name: "تی وی وال", href: "/categories/تی-وی-وال" },
  { name: "مارول شیت", href: "/categories/مارول-شیت" },
];

function MobileNav() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
            size="icon"
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="mt-8 flex flex-col gap-4 px-6">
            <NavigationMenu>
              <NavigationMenuList className="flex-col items-start">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="w-full text-right">
                    دسته‌بندی
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="ml-auto w-full">
                    <ul className="flex flex-col gap-2 p-2 text-right">
                      {categories.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="block w-full py-1 hover:underline"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link href="/about">درباره ما</Link>
            <Link href="/contact">تماس با ما</Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
