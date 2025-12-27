import { connectDB } from "@/db/connect";
import HR from "@/db/HR";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function DELETE(req) {
  try {
    // Get session to verify user is authenticated and is Admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only Admin can delete HR
    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only Admin can remove HR users",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const body = await req.json();
    const { hrId } = body;

    // Validation
    if (!hrId) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: hrId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(hrId)) {
      return new Response(
        JSON.stringify({ error: "Invalid HR ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find and delete HR
    const deletedHR = await HR.findByIdAndDelete(hrId);

    if (!deletedHR) {
      return new Response(
        JSON.stringify({ error: "HR not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "HR removed successfully",
        hr: {
          id: deletedHR._id,
          name: deletedHR.name,
          email: deletedHR.email,
          employeeId: deletedHR.employeeId,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error removing HR:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// Here Update Section starts 
export async function PUT(req) {
  try {
    // Get session to verify user is authenticated and is Admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only Admin can update HR
    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "Forbidden: Only Admin can update HR users",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const body = await req.json();
    const { hrId, name, email, department, designation, phone, address, status, password } = body;

    // Validation
    if (!hrId) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: hrId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(hrId)) {
      return new Response(
        JSON.stringify({ error: "Invalid HR ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (status && ["active", "inactive"].includes(status)) updateData.status = status;
    if (password) updateData.password = password;

    updateData.updatedAt = new Date();

    // Check if new email already exists (if email is being updated)
    if (email) {
      const existingEmail = await HR.findOne({
        email: email.toLowerCase(),
        _id: { $ne: hrId },
      });
      if (existingEmail) {
        return new Response(
          JSON.stringify({ error: "Email is already in use by another HR" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Find and update HR
    const updatedHR = await HR.findByIdAndUpdate(hrId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHR) {
      return new Response(
        JSON.stringify({ error: "HR not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "HR updated successfully",
        hr: {
          id: updatedHR._id,
          name: updatedHR.name,
          email: updatedHR.email,
          employeeId: updatedHR.employeeId,
          department: updatedHR.department,
          designation: updatedHR.designation,
          phone: updatedHR.phone,
          address: updatedHR.address,
          status: updatedHR.status,
          updatedAt: updatedHR.updatedAt,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating HR:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
