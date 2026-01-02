import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Employee from "@/db/Employee";
import User from "@/db/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID required" },
        { status: 400 },
      );
    }

    // Fetch employee by Employee model ID
    const employee = await Employee.findById(employeeId).lean();

    if (!employee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 },
      );
    }

    // Then fetch user details using userId from employee
    const user = await User.findById(employee.userId).lean();
    if (!user) {
      return NextResponse.json(
        { error: "User record not found" },
        { status: 404 },
      );
    }

    // Return combined data
    return NextResponse.json(
      {
        _id: user._id,
        image: user.image,
        name: user.name,
        email: user.email,
        salary: employee.salary,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        employmentStatus: employee.employmentStatus,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error fetching employee salary details:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 },
    );
  }
}
