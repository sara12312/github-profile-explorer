"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ComparisonChartProps {
  data: { name: string; user1: number; user2: number }[];
  user1Name: string;
  user2Name: string;
}

export default function ComparisonChart({
  data,
  user1Name,
  user2Name,
}: ComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Bar dataKey="user1" fill="#3B82F6" name={user1Name} />
        <Bar dataKey="user2" fill="#10B981" name={user2Name} />
      </BarChart>
    </ResponsiveContainer>
  );
}
