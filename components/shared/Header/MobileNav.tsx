import { auth } from "@/lib/auth";
import MobileNavClient from "./MobileNavClient";

async function MobileNav() {
  const session = await auth();
  return <MobileNavClient user={session?.user} />;
}

export default MobileNav;
