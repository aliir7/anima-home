"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type AdminChartProps = {
  data: { salesData: { months: string; totalSales: string | null }[] };
};

function AdminChart({ data }: AdminChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.salesData}>
        <XAxis
          dataKey="months"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toLocaleString()} تومان`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AdminChart;
