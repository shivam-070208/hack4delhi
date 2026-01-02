import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Attendance from "@/db/Attendance";
import HR from "@/db/HR";
import Employee from "@/db/Employee";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { userId, date, status, hours } = body;
    if (!userId || !date)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    await connectDB();
    const role = session.user.role;
    if (role === "HR") {
      const hr = await HR.findOne({ hrId: session.user.id }).lean();
      const emp = await Employee.findOne({ userId }).lean();
      if (!hr || !emp)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (String(emp.department) !== String(hr.department))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (role === "EMPLOYEE" && String(session.user.id) !== String(userId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const d = new Date(date);
    await Attendance.findOneAndUpdate(
      { userId, date: d },
      { userId, date: d, status: status || "present", hours: hours || 0 },
      { upsert: true, new: true },
    );
    return NextResponse.json(
      { message: "Attendance recorded" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
