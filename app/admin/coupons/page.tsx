import { Metadata } from "next";
import { getAllCoupons } from "@/lib/actions/coupon.actions";
import { requireAdmin } from "@/lib/auth/authGuard";
import CouponsTable from "@/components/shared/Admin/Coupons/CouponsTable";
import PaginationControls from "@/components/shared/Pagination/PaginationControls";

export const metadata: Metadata = {
  title: "کدهای تخفیف",
};

export const revalidate = 0;

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pageNumber = Number(resolvedParams.page) || 1;
  const query = resolvedParams.query || "";

  await requireAdmin();

  const result = await getAllCoupons({ page: pageNumber, query });

  if (!result.success) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        <h2>متاسفانه مشکلی پیش آمد:</h2>
        <p>
          {result.error.type === "custom"
            ? result.error.message
            : "خطای ناشناخته"}
        </p>
      </div>
    );
  }

  const { couponsList, totalPages } = result.data!;

  return (
    <div className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        کدهای تخفیف
      </h2>

      <CouponsTable couponsList={couponsList} />

      <PaginationControls
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath="/admin/coupons"
      />
    </div>
  );
}
