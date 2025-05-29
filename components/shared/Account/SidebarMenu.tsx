import Link from "next/link";

import { menu } from "@/lib/constants";

function SidebarMenu() {
  return (
    <nav className="bg-muted sticky top-28 space-y-4 rounded-lg p-4">
      {menu.map((item, index) => (
        <Link
          key={index}
          href={`#${item.sectionId}`}
          className="hover:text-primary flex items-center gap-2 pb-4 text-sm transition dark:hover:text-neutral-300"
        >
          {<item.icon />}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default SidebarMenu;
