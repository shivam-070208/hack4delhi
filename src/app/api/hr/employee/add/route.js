import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);


    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 },
      );
    }

    if (session.user.role !== "HR") {
      return NextResponse.json(
        { error: "Forbidden: Only HR can add Employees" },
        { status: 403 },
      );
    }

    await connectDB();
    const body = await req.json();
    const { userId, department, designation, joiningDate, salary, employmentStatus } = body;
    
    if (!userId || !department || !designation || !joiningDate || !salary) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }   

    const existingEmployee = await Employee.findOne({ userId });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee already exists" },
        { status: 400 },
      );
    }

    const newEmployee = await Employee.create({
      userId,
      department,
      designation,
      joiningDate,
      salary,
      employmentStatus: employmentStatus || "active",
    });

    return NextResponse.json({ message: "Employee added successfully",
         employee: {
            id: newEmployee._id,
            userId: newEmployee.userId,
            department: newEmployee.department,
            designation: newEmployee.designation,
            joiningDate: newEmployee.joiningDate,
            salary: newEmployee.salary,
            employmentStatus: newEmployee.employmentStatus,
         } 
        }
         ,  { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
