"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  totalEmployees: number;
  activeEmployees: number;
  totalPayroll: number;
  averageSalary: number;
}

const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) => (
  <div className="card">
    <div className="text-sm text-[var(--muted)]">{title}</div>

    <div className="text-2xl font-semibold mt-2">{value}</div>

    {subtitle && <div className="text-xs muted">{subtitle}</div>}
  </div>
);

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadStats() {
      const res = await fetch("/api/analytics/");

      const data = await res.json();

      setStats(data);
    }

    loadStats();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Employees"
        value={stats.totalEmployees.toString()}
        subtitle={`${stats.activeEmployees} Active`}
      />

      <StatCard
        title="Average Salary"
        value={`$${stats.averageSalary.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`}
        subtitle="Per Employee"
      />

      <StatCard
        title="Payroll"
        value={`$${stats.totalPayroll.toLocaleString()}`}
        subtitle="Annual Payroll"
      />
    </div>
  );
}
