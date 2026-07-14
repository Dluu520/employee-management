"use client";
import DashboardStats from "./components/DashboardStats";
import ActivityFeed from "./components/ActivityFeed";

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back!</h1>
          <p className="text-sm muted">Overview of your organization</p>
        </div>
      </header>

      <section>
        <DashboardStats />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="font-medium mb-4">Employee Growth</h3>
            <div className="h-48 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]/40 rounded"></div>
          </div>
        </div>
        <div>
          <ActivityFeed />
        </div>
      </section>
    </div>
  );
}
