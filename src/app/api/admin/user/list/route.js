import { connectDB } from "@/db/connect";
import User from "@/db/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 },
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only Admin can view users" },
        { status: 403 },
      );
    }

    await connectDB();

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim();

    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let query = {
      role: { $ne: "admin" },
    };

    if (search) {
      const or = [
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i", $ne: "admin" } },
      ];

      if (mongoose.Types.ObjectId.isValid(search)) {
        or.push({ _id: search });
      }
      query = { $or: or };
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        message: "Users retrieved successfully",
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        users: users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
