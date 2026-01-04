import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Grievance from "@/db/Grievance";
import { connectDB } from "@/db/connect";

// Get user's grievances (most recent first)
export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // List all grievances for employee, most recent first
  const grievances = await Grievance.find({ employeeId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return new Response(JSON.stringify(grievances), {
    headers: { "Content-Type": "application/json" },
  });
}

// Submit a new grievance
export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
    });
  }

  // Validate required fields
  const subject =
    typeof body.subject === "string" && body.subject.trim().length > 0
      ? body.subject.trim()
      : null;
  const description =
    typeof body.message === "string" && body.message.trim().length > 0
      ? body.message.trim()
      : null;

  if (!subject || !description) {
    return new Response(
      JSON.stringify({ error: "Subject and message are required." }),
      {
        status: 400,
      },
    );
  }

  const grievance = await Grievance.create({
    employeeId: session.user.id,
    subject,
    description,
    status: "pending",
  });

  // Always return the new grievance for optimistic UI
  return new Response(
    JSON.stringify({
      _id: grievance._id,
      subject: grievance.subject,
      description: grievance.description,
      status: grievance.status,
      createdAt: grievance.createdAt,
      updatedAt: grievance.updatedAt,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    },
  );
}
