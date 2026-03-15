import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", protectAdmin, upload.single("image"), createPost);
router.put("/:id", protectAdmin, upload.single("image"), updatePost);
router.delete("/:id", protectAdmin, deletePost);

export default router;
