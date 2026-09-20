import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User, DEPARTMENTS } from "../models/User.js";

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department || null,
  status: user.status,
});

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, department } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    if (role === "department" && !DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    const user = await User.create({ name, email, password, role, department });

    if (user.role === "department" && user.status !== "active") {
      return res.status(202).json({
        message: "Authority registration submitted and pending admin approval",
        user: serializeUser(user),
      });
    }

    const token = signToken(user);

    return res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role === "department" && user.status === "pending") {
      return res.status(403).json({ message: "Your authority account is pending admin approval." });
    }

    if (user.role === "department" && user.status === "rejected") {
      return res.status(403).json({ message: "Your authority account has been rejected." });
    }

    const token = signToken(user);

    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};
