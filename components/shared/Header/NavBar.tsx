import Link from "next/link";

function NavBar() {
  return (
    <nav>
      <ul className="hidden gap-5 md:flex rtl:space-x-reverse">
        <li>
          <Link
            href="/products"
            className="cursor-pointer hover:text-neutral-200"
          >
            محصولات
          </Link>
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
