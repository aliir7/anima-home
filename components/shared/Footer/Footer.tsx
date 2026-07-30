import { HeartIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
// import ZibalTrust from "./ZibalTrust";

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
            <li>
              <Link
                href="/terms"
                className="hover:text-primary active:text-primary transition"
              >
                قوانین و مقررات
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-primary active:text-primary transition"
              >
                حریم خصوصی
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
        <SocialLinks />
      </div>

      {/* کپی‌رایت */}
      <div className="text-muted-foreground mt-8 text-center text-xs">
        © {new Date().getFullYear()} آنیماهوم - تمام حقوق محفوظ است.
        <br />
        <p className="mt-2">
          توسعه و طراحی با{" "}
          <span className="inline-flex">
            <HeartIcon size={10} color="red" fill="red" />{" "}
          </span>{" "}
          توسط:
          <Link
            href="https://www.alirezaeii.ir/"
            target="_blank"
            aria-label="developer"
          >
            علی رضایی
          </Link>
        </p>
      </div>
    </footer>
  );
}
