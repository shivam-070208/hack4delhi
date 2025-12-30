import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export async function PUT(req) {
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
        { error: "Forbidden: Only HR can update Employees" },
        { status: 403 },
      );
    }

    await connectDB();
    const body = await req.json();
    const { userId, department, designation, joiningDate, salary, employmentStatus } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }   

    const updateData = {};
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (joiningDate) updateData.joiningDate = joiningDate;
    if (salary) updateData.salary = salary;
    if (employmentStatus) updateData.employmentStatus = employmentStatus;

    const employee = await Employee.findOneAndUpdate({ userId }, updateData, { new: true });
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Employee updated successfully",
         employee: {
            id: employee._id,
            userId: employee.userId,
            department: employee.department,
            designation: employee.designation,
            joiningDate: employee.joiningDate,
            salary: employee.salary,
            employmentStatus: employee.employmentStatus,
         }
        }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

