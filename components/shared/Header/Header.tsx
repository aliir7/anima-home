import { auth } from "@/lib/auth";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ModeToggle from "./ModeToggle";
import NavBar from "./NavBar";
import SignupBtn from "./SignupBtn";
import UserDropdown from "../Account/UserDropdown";
import CartBtn from "./CartBtn";
import { getMyCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";

async function Header() {
  const session = await auth();
  const cart = await getMyCart();
  const cartItemsNumber = (cart?.items as CartItem[]).length ?? 0;

  return (
    <header className="bg-primary dark:bg-muted w-full border-b text-white shadow-md">
      <div className="wrapper flex-between">
        <div className="flex-start gap-2 md:gap-8">
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
          <CartBtn cartItemsNumber={cartItemsNumber} />
          {session?.user ? <UserDropdown user={session.user} /> : <SignupBtn />}
        </div>
      </div>
    </header>
  );
}

export default Header;
