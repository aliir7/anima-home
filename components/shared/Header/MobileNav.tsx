import type { Session } from "@/lib/auth";
import MobileNavClient from "./MobileNavClient";

type MobileNavProps = {
  session: Session | null;
};

async function MobileNav({ session }: MobileNavProps) {
  return <MobileNavClient user={session?.user} />;
}

export default MobileNav;
