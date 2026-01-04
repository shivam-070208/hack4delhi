import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Attendance from "@/db/Attendance";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const employeeId = session.user.id;
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month");

    await connectDB();

    let startDate, endDate;
    if (monthParam) {
      const [year, monthNum] = monthParam.split("-");
      if (!year || !monthNum) {
        return NextResponse.json({ error: "Invalid 'month' parameter (expected YYYY-MM)" }, { status: 400 });
      }
      startDate = new Date(`${year}-${monthNum}-01`);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      const now = new Date();
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    }

    await Attendance.init && Attendance.init();
    const records = await Attendance.find({
      userId: employeeId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ date: 1 })
      .lean();

    // Build chart data: For each day of the month, what was the status
    const daysInMonth = [];
    const year = startDate.getUTCFullYear();
    const month = startDate.getUTCMonth();
    const totalDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    for (let day = 1; day <= totalDays; day++) {
      daysInMonth.push({
        date: new Date(Date.UTC(year, month, day)),
        status: "absent",
        hours: 0,
      });
    }

    // Map attendance dates to days for quick lookup (only first of day utc)
    const recordMap = {};
    for (const rec of records) {
      const dt = new Date(rec.date);
      const key = Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
      recordMap[key] = rec;
    }

    const chart = daysInMonth.map((d) => {
      const key = d.date.getTime();
      if (recordMap[key]) {
        return {
          date: d.date.toISOString().slice(0, 10),
          status: recordMap[key].status,
          hours: recordMap[key].hours || 0,
        };
      }
      return {
        date: d.date.toISOString().slice(0, 10),
        status: "absent",
        hours: 0,
      };
    });

    return NextResponse.json({ records, chart }, { status: 200 });
  } catch (err) {
    console.error("Error fetching monthly attendance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
