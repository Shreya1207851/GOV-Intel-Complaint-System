import { Router } from "express";
import { body } from "express-validator";
import { submitFeedback } from "../controllers/feedback.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole("citizen"),
  [
    body("complaintId").isMongoId().withMessage("complaintId is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("rating 1-5 required"),
    body("comment").optional().isString(),
    body("image").optional().isString(),
    body("workCompleted").isBoolean().withMessage("workCompleted is required"),
    body("percentDone").optional().isInt({ min: 0, max: 100 }).withMessage("percentDone must be between 0 and 100"),
  ],
  submitFeedback
);

export default router;
