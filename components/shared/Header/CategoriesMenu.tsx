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
            <NavigationMenuTrigger className="items-center bg-transparent px-0 py-0 font-normal text-white shadow-none hover:bg-transparent dark:text-white">
              دسته‌بندی
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex min-w-[150px] flex-col gap-2 p-3 text-center">
                {categories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:bg-primary dark:hover:bg-primaryDark mt-1 block rounded-lg py-1 hover:text-white"
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
