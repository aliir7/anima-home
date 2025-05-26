import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarMenu from "@/components/shared/Account/SidebarMenu";
import UserDetails from "@/components/shared/Account/UserDetails";
import OrderList from "@/components/shared/Account/OrderList";
import LogoutSection from "@/components/shared/Account/LogoutSection";
import { Metadata } from "next/";

export const metadata: Metadata = {
  title: "حساب کاربری",
};

async function MyAccountPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <div className="wrapper flex flex-col gap-6 py-10 md:flex-row dark:text-neutral-100">
      <aside className="w-full md:w-1/4">
        <SidebarMenu />
      </aside>

      <main className="w-full space-y-8 md:w-3/4">
        <UserDetails />
        <OrderList />
        <LogoutSection />
      </main>
    </div>
  );
}

export default MyAccountPage;
