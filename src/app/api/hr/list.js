import { connectDB } from "@/db/connect";
import HR from "@/db/HR";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    // Get session to verify user is authenticated and is Admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only Admin can view all HRs
    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only Admin can view HR users",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    // Get all HRs, excluding password field
    const hrs = await HR.find({}, { password: 0 }).sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({
        message: "HR users retrieved successfully",
        total: hrs.length,
        hrs: hrs,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching HRs:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
