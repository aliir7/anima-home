import { Skeleton } from "@/components/ui/skeleton";

type CategoryTableSkeletonProps = {
  rows?: number;
};

function CategoryTableSkeleton({ rows = 6 }: CategoryTableSkeletonProps) {
  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-4 text-right">نام</th>
            <th className="p-4 text-right">والد</th>
            <th className="p-4 text-right">تاریخ</th>
            <th className="p-4 text-right">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index} className="border-b">
              <td className="p-4">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-10" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTableSkeleton;
