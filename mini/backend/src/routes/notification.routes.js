import { Router } from "express";
import { listNotifications } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, listNotifications);

export default router;
