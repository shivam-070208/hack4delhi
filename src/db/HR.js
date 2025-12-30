/**********************************************
 *           THIS DB IS NOT NEEDED            *
 * TODO: DELETE AT LAST IF NOT NEEDED FURTHER *
 **********************************************/
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const HRSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    default: "HR Manager",
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

HRSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

HRSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (!update) return;
  const pwd = update.password || (update.$set && update.$set.password);
  if (pwd) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(pwd, salt);
    if (update.password) update.password = hashed;
    if (update.$set && update.$set.password) update.$set.password = hashed;
    this.setUpdate(update);
  }
});

export default mongoose.models.HR || mongoose.model("HR", HRSchema);
