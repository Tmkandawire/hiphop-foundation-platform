import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router
  .route("/")
  .post(sendMessage) // For the public contact form
  .get(getMessages); // For the admin to view all

router.route("/:id").delete(deleteMessage);

export default router;
