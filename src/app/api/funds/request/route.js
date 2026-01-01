import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FundRequest from "@/db/FundRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "HR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { amount, purpose } = await req.json();
    if (!amount || amount <= 0 || !purpose) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const doc = await FundRequest.create({
      hrId: session.user.id,
      amount,
      purpose,
      status: "PENDING",
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
