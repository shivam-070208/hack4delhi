import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Wallet from "@/db/Wallet";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    let wallet = await Wallet.findOne({ ownerId: userId }).lean();

    // Create wallet if it doesn't exist
    if (!wallet) {
      try {
        wallet = await Wallet.create({
          ownerId: userId,
          balance: 0,
        });
      } catch (createErr) {
        console.error("Error creating wallet:", createErr);
        // Return default wallet data if creation fails
        return NextResponse.json(
          { balance: 0, ownerId: userId },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      { balance: wallet.balance, ownerId: wallet.ownerId },
      { status: 200 },
    );
  } catch (err) {
    console.error("Wallet balance error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
