import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SalaryTransaction from "@/db/SalaryTransaction";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    const requesterId = session.user.id;
    const targetId = params.id;

    if (role === "EMPLOYEE" && requesterId !== targetId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const records = await SalaryTransaction.find({ employeeId: targetId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
