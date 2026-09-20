import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DEPARTMENTS = [
  "Road & Infrastructure",
  "Water Supply",
  "Electricity",
  "Environment",
];

const USER_STATUS = ["active", "pending", "rejected"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["citizen", "department", "admin"], required: true },
    status: {
      type: String,
      enum: USER_STATUS,
      default: function () {
        return this.role === "department" ? "pending" : "active";
      },
    },
    department: {
      type: String,
      enum: DEPARTMENTS,
      required: function () {
        return this.role === "department";
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
export { DEPARTMENTS, USER_STATUS };
