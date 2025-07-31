import { FaInstagram, FaTelegram, FaWhatsapp } from "react-icons/fa";

import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-border mt-16 border-t py-8">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
        {/* برند */}
        <div>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            آنیماهوم
          </h3>
          <p className="text-sm leading-relaxed">
            طراحی و اجرای دکوراسیون با پشتوانه‌ی سه نسل اعتماد.
            <br />
            سه نسل، یک نگاه: کیفیت.
          </p>
        </div>

        {/* لینک‌های مفید */}
        <div>
          <h4 className="text-md text-foreground mb-4 font-semibold">
            لینک‌های مفید
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="hover:text-primary active:text-primary transition"
              >
                درباره ما
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary active:text-primary transition"
              >
                تماس با ما
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-primary active:text-primary transition"
              >
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
              <Phone className="h-4 w-4" /> 09128184930
              <br />
              09129277302
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 cursor-pointer" /> info@anima-home.ir
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
              href="https://www.instagram.com/anima.home.official?utm_source=qr&igsh=YTB4eHhmdG82bnpn"
              aria-label="Instagram"
              className="hover:text-primary active:text-primary transition"
            >
              <FaInstagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://telegram.me/AnimaHomeDecor"
              aria-label="Telegram"
              target="_blank"
              className="hover:text-primary active:text-primary transition"
            >
              <FaTelegram className="h-5 w-5" />
            </Link>
            <Link
              target="_blank"
              href="https://wa.me/989129277302"
              aria-label="Whatsapp"
              className="hover:text-primary active:text-primary transition"
            >
              <FaWhatsapp className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="text-muted-foreground mt-8 text-center text-xs">
        © {new Date().getFullYear()} آنیماهوم - تمام حقوق محفوظ است.
      </div>
    </footer>
  );
}
