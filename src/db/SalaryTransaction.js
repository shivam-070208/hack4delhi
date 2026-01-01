import mongoose from "mongoose";
import { connectDB } from "./connect";

await connectDB();

const { Schema } = mongoose;

const SalaryTransactionSchema = new Schema(
  {
    hrId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    month: { type: String, required: true }, // e.g. "2025-12"
  },
  { timestamps: { createdAt: true } },
);

export default mongoose.models.SalaryTransaction ||
  mongoose.model("SalaryTransaction", SalaryTransactionSchema);
