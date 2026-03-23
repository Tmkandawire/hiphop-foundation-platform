import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { uploadProduct } from "../utils/multer.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Access
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Restricted Access
// Note: 'image' must match formData.append("image", file) in your AddProductForm
router.post("/", protectAdmin, uploadProduct.single("image"), createProduct);
router.put("/:id", protectAdmin, uploadProduct.single("image"), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
