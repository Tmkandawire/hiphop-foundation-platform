import express from "express";
import {
  createMessage,
  getMessages,
  deleteMessage,
} from "../controllers/messageController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/", createMessage);

// Admin protected
router.get("/", protectAdmin, getMessages);
router.delete("/:id", protectAdmin, deleteMessage);

export default router;
