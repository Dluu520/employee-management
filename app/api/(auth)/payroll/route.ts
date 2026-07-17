import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// Define payroll employee structure
interface PayrollType {
  _id: Types.ObjectId;

  employeeInfo: {
    firstName: string;
    lastname: string;
    department: string;
    position: string;
    salary: number;
    hireDate: Date;
  };
  status: string;
}

export const GET = async (): Promise<NextResponse> => {
  try {
    // Connect to database
    await connect();

    // Get all employees
    const employees: PayrollType[] = await User.find(
      {},
      {
        password: 0,
        permissions: 0,
      },
    );

    // Format payroll information
    const payroll = employees.map((employee) => ({
      id: employee._id,

      name: `${employee.employeeInfo.firstName} ${employee.employeeInfo.lastname}`,

      department: employee.employeeInfo.department,

      position: employee.employeeInfo.position,

      annualSalary: employee.employeeInfo.salary || 0,

      monthlySalary: (employee.employeeInfo.salary || 0) / 12,

      hireDate: employee.employeeInfo.hireDate,

      status: employee.status,
    }));

    // Calculate payroll statistics

    const totalMonthlyPayroll = payroll.reduce(
      (total, employee) => total + employee.monthlySalary,
      0,
    );

    const totalSalary = payroll.reduce(
      (total, employee) => total + employee.annualSalary,
      0,
    );

    const averageSalary = payroll.length > 0 ? totalSalary / payroll.length : 0;

    return new NextResponse(
      JSON.stringify({
        summary: {
          employees: payroll.length,

          totalMonthlyPayroll,

          averageSalary,
        },

        payroll,
      }),

      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error fetching payroll: " + error.message);
    }

    return new NextResponse(
      JSON.stringify({
        message: "Error fetching payroll",
      }),

      {
        status: 500,
      },
    );
  }
};
