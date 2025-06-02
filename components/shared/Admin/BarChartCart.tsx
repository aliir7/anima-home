"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
const data = [
  { name: "فروردین", projects: 4 },
  { name: "اردیبهشت", projects: 8 },
  { name: "خرداد", projects: 6 },
  { name: "تیر", projects: 10 },
];
export function BarChartCard() {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-md">
      <h3 className="mb-4 text-xl font-semibold">نمودار پروژه‌ها</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            textDecoration={20}
            spacing={20}
            letterSpacing={20}
          />
          <XAxis dataKey="name" />
          <YAxis /> <Tooltip />
          <Bar dataKey="projects" fill="#4a5a45" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
