import { Skeleton } from "@/components/ui/skeleton";

type MaterialsTableSkeletonProps = {
  rows?: number;
};

function MaterialsTableSkeleton({ rows = 6 }: MaterialsTableSkeletonProps) {
  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-4 text-right">نام متریال</th>
            <th className="p-4 text-right">توضیحات</th>
            <th className="p-4 text-right">تاریخ ایجاد</th>
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
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-12" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialsTableSkeleton;
