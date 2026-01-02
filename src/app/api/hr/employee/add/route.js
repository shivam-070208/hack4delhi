import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import User from "@/db/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import HR from "@/db/HR";

export async function POST(req) {
  let session = null;
  let mongoSession = null;

  try {
    session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "HR") {
      return NextResponse.json(
        { error: "Forbidden: Only HR can add Employees" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();
    // Remove department from destructure; fetch from current HR model
    const { name, email, password, designation, salary } = body;


    const hrId = session.user.id;
    const hrEmployeeRecord = await HR.findOne({ hrId: hrId });

    if (!hrEmployeeRecord) {
      return NextResponse.json(
        { error: "HR employee record not found for department reference" },
        { status: 400 }
      );
    }
    const department = hrEmployeeRecord.department;

    if (!name || !email || !password || !designation || !salary) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    const existingUser = await User.findOne({ email }).session(mongoSession);
    if (existingUser) {
      await mongoSession.abortTransaction();
      mongoSession.endSession();
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = await User.create(
      [
        {
          name,
          email,
          password, // hash this in production!!
          role: "employee",
          status: "active",
        }
      ],
      { session: mongoSession }
    );

    const createdUser = newUser[0];

    const existingEmployee = await Employee.findOne({ userId: createdUser._id }).session(mongoSession);
    if (existingEmployee) {
      await mongoSession.abortTransaction();
      mongoSession.endSession();
      return NextResponse.json(
        { error: "Employee already exists" },
        { status: 400 }
      );
    }

    // Use Date.now() for joiningDate and department from HR
    const newEmployee = await Employee.create(
      [
        {
          userId: createdUser._id,
          department,
          designation,
          joiningDate: Date.now(),
          salary,
          employmentStatus: "active",
        }
      ],
      { session: mongoSession }
    );

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return NextResponse.json(
      {
        message: "Employee added successfully",
        employee: {
          id: newEmployee[0]._id,
          userId: newEmployee[0].userId,
          department: newEmployee[0].department,
          designation: newEmployee[0].designation,
          joiningDate: newEmployee[0].joiningDate,
          salary: newEmployee[0].salary,
          employmentStatus: newEmployee[0].employmentStatus,
        },
        user: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          status: createdUser.status,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (mongoSession) {
      try {
        await mongoSession.abortTransaction();
        mongoSession.endSession();
      } catch (_) {}
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
