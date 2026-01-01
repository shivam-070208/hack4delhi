import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FundRequest from "@/db/FundRequest";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const id = params.id;
    const fr = await FundRequest.findById(id);
    if (!fr) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (fr.status !== "PENDING")
      return NextResponse.json({ error: "Already processed" }, { status: 400 });

    fr.status = "REJECTED";
    await fr.save();

    return NextResponse.json(fr, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
