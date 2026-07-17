"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored) setCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const navItems: Array<{ label: string; href: string; live: boolean }> = [
    { label: "Dashboard", href: "/", live: true },
    { label: "Employees", href: "/employees", live: true },
    { label: "Departments", href: "#", live: false },
    { label: "Attendance", href: "#", live: false },
    { label: "Payroll", href: "/payroll", live: true },
    { label: "Reports", href: "#", live: false },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 left-0 bg-[var(--primary)] text-white p-4 flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[var(--primary)] font-bold">
            EM
          </div>
          {!collapsed && <span className="font-semibold">My Company</span>}
        </div>
        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((s) => !s)}
          className="p-1 rounded bg-white/10 hover:bg-white/20"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.live ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-2 rounded hover:bg-white/10"
                >
                  <span className="w-6 text-center">•</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-2 rounded opacity-50 pointer-events-none">
                  <span className="w-6 text-center">•</span>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && (
                    <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4">
        {!collapsed && <div className="text-sm text-white/80">Settings</div>}
      </div>
    </aside>
  );
}
