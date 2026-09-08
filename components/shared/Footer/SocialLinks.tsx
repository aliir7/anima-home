import { SOCIAL_LINKS_DEFAULTS } from "@/lib/constants";
import { SocialBaleMono, VodAparatMono } from "@persianlabs/icons/react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram, FaWhatsapp, FaYoutube } from "react-icons/fa";

type SocialLinksProps = {
  isFooter?: boolean;
  settings?: {
    instagramUrl?: string | null;
    telegramUrl?: string | null;
    whatsappUrl?: string | null;
    youtubeUrl?: string | null;
    aparatUrl?: string | null;
    bleUrl?: string | null;
  };
};

function SocialLinks({ isFooter = true, settings }: SocialLinksProps) {
  const links = {
    instagramUrl: settings?.instagramUrl || SOCIAL_LINKS_DEFAULTS.instagramUrl,
    telegramUrl: settings?.telegramUrl || SOCIAL_LINKS_DEFAULTS.telegramUrl,
    whatsappUrl: settings?.whatsappUrl || SOCIAL_LINKS_DEFAULTS.whatsappUrl,
    youtubeUrl: settings?.youtubeUrl || SOCIAL_LINKS_DEFAULTS.youtubeUrl,
    aparatUrl: settings?.aparatUrl || SOCIAL_LINKS_DEFAULTS.aparatUrl,
    bleUrl: settings?.bleUrl || SOCIAL_LINKS_DEFAULTS.bleUrl,
  };

  return (
    <div>
      <h4 className="text-md text-foreground mb-4 font-semibold">
        ما را دنبال کنید
      </h4>
      <div className="flex gap-4">
        <Link
          href={links.instagramUrl}
          aria-label="Instagram"
          target="_blank"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaInstagram className="h-5 w-5" />
        </Link>
        <Link
          href={links.telegramUrl}
          aria-label="Telegram"
          target="_blank"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaTelegram className="h-5 w-5" />
        </Link>
        <Link
          target="_blank"
          href={links.whatsappUrl}
          aria-label="Whatsapp"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaWhatsapp className="h-5 w-5" />
        </Link>
        <Link
          target="_blank"
          href={links.youtubeUrl}
          aria-label="Youtube"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaYoutube className="h-5 w-5" />
        </Link>
        <Link
          target="_blank"
          href={links.aparatUrl}
          aria-label="Aparat"
          className=""
        >
          <VodAparatMono
            className="hover:text-primary active:text-primary h-5 w-5 opacity-70 transition duration-300 hover:opacity-100 dark:text-neutral-100"
            title="aparat-logo"
          />
        </Link>

        {/* ble logo */}
        <Link
          target="_blank"
          href={links.bleUrl}
          aria-label="ble-link"
          className=""
        >
          <SocialBaleMono className="hover:text-primary active:text-primary h-5 w-5 opacity-70 transition duration-300 hover:opacity-100 dark:text-neutral-100" />
        </Link>
      </div>
      {isFooter && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=705208&Code=Au48Zd0frWjIn6HWtyCQQ6qcx0mhs9fj"
            className="cursor-pointer"
          >
            <Image
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=705208&Code=Au48Zd0frWjIn6HWtyCQQ6qcx0mhs9fj"
              alt="enamad-logo"
              width={100}
              priority={true}
              loading="eager"
              height={100}
              unoptimized={true} // <--- این خط مشکل را حل می‌کند
              className="object-contain" // برای اینکه عکس دفرمه نشود
            />
          </Link>
          {/* zibal logo */}
          {/* <ZibalTrust /> */}
        </div>
      )}
    </div>
  );
}

export default SocialLinks;
