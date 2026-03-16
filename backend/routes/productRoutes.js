import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import { uploadProduct } from "../utils/multer.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin protected
router.post("/", protectAdmin, uploadProduct.single("image"), createProduct);
router.put("/:id", protectAdmin, uploadProduct.single("image"), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
