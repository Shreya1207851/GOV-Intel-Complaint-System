import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/auth.controller.js";
import { DEPARTMENTS } from "../models/User.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["citizen", "department", "admin"]).withMessage("Invalid role"),
    body("department").custom((value, { req }) => {
      if (req.body.role === "department") {
        if (!value) throw new Error("Department is required for department users");
        if (!DEPARTMENTS.includes(value)) throw new Error("Invalid department");
      }
      return true;
    }),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default router;
