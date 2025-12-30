import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    employmentStatus: {
      type: String,
      enum: ["active", "on-leave", "resigned"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
