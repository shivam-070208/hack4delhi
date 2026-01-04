import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import Grievance from "@/db/Grievance";
import Attendance from "@/db/Attendance";
import SalaryTransaction from "@/db/SalaryTransaction";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/db/connect";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Attendance summary
  let present = 0,
    absent = 0,
    leaves = 0;
  try {
    // Assuming Attendance uses userId and has status fields as in previous context
    const attendanceRecords = await Attendance.find({ userId });
    present = attendanceRecords.filter((a) => a.status === "present").length;
    absent = attendanceRecords.filter((a) => a.status === "absent").length;
    leaves = attendanceRecords.filter((a) => a.status === "leave").length;
  } catch (e) {
    // ignore and leave as zeros
  }

  // Salary info (latest transaction)
  let salary = null;
  try {
    salary = await SalaryTransaction.findOne({ employeeId: userId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (e) {
    salary = null;
  }

  // Grievance summary
  let totalGrievances = 0,
    openGrievances = 0,
    resolvedGrievances = 0;
  try {
    const grievances = await Grievance.find({ employeeId: userId });
    totalGrievances = grievances.length;
    openGrievances = grievances.filter(
      (g) => g.status === "pending" || g.status === "in_progress",
    ).length;
    resolvedGrievances = grievances.filter(
      (g) => g.status === "resolved",
    ).length;
  } catch (e) {
    // ignore and leave as zeros
  }

  return NextResponse.json({
    attendance: {
      total: present + absent + leaves,
      present,
      absent,
      leaves,
    },
    salary: salary
      ? {
          month: salary.month,
          amount: salary.amount,
          status: "Paid", // Assume always Paid since SalaryTransaction means issued
        }
      : null,
    grievance: {
      total: totalGrievances,
      open: openGrievances,
      resolved: resolvedGrievances,
    },
  });
}
