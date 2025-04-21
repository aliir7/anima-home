import Image from "next/image";
import logoImg from "../../../public/logo/logo-anima-home.svg";
import Link from "next/link";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image src={logoImg} alt="logo" width={48} height={48} priority={true} />
      <Link href="/" className="cursor-pointer">
        <h1 className="text-xl font-bold">آنیما هوم</h1>
      </Link>
    </div>
  );
}

export default Logo;
