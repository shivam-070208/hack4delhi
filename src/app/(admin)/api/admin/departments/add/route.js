import { connectDB } from "@/db/connect";
import Department from "@/db/Departments";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

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
        { error: "Forbidden: Only Admin can add departments" },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await req.json();
    const { name, code, description } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existing = await Department.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return NextResponse.json(
        { error: "Department with same name or code exists" },
        { status: 409 },
      );
    }

    const newDept = await Department.create({
      name,
      code: code.toUpperCase(),
      description: description || "",
      createdBy: session.user.id,
    });

    return NextResponse.json(
      { message: "Department created successfully", department: newDept },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding department:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 },
    );
  }
}
