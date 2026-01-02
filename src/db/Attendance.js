import mongoose from "mongoose";
const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "halfday"],
      default: "present",
    },
    hours: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
