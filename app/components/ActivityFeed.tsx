"use client";
import React from "react";

const items = [
  "John Smith updated profile",
  "Sarah approved leave",
  "Mike clocked in",
  "Admin added new department",
  "Payroll processed for June",
];

export default function ActivityFeed() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Recent Activity</h3>
        <span className="text-xs muted">Today</span>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[var(--accent)] rounded mt-2" />
            <div>{it}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
