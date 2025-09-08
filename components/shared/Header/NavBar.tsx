import Link from "next/link";
import ServicesMenu from "./ServicesMenu";

function NavBar() {
  return (
    <nav aria-label="منوی اصلی">
      <ul className="hidden items-center gap-6 md:flex rtl:space-x-reverse">
        <li>
          <ServicesMenu />
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
      </ul>
    </nav>
  );
}

export default NavBar;
