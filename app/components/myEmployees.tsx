"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Toast from "./Toast";

interface Employee {
  _id: string;
  email: string;
  username: string;
  password: string;
  role: "admin" | "manager" | "employee";
  employeeInfo: {
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
    phone: string;
  };
  permissions: {
    canEditEmployees: boolean;
    canDeleteEmployees: boolean;
    canViewPayroll: boolean;
  };
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

const MyEmployees: React.FC = () => {
  const apiPath = "/api/users";
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: "",
    username: "",
    password: "",
    role: "employee",
    firstName: "",
    lastName: "",
    department: "",
    position: "",
    salary: "0",
    hireDate: new Date().toISOString().slice(0, 10),
    phone: "",
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPayroll: false,
    status: "active",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(apiPath);
      const data = await res.json();
      const normalized = data.map((emp: any) => ({
        ...emp,
        role: emp.role ?? "employee",
        employeeInfo: {
          firstName: "",
          lastName: "",
          department: "",
          position: "",
          salary: 0,
          hireDate: new Date().toISOString(),
          phone: "",
          ...(emp.employeeInfo || {}),
        },
        permissions: {
          canEditEmployees: false,
          canDeleteEmployees: false,
          canViewPayroll: false,
          ...(emp.permissions || {}),
        },
        status: emp.status ?? "active",
      }));
      setEmployees(normalized);
      setFilteredEmployees(normalized);
    } catch (e) {
      setError("Failed to fetch employees");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const normalized = searchTerm.toLowerCase();
    const filtered = employees.filter((emp) =>
      emp._id.toLowerCase().includes(normalized) ||
      emp.email.toLowerCase().includes(normalized) ||
      emp.username.toLowerCase().includes(normalized) ||
      emp.role.toLowerCase().includes(normalized) ||
      emp.employeeInfo.firstName.toLowerCase().includes(normalized) ||
      emp.employeeInfo.lastName.toLowerCase().includes(normalized) ||
      emp.employeeInfo.department.toLowerCase().includes(normalized) ||
      emp.employeeInfo.position.toLowerCase().includes(normalized) ||
      emp.status.toLowerCase().includes(normalized),
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const fieldValue = type === "checkbox" ? checked : value;
    setNewEmployee((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailValid(newEmployee.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (newEmployee.username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!newEmployee.firstName.trim() || !newEmployee.lastName.trim()) {
      setError("Please enter first name and last name.");
      return;
    }

    setError(null);

    const payload = {
      email: newEmployee.email,
      username: newEmployee.username,
      password: newEmployee.password,
      role: newEmployee.role,
      employeeInfo: {
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        department: newEmployee.department,
        position: newEmployee.position,
        salary: Number(newEmployee.salary),
        hireDate: new Date(newEmployee.hireDate).toISOString(),
        phone: newEmployee.phone,
      },
      permissions: {
        canEditEmployees: newEmployee.canEditEmployees,
        canDeleteEmployees: newEmployee.canDeleteEmployees,
        canViewPayroll: newEmployee.canViewPayroll,
      },
      status: newEmployee.status,
    };

    const tempId = `temp-${Date.now()}`;
    const optimistic: Employee = {
      _id: tempId,
      email: newEmployee.email,
      username: newEmployee.username,
      password: newEmployee.password,
      role: newEmployee.role as "admin" | "manager" | "employee",
      employeeInfo: {
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        department: newEmployee.department,
        position: newEmployee.position,
        salary: Number(newEmployee.salary),
        hireDate: new Date(newEmployee.hireDate).toISOString(),
        phone: newEmployee.phone,
      },
      permissions: {
        canEditEmployees: newEmployee.canEditEmployees,
        canDeleteEmployees: newEmployee.canDeleteEmployees,
        canViewPayroll: newEmployee.canViewPayroll,
      },
      status: newEmployee.status as "active" | "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEmployees((p) => [optimistic, ...p]);
    setFilteredEmployees((p) => [optimistic, ...p]);

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setEmployees((p) => p.filter((x) => x._id !== tempId));
        setFilteredEmployees((p) => p.filter((x) => x._id !== tempId));
        setError("Failed to add employee: " + (text || res.status));
        setToast({ message: "Failed to add employee", type: "error" });
        return;
      }

      await fetchEmployees();
      setToast({ message: "Employee added", type: "success" });
      closeModal();
      setNewEmployee({
        email: "",
        username: "",
        password: "",
        role: "employee",
        firstName: "",
        lastName: "",
        department: "",
        position: "",
        salary: "0",
        hireDate: new Date().toISOString().slice(0, 10),
        phone: "",
        canEditEmployees: false,
        canDeleteEmployees: false,
        canViewPayroll: false,
        status: "active",
      });
    } catch (err) {
      setError("Failed to add employee");
      setToast({ message: "Failed to add employee", type: "error" });
      console.error(err);
    }
  };

  const confirmDelete = (id: string) => setDeletingId(id);
  const cancelDelete = () => setDeletingId(null);
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${apiPath}?userId=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setToast({
          message: "Failed to delete: " + (text || res.status),
          type: "error",
        });
        return;
      }
      setEmployees((p) => p.filter((x) => x._id !== id));
      setFilteredEmployees((p) => p.filter((x) => x._id !== id));
      setToast({ message: "Employee deleted", type: "success" });
      setDeletingId(null);
    } catch (err) {
      setError("Failed to delete employee");
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col p-4 bg-[var(--card)] rounded-lg shadow h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold">Employee Management</h1>
          <div className="text-sm muted">MongoDB RESTful CRUD</div>
        </div>
        <div>
          <button
            onClick={openModal}
            className="px-3 py-1 bg-[var(--accent)] text-white rounded-md"
          >
            New Employee
          </button>
        </div>
      </div>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by ID, Email, Username, Role, or Status"
        className="p-2 mb-4 border border-[var(--border)] rounded-md bg-white text-[var(--foreground)]"
      />

      <div className="overflow-y-auto flex-grow">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--border)]">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Position</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Hire Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const info = emp.employeeInfo || {
                firstName: "",
                lastName: "",
                department: "",
                position: "",
                salary: 0,
                hireDate: new Date().toISOString(),
                phone: "",
              };

              return (
                <tr key={emp._id} className="border-b">
                  <td className="p-2 text-sm">{emp._id}</td>
                  <td className="p-2 text-sm">{`${info.firstName || "—"} ${info.lastName || ""}`.trim() || "—"}</td>
                  <td className="p-2 text-sm">{emp.email}</td>
                  <td className="p-2 text-sm">{emp.username}</td>
                  <td className="p-2 text-sm capitalize">{emp.role || "employee"}</td>
                  <td className="p-2 text-sm">{info.department || "—"}</td>
                  <td className="p-2 text-sm">{info.position || "—"}</td>
                  <td className="p-2 text-sm capitalize">{emp.status || "active"}</td>
                  <td className="p-2 text-sm">{new Date(info.hireDate).toLocaleDateString()}</td>
                  <td className="p-2">
                    {deletingId === emp._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded"
                          onClick={() => handleDelete(emp._id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded"
                          onClick={cancelDelete}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => confirmDelete(emp._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-employee-title"
            className="bg-[var(--card)] text-[var(--foreground)] p-6 rounded-lg w-full max-w-xl shadow-lg"
          >
            <h2 id="add-employee-title" className="text-xl font-semibold mb-2">
              Add New Employee
            </h2>
            <p className="text-sm muted mb-4">
              Enter details to create a new employee.
            </p>
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Jamie"
                    value={newEmployee.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Smith"
                    value={newEmployee.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="jdoe"
                    value={newEmployee.username}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={newEmployee.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Engineering"
                    value={newEmployee.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Position</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Software Engineer"
                    value={newEmployee.position}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Salary</label>
                  <input
                    type="number"
                    name="salary"
                    placeholder="75000"
                    value={newEmployee.salary}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hire Date</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={newEmployee.hireDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <fieldset className="grid grid-cols-1 gap-2 rounded-md border border-[var(--border)] p-3">
                    <legend className="text-sm font-medium">Permissions</legend>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canEditEmployees"
                        checked={newEmployee.canEditEmployees}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Can edit employees
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canDeleteEmployees"
                        checked={newEmployee.canDeleteEmployees}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Can delete employees
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canViewPayroll"
                        checked={newEmployee.canViewPayroll}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Can view payroll
                    </label>
                  </fieldset>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={newEmployee.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--border)] bg-white text-[var(--foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[var(--accent)] text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <div className="mt-4 text-center">Loading...</div>}
      {error && <div className="mt-4 text-center text-red-500">{error}</div>}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

export default MyEmployees;
