import { getServerSession } from "next-auth";
import Attendance from "@/db/Attendance";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/db/connect";



export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Query attendance logs for this user, most recent first
  const records = await Attendance.find({ userId: session.user.id })
    .sort({ date: -1 })
    .lean();

  return new Response(JSON.stringify(records), {
    headers: {
      "Content-Type": "application/json",
    },
  });

}



export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = session.user.id;

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
    });
  }

  const status = typeof body.status === "string" && ["present", "absent", "halfday"].includes(body.status)
    ? body.status
    : "present";

  // Check if user already has an attendance record for today
  const today = new Date();
  // Zero out hours/minutes/seconds/milliseconds for the range
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const existing = await Attendance.findOne({
    userId,
    date: { $gte: today, $lt: tomorrow },
  });

  if (existing) {
    return new Response(JSON.stringify({ error: "Already marked attendance today." }), {
      status: 400,
    });
  }

  // Optionally, could calculate hours, but for now default to 0.
  const attendance = await Attendance.create({
    userId,
    date: new Date(),
    status,
    hours: typeof body.hours === "number" ? body.hours : 0,
  });

  return new Response(JSON.stringify(attendance), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}
