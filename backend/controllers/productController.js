import Product from "../models/product.js";
import mongoose from "mongoose";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Find all products and sort by newest first
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public (Should be Private later with Auth)
export const createProduct = async (req, res) => {
  const product = req.body; // User sends this from the frontend

  // 1. Basic Validation: Ensure required fields are present
  if (!product.name || !product.price || !product.description) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  // 2. Create a new instance of the Product model
  const newProduct = new Product(product);

  try {
    // 3. Save to MongoDB Atlas
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Check if the ID provided is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in Delete product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
