import Link from "next/link";
import CategoriesMenu from "./CategoriesMenu";
import { auth } from "@/lib/auth";

async function NavBar() {
  const session = await auth();
  const user = session?.user;
  return (
    <nav>
      <ul className="hidden items-center gap-6 md:flex rtl:space-x-reverse">
        <li>
          <CategoriesMenu />
        </li>
        <li>
          <Link href="/about" className="hover:text-neutral-200">
            درباره ما
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-neutral-200">
            تماس با ما
          </Link>
        </li>

        {user?.role === "admin" && (
          <li>
            <Link
              href="/admin"
              className="text-primary-foreground text-sm font-medium underline"
            >
              پنل ادمین
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
