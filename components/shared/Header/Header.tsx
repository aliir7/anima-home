import { auth } from "@/lib/auth";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ModeToggle from "./ModeToggle";
import NavBar from "./NavBar";
import SignupBtn from "./SignupBtn";
import UserDropdown from "../Account/UserDropdown";

async function Header() {
  const session = await auth();
  return (
    <header className="bg-primary dark:bg-muted w-full border-b text-white shadow-md">
      <div className="wrapper flex-between">
        <div className="flex-start gap-8">
          <div className="md:hidden">
            <MobileNav />
          </div>

          <Logo />

          <div className="hidden md:flex">
            <NavBar />
          </div>
        </div>
        <div className="hidden items-center justify-end gap-4 md:flex">
          <ModeToggle />
          {session?.user ? <UserDropdown user={session.user} /> : <SignupBtn />}
        </div>
      </div>
    </header>
  );
}

export default Header;
