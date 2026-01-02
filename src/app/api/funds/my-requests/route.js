import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FundRequest from "@/db/FundRequest";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "HR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await FundRequest.find({ hrId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
