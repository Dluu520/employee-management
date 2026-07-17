"use client";

import { useEffect, useMemo, useState } from "react";

interface PayrollEmployee {
  id: string;
  name: string;
  department: string;
  position: string;
  annualSalary: number;
  monthlySalary: number;
  hireDate: string;
  status: string;
}

interface PayrollData {
  summary: {
    employees: number;
    totalMonthlyPayroll: number;
    averageSalary: number;
  };
  payroll: PayrollEmployee[];
}

export default function PayrollPage() {
  const [data, setData] = useState<PayrollData | null>(null);

  const [payroll, setPayroll] = useState<PayrollEmployee[]>([]);
  const [filteredPayroll, setFilteredPayroll] = useState<PayrollEmployee[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPayroll() {
      try {
        const res = await fetch("/api/payroll");

        const payrollData = await res.json();

        setData(payrollData);

        setPayroll(payrollData.payroll);
        setFilteredPayroll(payrollData.payroll);
      } catch (error) {
        console.error("Failed fetching payroll", error);
      }
    }

    fetchPayroll();
  }, []);

  /*
    Search Filter
  */
  useEffect(() => {
    const search = searchTerm.toLowerCase();

    const filtered = payroll.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(search) ||
        employee.department.toLowerCase().includes(search) ||
        employee.position.toLowerCase().includes(search) ||
        employee.status.toLowerCase().includes(search)
      );
    });

    setFilteredPayroll(filtered);
  }, [searchTerm, payroll]);

  const stats = useMemo(() => {
    if (!payroll.length) return null;

    const highestSalary = Math.max(
      ...payroll.map((employee) => employee.annualSalary),
    );

    const activeEmployees = payroll.filter(
      (employee) => employee.status === "active",
    ).length;

    const departments = payroll.reduce((acc: any, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = {
          employees: 0,
          payroll: 0,
        };
      }

      acc[employee.department].employees++;

      acc[employee.department].payroll += employee.annualSalary;

      return acc;
    }, {});

    const salaryBands = {
      entry: 0,
      mid: 0,
      senior: 0,
    };

    payroll.forEach((employee) => {
      if (employee.annualSalary < 60000) salaryBands.entry++;
      else if (employee.annualSalary < 100000) salaryBands.mid++;
      else salaryBands.senior++;
    });

    return {
      highestSalary,
      activeEmployees,
      departments,
      salaryBands,
    };
  }, [payroll]);

  if (!data || !stats) {
    return <div className="text-slate-400">Loading payroll...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">Payroll Management</h1>

        <p className="text-slate-400 mt-2">
          Monitor employee compensation, salary distribution, and payroll
          expenses.
        </p>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <PayrollCard
          title="Annual Payroll"
          value={`$${(data.summary.totalMonthlyPayroll * 12).toLocaleString()}`}
        />

        <PayrollCard
          title="Average Salary"
          value={`$${Math.round(data.summary.averageSalary).toLocaleString()}`}
        />

        <PayrollCard
          title="Highest Salary"
          value={`$${stats.highestSalary.toLocaleString()}`}
        />

        <PayrollCard title="Active Employees" value={stats.activeEmployees} />
      </div>

      {/* Analytics */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Department Payroll */}

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-5">
            Department Payroll
          </h2>

          <div className="space-y-4">
            {Object.entries(stats.departments).map(
              ([department, value]: any) => (
                <div key={department}>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{department}</span>

                    <span className="text-slate-400">
                      {value.employees} employees
                    </span>
                  </div>

                  <div className="text-indigo-400 font-semibold">
                    ${value.payroll.toLocaleString()}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Salary Bands */}

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-5">
            Salary Distribution
          </h2>

          <SalaryRow
            label="Entry Level (<60k)"
            value={stats.salaryBands.entry}
          />

          <SalaryRow
            label="Mid Level (60k-100k)"
            value={stats.salaryBands.mid}
          />

          <SalaryRow label="Senior (100k+)" value={stats.salaryBands.senior} />
        </div>
      </div>

      {/* Payroll Table */}

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            Employee Compensation
          </h2>
        </div>

        <div className="p-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="
            Search employee, department, position..."
            className="
            w-full
            p-3
            rounded-md
           
            text-black
            "
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-4 text-left">Employee</th>

                <th>Department</th>

                <th>Position</th>

                <th>Salary</th>

                <th>Tier</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayroll.map((employee) => (
                <tr
                  key={employee.id}
                  className="
            border-b
            border-slate-800
            hover:bg-slate-800/50
            "
                >
                  <td className="p-4">
                    <div className="text-white font-medium">
                      {employee.name}
                    </div>

                    <div className="text-sm text-slate-400">
                      ID: {employee.id.slice(-6)}
                    </div>
                  </td>

                  <td className="text-center text-slate-300">
                    {employee.department}
                  </td>

                  <td className="text-center text-slate-300">
                    {employee.position}
                  </td>

                  <td className="text-center text-white">
                    ${employee.annualSalary.toLocaleString()}
                  </td>

                  <td className="text-center">
                    <SalaryBadge salary={employee.annualSalary} />
                  </td>

                  <td className="text-center">
                    <span
                      className={
                        employee.status === "active"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PayrollCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      className="
card
p-6
bg-slate-900
border
border-slate-800
rounded-xl
"
    >
      <p className="text-slate-400 text-sm">{title}</p>

      <h2
        className="
text-3xl
font-bold
text-white
mt-3
"
      >
        {value}
      </h2>
    </div>
  );
}

function SalaryBadge({ salary }: { salary: number }) {
  if (salary >= 100000)
    return (
      <span
        className="
px-3 py-1
rounded-full
bg-purple-500/20
text-purple-400
text-sm
"
      >
        Senior
      </span>
    );

  if (salary >= 60000)
    return (
      <span
        className="
px-3 py-1
rounded-full
bg-blue-500/20
text-blue-400
text-sm
"
      >
        Mid
      </span>
    );

  return (
    <span
      className="
px-3 py-1
rounded-full
bg-gray-500/20
text-gray-300
text-sm
"
    >
      Entry
    </span>
  );
}

function SalaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="
flex
justify-between
p-3
border-b
border-slate-800
"
    >
      <span className="text-slate-300">{label}</span>

      <span className="text-white font-semibold">
        {value}
        employees
      </span>
    </div>
  );
}
