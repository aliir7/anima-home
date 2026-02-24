import UserOrdersList from "@/components/shared/Account/UserOrdersList";
import PaginationControls from "@/components/shared/Pagination/PaginationControls";
import { getMyOrders } from "@/lib/actions/order.actions";
import { auth } from "@/lib/auth";
import { Order } from "@/types";
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
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { page } = (await searchParams) ?? 1;
  const currentPage = Number(page);

  const { data, totalPages } = await getMyOrders({
    page: currentPage,
    limit: 6,
  });

  const orders = data;

  return (
    <section className="wrapper space-y-6 py-12">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-950">
        سفارش‌های من
      </h2>
      <UserOrdersList orders={orders} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/my-account"
      />
    </section>
  );
}

export default UserOrdersPage;
