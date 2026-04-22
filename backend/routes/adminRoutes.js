import express from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  getDashboardStats,
  getActivityLogs,
  updatePassword,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/* -------------------------
   AUTH ROUTES
-------------------------*/

// ✅ Register only available in development
// Once your admin account is created, this route vanishes in production
if (process.env.NODE_ENV === "development") {
  router.post("/register", registerAdmin);
}

// Login with rate limiting
router.post("/login", loginLimiter, loginAdmin);

// Refresh access token
router.get("/refresh", refreshToken);

// Logout (clear cookie)
router.post("/logout", logoutAdmin);

/* -------------------------
   ADMIN PROTECTED ROUTES
-------------------------*/
router.get("/stats", protectAdmin, getDashboardStats);
router.get("/activity", protectAdmin, getActivityLogs);

router.put("/update-password", protectAdmin, updatePassword);

export default router;
