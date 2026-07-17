import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const growth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$employeeInfo.hireDate" },
            month: { $month: "$employeeInfo.hireDate" },
          },
          hires: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = growth.map((item) => ({
      month: `${monthNames[item._id.month]} ${item._id.year}`,
      hires: item.hires,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Failed to fetch employee growth" },
      { status: 500 },
    );
  }
}
