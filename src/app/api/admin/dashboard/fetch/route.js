/*****************************************************
 * API ROUTE TO PROVIDE DATA FOR DASHBOARD FOR ADMIN
 * ASSIGNED TO: ISHIKA , ASK DIWAKAR FOR API RESPONSE REQUIREMENT *
 *****************************************************/
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import HR from "@/db/HR";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
     const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }
    await connectDB();
    const today = new Date();
    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
    //total employee per month 
    const totalWorkingEmployees = await Employee.countDocuments({
      employmentStatus: "active",
      createdAt: { $gte: monthStart },
    });
      //total HRs per month
    const totalWorkingHR = await HR.countDocuments({
      status: "active",
      createdAt: { $gte: monthStart },
    });
     //total employee+hrs working this month
    const totalWorkingPeople =
      totalWorkingEmployees + totalWorkingHR;
    //total salary disbursed this month department wise 
    const totalSalaryByDept = await Employee.aggregate([
      {
        $match: {
          employmentStatus: "active",
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: "$department",
          totalSalary: { $sum: "$salary" },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          totalSalary: 1,
        },
      },
    ]);
    //total employees per department
    const totalEmployeeByDept = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          totalEmployees: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          totalEmployees: 1,
        },
      },
    ]);
     //total employee on leave per department 
    const employeesOnLeaveByDept = await Employee.aggregate([
      {
        $match: {
          employmentStatus: "on-leave",
        },
      },
      {
        $group: {
          _id: "$department",
          onLeaveCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          onLeaveCount: 1,
        },
      },
    ]);
    //sending the response (all data required for dashboard)
    return NextResponse.json(
      {
        success: true,
        data: {
          totalWorkingEmployees,
          totalWorkingHR,
          totalWorkingPeople,
          totalSalaryByDept,
          totalEmployeeByDept,
          employeesOnLeaveByDept
        },
      },
      { status: 200 },
    );
  } 
  // sending error if data fetching is not done successfully
  catch (error) {
    console.error("Admin dashboard data fetch not successfull:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}