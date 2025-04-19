import Logo from "./Logo";
import NavBar from "./NavBar";

function Header() {
  return (
    <header className="bg-primary w-full border-b text-white shadow-md">
      <div className="wrapper flex-between">
        <div className="flex-start gap-8">
          <Logo />
          <NavBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
