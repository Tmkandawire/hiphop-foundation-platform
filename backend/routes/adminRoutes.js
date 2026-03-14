import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getActivityLogs,
} from "../controllers/adminController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/stats", protectAdmin, getDashboardStats);
router.get("/activity", protectAdmin, getActivityLogs);

export default router;
