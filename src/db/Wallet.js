import mongoose from "mongoose";
import { connectDB } from "./connect";

await connectDB();

const { Schema } = mongoose;

const WalletSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
