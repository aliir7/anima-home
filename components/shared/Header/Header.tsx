import Logo from "./Logo";
import ModeToggle from "./ModeToggle";
import NavBar from "./NavBar";
import SignupBtn from "./SignupBtn";

function Header() {
  return (
    <header className="bg-primary w-full border-b text-white shadow-md">
      <div className="wrapper flex-between">
        <div className="flex-start gap-8">
          <Logo />
          <NavBar />
        </div>
        <div className="flex items-center justify-end gap-4">
          <ModeToggle />
          <SignupBtn />
        </div>
      </div>
    </header>
  );
}

export default Header;
