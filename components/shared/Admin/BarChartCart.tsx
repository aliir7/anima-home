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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" />
          <YAxis /> <Tooltip />
          <Bar dataKey="projects" fill="#4a5a45" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
