import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarMenu from "@/components/shared/Account/SidebarMenu";
import UserDetails from "@/components/shared/Account/UserDetails";
import OrderList from "@/components/shared/Account/OrderList";
import LogoutSection from "@/components/shared/Account/LogoutSection";

async function MyAccountPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return <div>my account page</div>;
}

export default MyAccountPage;
