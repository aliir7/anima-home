import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const categories = [
  { name: "کمد", href: "/categories/کمد" },
  { name: "کابینت", href: "/categories/کابینت" },
  { name: "تی وی وال", href: "/categories/تی-وی-وال" },
  { name: "مارول شیت", href: "/categories/مارول-شیت" },
];

function CategoriesMenu() {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="items-center bg-transparent font-normal text-white hover:bg-transparent">
              دسته‌بندی
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex min-w-[150px] flex-col gap-1 p-3 text-center">
                {categories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block py-1 hover:underline"
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
    </div>
  );
}

export default CategoriesMenu;
