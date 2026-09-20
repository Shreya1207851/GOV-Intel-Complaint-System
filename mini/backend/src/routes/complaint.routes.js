import { Router } from "express";
import { body, param } from "express-validator";
import {
  assignComplaint,
  createComplaint,
  getAllComplaints,
  getDepartmentComplaints,
  updateComplaintStatus,
  getMyComplaints,
  getComplaintById,
} from "../controllers/complaint.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { DEPARTMENTS } from "../models/User.js";
import { STATUS } from "../models/Complaint.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  getAllComplaints
);

// Citizen creates complaint
router.post(
  "/",
  authMiddleware,
  requireRole("citizen"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").isIn(DEPARTMENTS).withMessage("Invalid category"),
  ],
  createComplaint
);

// Citizen gets own complaints
router.get(
  "/my",
  authMiddleware,
  requireRole("citizen"),
  getMyComplaints
);

// Department gets its complaints
router.get(
  "/department",
  authMiddleware,
  requireRole("department", "admin"),
  getDepartmentComplaints
);

// Update status
router.put(
  "/:id/status",
  authMiddleware,
  requireRole("department", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid complaint id"),
    body("status").isIn(STATUS).withMessage("Invalid status"),
  ],
  updateComplaintStatus
);

// Assign to member
router.put(
  "/:id/assign",
  authMiddleware,
  requireRole("department", "admin"),
  [
    param("id").isMongoId().withMessage("Invalid complaint id"),
    body("memberId").isMongoId().withMessage("memberId is required"),
  ],
  assignComplaint
);

// Get complaint detail (citizen own / department owning / admin)
router.get(
  "/:id",
  authMiddleware,
  requireRole("citizen", "department", "admin"),
  [param("id").isMongoId().withMessage("Invalid complaint id")],
  getComplaintById
);

export default router;
