import express from "express";
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleFeatured,
} from "../controllers/galleryController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadGallery } from "../utils/multer.js";
import { uploadLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItemById);

// ─── Admin Routes ────────────────────────────────────────────────────
router.post(
  "/",
  protectAdmin,
  uploadLimiter,
  uploadGallery.single("media"),
  createGalleryItem,
);
router.put(
  "/:id",
  protectAdmin,
  uploadLimiter,
  uploadGallery.single("media"),
  updateGalleryItem,
);
router.delete("/:id", protectAdmin, deleteGalleryItem);
router.patch("/:id/featured", protectAdmin, toggleFeatured);

export default router;
