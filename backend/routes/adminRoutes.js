import express from "express";
import {
  getDashboardStats,
  getActivityLogs,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/activity", getActivityLogs);

export default router;
