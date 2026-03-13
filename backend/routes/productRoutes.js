import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// @desc    Get all products and Create a product
// @route   GET & POST /api/products
router.route("/").get(getProducts).post(createProduct);

// @desc    Delete a specific product by ID
// @route   DELETE /api/products/:id
router.route("/:id").delete(deleteProduct);

export default router;
