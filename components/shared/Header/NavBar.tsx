import Link from "next/link";
import CategoriesMenu from "./CategoriesMenu";
import MobileNav from "./MobileNav";

function NavBar() {
  return (
    <nav>
      <ul className="hidden items-center gap-5 md:flex rtl:space-x-reverse">
        <li>
          <CategoriesMenu />
        </li>
        <li>
          <Link href="/about" className="cursor-pointer hover:text-neutral-200">
            درباره ما
          </Link>
        </li>
        <li>
          <Link
            href="contact"
            className="cursor-pointer hover:text-neutral-200"
          >
            تماس با ما
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
