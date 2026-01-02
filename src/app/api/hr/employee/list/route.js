import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Employee from "@/db/Employee";
import HR from "@/db/HR";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "HR")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await connectDB();
    let hr;
    if (session.user.id) {
      hr = await HR.findOne({ hrId: session.user.id }).lean();
    } else if (session.user.email) {
      const user = await HR.db.model("User").findOne({ email: session.user.email }).lean();
      const userId = user?._id;
      hr = await HR.findOne({ hrId: userId }).lean();
    }
    if (!hr)
      return NextResponse.json(
        { error: "HR record not found" },
        { status: 404 },
      );
    const employees = await Employee.find({ department: hr.department })
      .populate("userId")
      .lean();
    return NextResponse.json(employees, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
