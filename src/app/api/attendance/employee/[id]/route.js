import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Attendance from "@/db/Attendance";
import HR from "@/db/HR";
import Employee from "@/db/Employee";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const targetId = params.id;
    const role = session.user.role;
    if (role === "HR") {
      const hr = await HR.findOne({ hrId: session.user.id }).lean();
      const emp = await Employee.findOne({ userId: targetId }).lean();
      if (!hr || !emp)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (String(emp.department) !== String(hr.department))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (role === "EMPLOYEE" && String(session.user.id) !== String(targetId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const q = { userId: targetId };
    if (start || end) q.date = {};
    if (start) q.date.$gte = new Date(start);
    if (end) q.date.$lte = new Date(end);
    const records = await Attendance.find(q).sort({ date: 1 }).lean();
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
