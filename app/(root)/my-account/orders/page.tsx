import UserOrdersList from "@/components/shared/Account/UserOrdersList";
import PaginationControls from "@/components/shared/Pagination/PaginationControls";
import { getMyOrders } from "@/lib/actions/order.actions";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "سفارش های من",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function UserOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  const page = Number(searchParams.page ?? 1);
  const res = await getMyOrders({ page, limit: 10 });
  const orders = res.data ?? [];

  return (
    <section className="wrapper space-y-6 py-12">
      <h2 className="text-xl font-semibold">سفارش‌های من</h2>
      <UserOrdersList orders={orders} />

      <PaginationControls
        currentPage={page}
        totalPages={orders.length}
        basePath="/my-account/orders"
      />
    </section>
  );
}

export default UserOrdersPage;
