import aparatImg from "@/public/images/icon--black.svg";
import aparatDark from "@/public/images/icon--white.svg";
import bleDark from "@/public/images/logo/ble-logo-white.png";
import bleImg from "@/public/images/logo/ble-logo.png";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram, FaWhatsapp, FaYoutube } from "react-icons/fa";

type SocialLinksProps = {
  isFooter?: boolean;
};

function SocialLinks({ isFooter = true }: SocialLinksProps) {
  return (
    <div>
      <h4 className="text-md text-foreground mb-4 font-semibold">
        ما را دنبال کنید
      </h4>
      <div className="flex gap-4">
        <Link
          href="https://www.instagram.com/anima.home.ir?igsh=YTB4eHhmdG82bnpn"
          aria-label="Instagram"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaInstagram className="h-5 w-5" />
        </Link>
        <Link
          href="https://telegram.me/AnimaHomeDecor"
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
          href="https://wa.me/989129277302"
          aria-label="Whatsapp"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaWhatsapp className="h-5 w-5" />
        </Link>
        <Link
          target="_blank"
          href="https://www.youtube.com/@Anima-HomeOfficial"
          aria-label="Youtube"
          className={`hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 ${
            !isFooter ? "dark:text-muted-foreground" : ""
          }`}
        >
          <FaYoutube className="h-5 w-5" />
        </Link>
        <Link
          target="_blank"
          href="https://www.aparat.com/animahome.ir/"
          aria-label="Aparat"
          className="hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 dark:hidden"
        >
          <Image
            src={aparatImg}
            className="h-5 w-5"
            alt="aparatLogo"
            loading="eager"
            priority={true}
            decoding="async"
            fetchPriority="high"
          />
        </Link>
        <Link
          target="_blank"
          href="https://www.aparat.com/animahome.ir/"
          aria-label="Aparat"
          className="hover:text-primary active:text-primary hidden opacity-70 transition duration-300 hover:opacity-100 dark:block"
        >
          <Image
            src={aparatDark}
            className="h-5 w-5"
            alt="aparatLogo"
            loading="eager"
            priority={true}
            decoding="async"
            fetchPriority="high"
            aria-label="Aparat"
          />
        </Link>
        {/* ble logo */}
        <Link
          target="_blank"
          href="https://ble.ir/AnimaHome"
          aria-label="ble-link"
          className="hover:text-primary active:text-primary opacity-70 transition duration-300 hover:opacity-100 dark:hidden"
        >
          <Image
            src={bleImg}
            className="h-5 w-5"
            width={40}
            height={40}
            alt="bleLogo"
            loading="eager"
            priority={true}
            decoding="async"
            fetchPriority="high"
            aria-label="ble"
          />
        </Link>
        <Link
          target="_blank"
          href="https://ble.ir/AnimaHome"
          aria-label="ble-link"
          className="hover:text-primary active:text-primary hidden opacity-70 transition duration-300 hover:opacity-100 dark:block"
        >
          <Image
            src={bleDark}
            className="h-5 w-5"
            width={40}
            height={40}
            alt="bleLogo"
            loading="eager"
            priority={true}
            decoding="async"
            fetchPriority="high"
            aria-label="ble"
          />
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
