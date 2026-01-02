import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SalaryTransaction from "@/db/SalaryTransaction";
import User from "@/db/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId is required" },
        { status: 400 },
      );
    }

    const transactions = await SalaryTransaction.find({ employeeId })
      .sort({ createdAt: -1 })
      .lean();

    const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);
    const paidMonths = new Set(transactions.map((t) => t.month));

    return NextResponse.json(
      {
        employeeId,
        totalPaid,
        transactionCount: transactions.length,
        paidMonths: Array.from(paidMonths),
        lastTransaction: transactions[0] || null,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
