import { validationResult } from "express-validator";
import { Member } from "../models/Member.js";

export const createMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, department: requestedDepartment } = req.body;
    const department = req.user.role === "admin" ? requestedDepartment : req.user.department;

    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    const member = await Member.create({ name, department, createdBy: req.user._id });
    return res.status(201).json(member);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create member", error: error.message });
  }
};

export const listMembers = async (req, res) => {
  try {
    const department = req.user.role === "admin" ? req.query.department : req.user.department;
    const filter = department ? { department } : {};
    const members = await Member.find(filter).sort({ createdAt: -1 });
    return res.json(members);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch members", error: error.message });
  }
};
