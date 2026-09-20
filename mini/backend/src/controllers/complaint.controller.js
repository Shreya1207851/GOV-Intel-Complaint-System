import { validationResult } from "express-validator";
import { Complaint, STATUS } from "../models/Complaint.js";
import { Member } from "../models/Member.js";
import { DEPARTMENTS } from "../models/User.js";

const complaintPopulate = [
  { path: "assignedTo", select: "name department" },
  { path: "createdBy", select: "name email role department status" },
  { path: "feedback", select: "rating comment image workCompleted percentDone createdAt updatedAt" },
];

export const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, category, location, image } = req.body;

    if (!DEPARTMENTS.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: location || "",
      image: image || "",
      createdBy: req.user._id,
      status: "Pending",
      timeline: [{ status: "Pending", timestamp: new Date() }],
    });

    const populatedComplaint = await Complaint.findById(complaint._id).populate(complaintPopulate);

    return res.status(201).json(populatedComplaint);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create complaint", error: error.message });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .populate(complaintPopulate)
      .sort({ createdAt: -1 });
    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate(complaintPopulate)
      .sort({ createdAt: -1 });

    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id).populate(complaintPopulate);

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const isCitizenOwner = req.user.role === "citizen" && complaint.createdBy?._id?.toString() === req.user._id.toString();
    const isDeptOwner = req.user.role === "department" && complaint.category === req.user.department;
    const isAdmin = req.user.role === "admin";

    if (!(isCitizenOwner || isDeptOwner || isAdmin)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaint", error: error.message });
  }
};

export const getDepartmentComplaints = async (req, res) => {
  try {
    const department = req.user.role === "admin" ? req.query.department : req.user.department;
    const filter = department ? { category: department } : {};
    const complaints = await Complaint.find(filter)
      .populate(complaintPopulate)
      .sort({ createdAt: -1 });
    return res.json(complaints);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role === "department" && complaint.category !== req.user.department) {
      return res.status(403).json({ message: "Cannot modify other departments" });
    }

    complaint.status = status;
    complaint.timeline.push({ status, timestamp: new Date() });
    await complaint.save();

    const populated = await Complaint.findById(id).populate(complaintPopulate);

    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

export const assignComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { memberId } = req.body;

  try {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role === "department" && complaint.category !== req.user.department) {
      return res.status(403).json({ message: "Cannot modify other departments" });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.department !== complaint.category) {
      return res.status(400).json({ message: "Member belongs to a different department" });
    }

    complaint.assignedTo = member._id;
    complaint.status = "Assigned";
    complaint.timeline.push({ status: "Assigned", timestamp: new Date() });
    await complaint.save();

    const populated = await Complaint.findById(id).populate(complaintPopulate);

    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign complaint", error: error.message });
  }
};
