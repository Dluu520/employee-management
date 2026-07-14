"use client";
import { useState } from "react";
import MyEmployees from "../components/myEmployees";
import EmployeeList from "../components/employees";

export default function EmployeesPage() {
  const [view, setView] = useState<"manage" | "sample">("manage");

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm muted">Manage your organization users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white/6 p-1 rounded flex items-center">
            {/* <button
              onClick={() => setView("manage")}
              className={`px-3 py-1 rounded ${view === "manage" ? "bg-[var(--accent)] text-white" : "text-white/80"}`}
            >
              Manage
            </button> */}
            {/* <button
              onClick={() => setView("sample")}
              className={`ml-2 px-3 py-1 rounded ${view === "sample" ? "bg-[var(--accent)] text-white" : "text-white/80"}`}
            >
              List of Employees
            </button> */}

            {/* New Employee button moved into Manage view (MyEmployees) */}
          </div>
        </div>
      </header>

      <section>
        <MyEmployees />
        {/* {view === "manage" ? (
          <MyEmployees />
        ) : (
          <EmployeeList apiEndpoint="https://dummyjson.com/users" />
        )} */}
      </section>
    </div>
  );
}
