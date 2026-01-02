import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Attendance from "@/db/Attendance";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const userId = searchParams.get("userId");

    // Build query
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (month) {
      // Parse month in format YYYY-MM
      const [year, monthNum] = month.split("-");
      const startDate = new Date(`${year}-${monthNum}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("userId", "name email")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(attendanceRecords, { status: 200 });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
