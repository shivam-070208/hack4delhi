import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { connectDB } from "@/db/connect";
import { authOptions } from "@/lib/auth";
import SalaryTransaction from "@/db/SalaryTransaction";

// Dummy transaction fetch from DB, actual implementation may vary
async function getSalaryTransactions(month) {
await connectDB()
  const filter = month ? { month } : {};
  const transactions = await SalaryTransaction.find(filter).lean();
  return transactions.map((t) => ({ ...t, _id: t._id.toString() }));
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  try {
    const transactions = await getSalaryTransactions(month);
    return NextResponse.json(transactions || []);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch salary transactions" },
      { status: 500 }
    );
  }
}
