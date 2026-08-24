import MobileNavClient from "./MobileNavClient";

type MobileNavProps = {
  session: unknown;
};

async function MobileNav({ session }: MobileNavProps) {
  return <MobileNavClient user={session?.user} />;
}

export default MobileNav;
