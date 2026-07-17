"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";

interface Growth {
  month: string;
  hires: number;
}

export default function EmployeeGrowthChart() {
  const [data, setData] = useState<Growth[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/analytics/employee-growth");
      const growth = await res.json();
      setData(growth);
    }

    loadData();
  }, []);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Employee Growth</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c3650" />

            <XAxis dataKey="month" tick={{ fill: "#94a3b8" }} />

            <YAxis tick={{ fill: "#94a3b8" }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: "600",
              }}
              itemStyle={{
                color: "#818cf8",
              }}
            />

            <Line
              type="monotone"
              dataKey="hires"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
