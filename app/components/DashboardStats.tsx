"use client";
import React from "react";

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
}> = ({ title, value, subtitle }) => {
  return (
    <div className="card">
      <div className="text-sm text-[var(--muted)]">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {subtitle && <div className="text-xs muted">{subtitle}</div>}
    </div>
  );
};

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Employees" value="342" subtitle="Active" />
      <StatCard title="Attendance" value="96%" subtitle="Today" />
      <StatCard title="Payroll" value="$85,400" subtitle="This Month" />
    </div>
  );
}
