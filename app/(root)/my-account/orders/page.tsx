import ComingSoon from "@/components/shared/ComingSoon";
import { auth } from "@/lib/auth";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "سفارش ها",
};

export const dynamic = DYNAMIC_PAGES.ACCOUNT.dynamic;
export const revalidate = DYNAMIC_PAGES.ACCOUNT.revalidate;

async function UserOrdersPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default UserOrdersPage;
