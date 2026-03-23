import express from "express";
import {
  createMessage,
  getMessages,
  replyToMessage,
  moveToTrash,
  purgeMessage,
} from "../controllers/messageController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Submit form
router.post("/", createMessage);

// Admin: Folder management
router.get("/", protectAdmin, getMessages); // Supports ?status=inbox, sent, or trash
router.post("/:id/reply", protectAdmin, replyToMessage);
router.patch("/:id/trash", protectAdmin, moveToTrash);
router.delete("/:id/purge", protectAdmin, purgeMessage);

export default router;
