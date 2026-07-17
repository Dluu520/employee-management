import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const totalEmployees = await User.countDocuments();

    const activeEmployees = await User.countDocuments({
      status: "active",
    });

    const payroll = await User.aggregate([
      {
        $group: {
          _id: null,
          totalPayroll: {
            $sum: "$employeeInfo.salary",
          },
          averageSalary: {
            $avg: "$employeeInfo.salary",
          },
        },
      },
    ]);

    const departmentBreakdown = await User.aggregate([
      {
        $group: {
          _id: "$employeeInfo.department",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return NextResponse.json({
      totalEmployees,
      activeEmployees,
      totalPayroll: payroll[0]?.totalPayroll ?? 0,
      averageSalary: payroll[0]?.averageSalary ?? 0,
      departments: departmentBreakdown,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load dashboard stats",
      },
      {
        status: 500,
      },
    );
  }
}
