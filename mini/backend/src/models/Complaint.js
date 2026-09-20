import mongoose from "mongoose";
import { DEPARTMENTS } from "./User.js";

const STATUS = ["Pending", "Assigned", "In Progress", "Resolved"];

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: DEPARTMENTS, required: true },
    status: { type: String, enum: STATUS, default: "Pending" },
    location: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedback: { type: mongoose.Schema.Types.ObjectId, ref: "Feedback", default: null },
    timeline: {
      type: [
        {
          status: { type: String, enum: STATUS, required: true },
          timestamp: { type: Date, default: Date.now },
          note: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
export { STATUS };
