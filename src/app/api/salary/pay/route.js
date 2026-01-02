import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Wallet from "@/db/Wallet";
import SalaryTransaction from "@/db/SalaryTransaction";
import User from "@/db/User";
import { NextResponse } from "next/server";
import Employee from "@/db/Employee";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "HR") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }
    const hrId = session.user.id;

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { employeeId, amount, month } = body;

    // Validate required fields
    if (
      !employeeId ||
      typeof employeeId !== "string" ||
      employeeId.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 },
      );
    }

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    if (!month || typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Month must be in YYYY-MM format" },
        { status: 400 },
      );
    }

    // Verify employee exists and is actually an employee
    const employee = await Employee.findById(employeeId).lean();
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found in system" },
        { status: 404 },
      );
    }

    // Check HR wallet balance
    const hrWallet = await Wallet.findOne({ ownerId: hrId }).lean();
    if (!hrWallet || hrWallet.balance < amount) {
      return NextResponse.json(
        {
          error: `Insufficient funds. Available: ₹${hrWallet?.balance || 0}, Required: ₹${amount}`,
        },
        { status: 400 },
      );
    }

    // Deduct from HR wallet
    const updatedHrWallet = await Wallet.findOneAndUpdate(
      { ownerId: hrId },
      { $inc: { balance: -amount } },
      { new: true },
    );

    if (!updatedHrWallet) {
      return NextResponse.json(
        { error: "Failed to update HR wallet" },
        { status: 500 },
      );
    }

    // Create transaction record
    let tx;
    try {
      tx = await SalaryTransaction.create({
        hrId,
        employeeId: employee.userId,
        amount,
        month,
        status: "COMPLETED",
      });
    } catch (dbErr) {
      await Wallet.findOneAndUpdate(
        { ownerId: hrId },
        { $inc: { balance: amount } },
      );
      console.error("Transaction creation error:", dbErr);
      return NextResponse.json(
        { error: "Failed to create salary transaction" },
        { status: 500 },
      );
    }

    // Add to employee wallet
    let employeeWallet = await Wallet.findOne({ ownerId: employeeId });
    if (!employeeWallet) {
      try {
        employeeWallet = await Wallet.create({
          ownerId: employeeId,
          balance: amount,
        });
      } catch (dbErr) {
        // Rollback
        await Wallet.findOneAndUpdate(
          { ownerId: hrId },
          { $inc: { balance: amount } },
        );
        await SalaryTransaction.deleteOne({ _id: tx._id });
        console.error("Employee wallet creation error:", dbErr);
        return NextResponse.json(
          { error: "Failed to create employee wallet" },
          { status: 500 },
        );
      }
    } else {
      try {
        employeeWallet.balance += amount;
        await employeeWallet.save();
      } catch (dbErr) {
        // Rollback
        await Wallet.findOneAndUpdate(
          { ownerId: hrId },
          { $inc: { balance: amount } },
        );
        await SalaryTransaction.deleteOne({ _id: tx._id });
        console.error("Employee wallet update error:", dbErr);
        return NextResponse.json(
          { error: "Failed to update employee wallet" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Salary paid successfully",
        transaction: {
          _id: tx._id,
          amount: tx.amount,
          month: tx.month,
          createdAt: tx.createdAt,
        },
        hrWallet: { balance: updatedHrWallet.balance },
        employeeWallet: { balance: employeeWallet.balance },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Salary pay error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
