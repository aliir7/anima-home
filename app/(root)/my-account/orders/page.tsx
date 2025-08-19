import ComingSoon from "@/components/shared/ComingSoon";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "سفارش ها",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
