import Logo from "./Logo";
import MobileNav from "./MobileNav";
import ModeToggle from "./ModeToggle";
import NavBar from "./NavBar";
import SignupBtn from "./SignupBtn";

function Header() {
  return (
    <header className="bg-primary dark:bg-muted w-full border-b text-white shadow-md">
      <div className="wrapper flex-between">
        <div className="flex-start gap-8">
          <MobileNav />
          <Logo />
          <NavBar />
        </div>
        <div className="hidden items-center justify-end gap-4 md:flex">
          <ModeToggle />
          <SignupBtn />
        </div>
      </div>
    </header>
  );
}

export default Header;
