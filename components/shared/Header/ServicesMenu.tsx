import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { services } from "@/lib/constants";

function ServicesMenu() {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="items-center bg-transparent px-0 py-0 font-normal text-white shadow-none hover:bg-transparent dark:text-white">
              خدمات
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex min-w-[150px] flex-col gap-2 p-3 text-center">
                {services.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="hover:bg-primary dark:hover:bg-primaryDark dark:active:bg-primaryDark mt-1 block rounded-lg py-1 hover:text-white active:text-white"
                    >
                      {item.title}
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

export default ServicesMenu;
