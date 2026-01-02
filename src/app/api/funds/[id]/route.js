import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FundRequest from "@/db/FundRequest";
import Wallet from "@/db/Wallet";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const request = await FundRequest.findById(id).lean();

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(request, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const fundRequest = await FundRequest.findById(id);

    if (!fundRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (fundRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 },
      );
    }

    fundRequest.status = status;
    await fundRequest.save();

    // If approved, add funds to HR wallet
    if (status === "APPROVED") {
      try {
        const wallet = await Wallet.findOneAndUpdate(
          { ownerId: fundRequest.hrId },
          { $inc: { balance: fundRequest.amount } },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        return NextResponse.json(
          {
            fundRequest,
            wallet,
            message: "Fund request approved successfully",
          },
          { status: 200 },
        );
      } catch (walletErr) {
        console.error("Wallet update error:", walletErr);
        // Revert the status change if wallet update fails
        fundRequest.status = "PENDING";
        await fundRequest.save();
        return NextResponse.json(
          { error: "Failed to update wallet", message: walletErr.message },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { fundRequest, message: "Fund request rejected successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Fund request PATCH error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
