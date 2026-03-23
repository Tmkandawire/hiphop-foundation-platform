import Product from "../models/Product.js";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Vault Sync Failed" });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID Format" });
  }
  try {
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Asset not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Media asset (image) is required for creation.",
      });
    }

    const imageObj = {
      url: req.file.secure_url, // ← fixed
      public_id: req.file.public_id, // ← fixed
    };

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category: category || "General",
      image: imageObj,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Creation Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Creation Failed" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID Format" });
  }

  try {
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Asset not found" });

    const updateData = { ...req.body };
    if (req.body.price) updateData.price = Number(req.body.price);

    if (req.file) {
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      updateData.image = {
        url: req.file.secure_url, // ← fixed
        public_id: req.file.public_id, // ← fixed
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update Failed" });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Asset not found" });

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Asset Purged" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Purge Failed" });
  }
};
