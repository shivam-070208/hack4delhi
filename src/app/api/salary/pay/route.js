import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Wallet from "@/db/Wallet";
import SalaryTransaction from "@/db/SalaryTransaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "HR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const hrId = session.user.id;
    const { employeeId, amount, month } = await req.json();
    if (!employeeId || !amount || amount <= 0 || !month) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updated = await Wallet.findOneAndUpdate(
      { ownerId: hrId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 },
      );
    }

    const tx = await SalaryTransaction.create({
      hrId,
      employeeId,
      amount,
      month,
    });
    /*
    TODO :
    SEND A MAIL TO EMPLOYEE AND HR 
    */
    return NextResponse.json(
      { transaction: tx, wallet: updated },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
