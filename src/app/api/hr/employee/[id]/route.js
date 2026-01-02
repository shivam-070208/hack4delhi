import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import HR from "@/db/HR";
import SalaryTransaction from "@/db/SalaryTransaction";
import Attendance from "@/db/Attendance";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const { id: targetId } = await params;
    const role = session.user.role;
    if (role === "HR") {
      const hr = await HR.findOne({ hrId: session.user.id }).lean();
      if (!hr)
        return NextResponse.json(
          { error: "HR record not found" },
          { status: 404 },
        );
      const emp = await Employee.findOne({ userId: targetId }).lean();
      if (!emp)
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 },
        );
      if (String(emp.department) !== String(hr.department))
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (role === "EMPLOYEE" && String(session.user.id) !== String(targetId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const employee = await Employee.findOne({ userId: targetId })
      .populate("userId")
      .lean();
    if (!employee)
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );

    const salaryRecords = await SalaryTransaction.find({ employeeId: targetId })
      .sort({ createdAt: -1 })
      .lean();
    const attendanceRecords = await Attendance.find({ userId: targetId })
      .sort({ date: 1 })
      .lean();

    return NextResponse.json(
      { employee, salaryRecords, attendanceRecords },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
