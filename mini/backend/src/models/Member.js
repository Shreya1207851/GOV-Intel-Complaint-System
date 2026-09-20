import mongoose from "mongoose";
import { DEPARTMENTS } from "./User.js";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String, enum: DEPARTMENTS, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Member = mongoose.model("Member", memberSchema);
