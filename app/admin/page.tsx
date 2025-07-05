import { dummyProjects } from "@/db/sampleData";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartCard } from "@/components/shared/Admin/BarChartCart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیریت / داشبورد",
};

function AdminDashboardPage() {
  const totalProjects = dummyProjects;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card className="sm:mr-10">
        <CardHeader>
          <CardTitle>پروژه‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalProjects.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>محصولات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">12</p> {/* آمار تستی */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>کاربران</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">6</p> {/* آمار تستی */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>درآمد</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">35,000,000 تومان</p>
          {/* آمار تستی */}
        </CardContent>
      </Card>
      <div className="col-span-full">
        <BarChartCard />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
