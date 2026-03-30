import Gallery from "../models/Gallery.js";
import { cloudinary } from "../config/cloudinary.js";

// ─── GET ALL (Public) ───────────────────────────────────────────────
export const getGalleryItems = async (req, res) => {
  try {
    const { category, mediaType } = req.query;

    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (mediaType) filter.mediaType = mediaType;

    const items = await Gallery.find(filter).sort({
      featured: -1,
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to load gallery" });
  }
};

// ─── GET SINGLE (Public) ────────────────────────────────────────────
export const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── CREATE (Admin) ─────────────────────────────────────────────────
export const createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Media file is required",
      });
    }

    const { title, description, category, featured } = req.body;
    const mediaType = req.file.resource_type === "video" ? "video" : "image";

    // For videos, Cloudinary auto-generates a thumbnail
    // by replacing the extension with .jpg
    const thumbnail =
      mediaType === "video"
        ? req.file.secure_url.replace(/\.[^/.]+$/, ".jpg")
        : "";

    const item = await Gallery.create({
      title,
      description: description || "",
      mediaType,
      url: req.file.secure_url,
      public_id: req.file.public_id,
      thumbnail,
      category: category || "General",
      featured: featured === "true",
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error("Gallery create error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create gallery item",
    });
  }
};

// ─── UPDATE (Admin) ─────────────────────────────────────────────────
export const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const { title, description, category, featured } = req.body;

    // If a new file is uploaded replace the old one
    if (req.file) {
      if (item.public_id) {
        await cloudinary.uploader.destroy(item.public_id, {
          resource_type: item.mediaType,
        });
      }
      item.url = req.file.secure_url;
      item.public_id = req.file.public_id;
      item.mediaType = req.file.resource_type === "video" ? "video" : "image";
      item.thumbnail =
        item.mediaType === "video"
          ? req.file.secure_url.replace(/\.[^/.]+$/, ".jpg")
          : "";
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;
    if (featured !== undefined) item.featured = featured === "true";

    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Gallery update error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// ─── DELETE (Admin) ─────────────────────────────────────────────────
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Delete from Cloudinary first
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id, {
        resource_type: item.mediaType,
      });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("Gallery delete error:", error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// ─── TOGGLE FEATURED (Admin) ────────────────────────────────────────
export const toggleFeatured = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    item.featured = !item.featured;
    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Toggle failed" });
  }
};
