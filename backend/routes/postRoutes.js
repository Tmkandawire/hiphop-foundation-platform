import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadPost } from "../utils/multer.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);

// Use 'upload' instead of 'uploadPost'
router.post("/", protectAdmin, uploadPost.single("image"), createPost);
router.put("/:id", protectAdmin, uploadPost.single("image"), updatePost);
router.delete("/:id", protectAdmin, deletePost);

export default router;
