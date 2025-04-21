import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-border mt-16 border-t py-8">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
        {/* برند */}
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            فروشگاه مدرن
          </h3>
          <p className="text-sm leading-relaxed">
            تجربه‌ای نوین از خرید آنلاین با محصولات متنوع، قیمت مناسب و ارسال
            سریع.
          </p>
        </div>

        {/* لینک‌های مفید */}
        <div>
          <h4 className="text-md text-foreground mb-4 font-semibold">
            لینک‌های مفید
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-primary transition">
                درباره ما
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition">
                تماس با ما
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-primary transition">
                سؤالات متداول
              </Link>
            </li>
          </ul>
        </div>

        {/* راه‌های ارتباطی */}
        <div>
          <h4 className="text-md text-foreground mb-4 font-semibold">
            ارتباط با ما
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> ۰۹۱۲۱۲۳۴۵۶۷
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> info@modernshop.ir
            </li>
          </ul>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div>
          <h4 className="text-md text-foreground mb-4 font-semibold">
            ما را دنبال کنید
          </h4>
          <div className="flex gap-4">
            <Link
              href="#"
              aria-label="Instagram"
              className="hover:text-primary transition"
            >
              <FaInstagram className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="Facebook"
              className="hover:text-primary transition"
            >
              <FaFacebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              aria-label="LinkedIn"
              className="hover:text-primary transition"
            >
              <FaLinkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="text-muted-foreground mt-8 text-center text-xs">
        © {new Date().getFullYear()} فروشگاه مدرن - تمام حقوق محفوظ است.
      </div>
    </footer>
  );
}
