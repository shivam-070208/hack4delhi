import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FundRequest from "@/db/FundRequest";
import Wallet from "@/db/Wallet";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const {id} = await params;
    const fr = await FundRequest.findById(id);
    if (!fr) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (fr.status !== "PENDING")
      return NextResponse.json({ error: "Already processed" }, { status: 400 });

    fr.status = "APPROVED";
    await fr.save();

    const wallet = await Wallet.findOneAndUpdate(
      { ownerId: fr.hrId },
      { $inc: { balance: fr.amount } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({ fundRequest: fr, wallet }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
