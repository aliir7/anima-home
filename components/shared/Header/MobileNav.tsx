import Link from "next/link";
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
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "کمد", href: "/categories/کمد" },
  { name: "کابینت", href: "/categories/کابینت" },
  { name: "تی وی وال", href: "/categories/تی-وی-وال" },
  { name: "مارول شیت", href: "/categories/مارول-شیت" },
];

export default function MobileNav() {
  return (
    <div className="flex md:hidden">
      <Sheet>
        <SheetTrigger asChild className="align-middle">
          <EllipsisVertical />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex h-full flex-col items-start px-6 dark:text-white"
        >
          <SheetTitle></SheetTitle>

          <nav className="mt-6 mr-6 flex flex-col gap-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="categories">
                <AccordionTrigger className="border-none text-lg outline-none">
                  دسته‌بندی
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2">
                    {categories.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="block py-1 pr-2 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link href="/about" className="text-lg hover:underline">
              درباره ما
            </Link>
            <Link href="/contact" className="text-lg hover:underline">
              تماس با ما
            </Link>
          </nav>
          <div className="mt-20 flex w-full flex-col-reverse justify-end gap-4 px-6">
            <Button asChild className="bg-primary">
              <Link href="/sign-up">تبت نام</Link>
            </Button>
            <Button asChild className="border-primary" variant="outline">
              <Link href="/sign-in">ورود</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
