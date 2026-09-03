import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/shared/Pagination/PaginationControls";
import UserRoleToggle from "@/components/shared/Admin/Users/UserRoleToggle";
import { getAllUsers } from "@/lib/actions/user.actions";
import { getCurrentSession, requireAdmin } from "@/lib/auth/authGuard";
import { format } from "date-fns-jalali";

export const metadata: Metadata = {
  title: "کاربران",
};

export const revalidate = 0;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pageNumber = Number(resolvedParams.page) || 1;
  const query = resolvedParams.query || "";

  await requireAdmin();
  const session = await getCurrentSession();

  const result = await getAllUsers({ page: pageNumber, query });

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

  const { usersList, totalPages } = result.data!;

  return (
    <div className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        مدیریت کاربران
      </h2>

      <div className="overflow-x-auto">
        <Table className="w-full table-fixed dark:text-neutral-50">
          <TableHeader>
            <TableRow>
              <TableHead className="w-48 text-right">نام</TableHead>
              <TableHead className="w-56 text-right">ایمیل</TableHead>
              <TableHead className="w-36 text-right">موبایل</TableHead>
              <TableHead className="w-32 text-right">تاریخ عضویت</TableHead>
              <TableHead className="w-28 text-right">وضعیت ایمیل</TableHead>
              <TableHead className="w-40 text-center">نقش</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {usersList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center">
                  هیچ کاربری یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              usersList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="w-48 text-right font-medium">
                    {user.name || "بدون نام"}
                  </TableCell>

                  <TableCell
                    className="w-56 text-right whitespace-nowrap"
                    dir="ltr"
                  >
                    {user.email || "—"}
                  </TableCell>

                  <TableCell
                    className="w-36 text-right whitespace-nowrap"
                    dir="ltr"
                  >
                    {user.phoneNumber || "—"}
                  </TableCell>

                  <TableCell className="w-32 text-right">
                    {user.createdAt
                      ? format(user.createdAt, "yyyy/MM/dd")
                      : "—"}
                  </TableCell>

                  <TableCell className="w-28 text-right">
                    {user.emailVerified ? (
                      <Badge className="bg-green-600 text-white">
                        تایید شده
                      </Badge>
                    ) : (
                      <Badge variant="outline">تایید نشده</Badge>
                    )}
                  </TableCell>

                  <TableCell className="w-40">
                    <div className="flex justify-center">
                      {session?.user?.id === user.id ? (
                        <span className="text-muted-foreground text-xs">
                          حساب شما
                        </span>
                      ) : (
                        <UserRoleToggle
                          userId={user.id}
                          userName={user.name}
                          role={user.role}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={pageNumber}
        totalPages={totalPages}
        basePath="/admin/users"
      />
    </div>
  );
}
