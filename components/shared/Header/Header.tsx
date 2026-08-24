import { getCartItemsCount } from "@/lib/actions/cart.actions";
import { getCurrentSession } from "@/lib/auth/authGuard";
import UserDropdown from "../Account/UserDropdown";
import CartBtn from "./CartBtn";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ModeToggle from "./ModeToggle";
import NavBar from "./NavBar";
import SignupBtn from "./SignupBtn";

async function Header() {
  const session = await getCurrentSession();
  const cartItemsNumber = await getCartItemsCount(session);
  return (
    <header className="bg-primary dark:bg-muted w-full border-b text-white shadow-md">
      <div className="wrapper flex-between">
        <div className="flex-start gap-2 md:gap-8">
          <div className="md:hidden">
            <MobileNav session={session} />
          </div>

          <Logo />

          <div className="hidden md:flex">
            <NavBar />
          </div>
        </div>
        <div className="hidden items-center justify-end gap-4 md:flex">
          <ModeToggle />
          <CartBtn cartItemsNumber={cartItemsNumber} />
          {session?.user ? <UserDropdown user={session.user} /> : <SignupBtn />}
        </div>
      </div>
    </header>
  );
}

export default Header;
