import { Router } from "express";
import { body } from "express-validator";
import { createMember, listMembers } from "../controllers/member.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("department", "admin"));

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("department").optional().isString(),
  ],
  createMember
);

router.get("/", listMembers);

export default router;
