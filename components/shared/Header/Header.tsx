import Logo from "./Logo";
import ModeToggle from "./ModeToggle";
import NavBar from "./NavBar";
import SignupBtn from "./SignupBtn";

function Header() {
  return (
    <header className="bg-primary dark:bg-foreground w-full border-b text-white shadow-md dark:text-white">
      <div className="wrapper flex-between">
        <div className="flex-start gap-8">
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
