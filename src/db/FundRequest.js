import mongoose from "mongoose";
import { connectDB } from "./connect";

await connectDB();

const { Schema } = mongoose;

const FundRequestSchema = new Schema(
  {
    hrId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    purpose: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export default mongoose.models.FundRequest ||
  mongoose.model("FundRequest", FundRequestSchema);
