import { connectDB } from "@/db/connect";
import HR from "@/db/HR";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    // Get session to verify user is authenticated and is Admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only Admin can add HR
    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only Admin can add HR users",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const body = await req.json();
    const { name, email, employeeId, password, department, designation, phone, address } = body;

    // Validation
    if (!name || !email || !employeeId || !password || !department) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: name, email, employeeId, password, department",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if HR with same email exists
    const existingEmail = await HR.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: "HR with this email already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if HR with same employeeId exists
    const existingId = await HR.findOne({ employeeId });
    if (existingId) {
      return new Response(
        JSON.stringify({ error: "HR with this employee ID already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new HR
    const newHR = new HR({
      name,
      email: email.toLowerCase(),
      employeeId,
      password,
      department,
      designation: designation || "HR Manager",
      phone: phone || "",
      address: address || "",
    });

    await newHR.save();

    return new Response(
      JSON.stringify({
        message: "HR added successfully",
        hr: {
          id: newHR._id,
          name: newHR.name,
          email: newHR.email,
          employeeId: newHR.employeeId,
          department: newHR.department,
          designation: newHR.designation,
          status: newHR.status,
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding HR:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
