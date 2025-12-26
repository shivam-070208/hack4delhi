import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  // departmentId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   require:false,
  //   ref: "Department"
  // },
});


UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.pre("findOneAndUpdate", async function () {
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

export default mongoose.models.User || mongoose.model("User", UserSchema);
