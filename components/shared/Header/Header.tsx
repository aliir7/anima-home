import Logo from "./Logo";
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
        <SignupBtn />
      </div>
    </header>
  );
}

export default Header;
