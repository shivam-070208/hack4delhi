import { connectDB } from "@/db/connect";
import User from "@/db/User";
import HR from "@/db/HR";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 },
      );
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only Admin can add HR users" },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await req.json();
    const { name, email, password, role, departmentId } = body;

    if (!name || !email || !password || !role || !departmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (role !== "HR") {
      return NextResponse.json(
        { error: "Admin can create only HR users" },
        { status: 400 },
      );
    }

    const sessionDb = await mongoose.startSession();

    let newUser, hrDoc;
    try {
      await sessionDb.withTransaction(async () => {
        const existingUser = await User.findOne(
          { email: email.toLowerCase() },
          null,
          { session: sessionDb },
        );
        if (existingUser) {
          throw new Error("UserExists");
        }

        // Create a new User document for the HR (save result directly)
        newUser = new User({
          name,
          email: email.toLowerCase(),
          password,
          role: "HR",
          status: "inactive",
        });
        await newUser.save({ session: sessionDb });

        if (!newUser || !newUser._id || !newUser.email) {
          throw new Error(
            "Failed to create user properly (missing email or _id)",
          );
        }

        console.log(newUser);
        hrDoc = new HR({
          hrId: newUser._id,
          department: departmentId,
          joiningDate: new Date(),
        });
        console.log(hrDoc);
        await hrDoc.save({ session: sessionDb });
      });
    } catch (err) {
      sessionDb.endSession();
      if (err.message === "UserExists") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 },
        );
      }
      throw err;
    }
    sessionDb.endSession();

    return NextResponse.json(
      {
        message: "HR user and HR record created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        },
        hr: {
          id: hrDoc.id,
          hrId: hrDoc.hrId,
          department: hrDoc.department,
          status: hrDoc.status,
          joiningDate: hrDoc.joiningDate,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 },
    );
  }
}
