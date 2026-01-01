import { connectDB } from "@/db/connect";
import User from "@/db/User";
import FundRequest from "@/db/FundRequest";
import SalaryTransaction from "@/db/SalaryTransaction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await connectDB();

    const user = await User.findById(id).lean();
    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    let chartData = [];
    let total = 0;

    if (user.role === "HR") {
      const agg = await FundRequest.aggregate([
        { $match: { hrId: id, status: "APPROVED" } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      chartData = agg.map((a) => ({
        label: `${a._id.year}-${String(a._id.month).padStart(2, "0")}`,
        value: a.total,
      }));
      total = agg.reduce((s, a) => s + a.total, 0);
    } else if (user.role === "EMPLOYEE") {
      const agg = await SalaryTransaction.aggregate([
        { $match: { employeeId: mongoose.Types.ObjectId(id) } },
        { $group: { _id: "$month", total: { $sum: "$amount" } } },
        { $sort: { _id: 1 } },
      ]);
      chartData = agg.map((a) => ({ label: a._id, value: a.total }));
      total = agg.reduce((s, a) => s + a.total, 0);
    }

    return NextResponse.json({ user, chartData, total }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(id);
    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (user.role !== "HR") {
      return NextResponse.json(
        { error: "Only HR can be deleted via this endpoint" },
        { status: 403 },
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
