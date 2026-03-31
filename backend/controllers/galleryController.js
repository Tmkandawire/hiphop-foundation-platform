import mongoose from "mongoose";
import Gallery from "../models/Gallery.js";
import { cloudinary } from "../config/cloudinary.js";
import logger from "../config/logger.js";

// ─── GET ALL (Public) ───────────────────────────────────────────────
export const getGalleryItems = async (req, res, next) => {
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
    // ✅ Forward to global error handler instead of inline 500
    next(error);
  }
};

// ─── GET SINGLE (Public) ────────────────────────────────────────────
export const getGalleryItemById = async (req, res, next) => {
  try {
    // ✅ Validate ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
      });
    }

    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// ─── CREATE (Admin) ─────────────────────────────────────────────────
export const createGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Media file is required",
      });
    }

    const { title, description, category, featured } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const mediaType = req.file.resource_type === "video" ? "video" : "image";

    // ✅ More robust thumbnail generation for videos
    const thumbnail =
      mediaType === "video" && req.file.secure_url
        ? req.file.secure_url.replace(/\.[^/.]+$/, ".jpg")
        : "";

    const item = await Gallery.create({
      title: title.trim(),
      description: description?.trim() || "",
      mediaType,
      url: req.file.secure_url,
      public_id: req.file.public_id,
      thumbnail,
      category: category || "General",
      featured: featured === "true",
      // ✅ Track who uploaded it
      uploadedBy: req.admin?._id || null,
    });

    logger.info(`Gallery item created: ${item._id} by admin ${req.admin?._id}`);

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    // ✅ If DB save fails after Cloudinary upload
    // clean up the orphaned Cloudinary file
    if (req.file?.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id, {
          resource_type: req.file.resource_type || "image",
        });
        logger.warn(
          `Cleaned up orphaned Cloudinary file: ${req.file.public_id}`,
        );
      } catch (cleanupError) {
        logger.error(
          `Failed to clean up Cloudinary file: ${cleanupError.message}`,
        );
      }
    }
    next(error);
  }
};

// ─── UPDATE (Admin) ─────────────────────────────────────────────────
export const updateGalleryItem = async (req, res, next) => {
  try {
    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
      });
    }

    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const { title, description, category, featured } = req.body;

    // Handle new file upload
    if (req.file) {
      // ✅ Delete old Cloudinary asset before replacing
      if (item.public_id) {
        try {
          await cloudinary.uploader.destroy(item.public_id, {
            resource_type: item.mediaType,
          });
        } catch (cloudinaryError) {
          // Log but don't block the update
          logger.warn(
            `Failed to delete old Cloudinary asset: ${cloudinaryError.message}`,
          );
        }
      }

      item.url = req.file.secure_url;
      item.public_id = req.file.public_id;
      item.mediaType = req.file.resource_type === "video" ? "video" : "image";
      item.thumbnail =
        item.mediaType === "video"
          ? req.file.secure_url.replace(/\.[^/.]+$/, ".jpg")
          : "";
    }

    if (title !== undefined) item.title = title.trim();
    if (description !== undefined) item.description = description.trim();
    if (category !== undefined) item.category = category;
    if (featured !== undefined) item.featured = featured === "true";

    await item.save();

    logger.info(`Gallery item updated: ${item._id} by admin ${req.admin?._id}`);

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE (Admin) ─────────────────────────────────────────────────
export const deleteGalleryItem = async (req, res, next) => {
  try {
    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
      });
    }

    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ✅ Delete from Cloudinary first — if this fails
    // we don't delete the DB record to avoid orphaned files
    if (item.public_id) {
      try {
        await cloudinary.uploader.destroy(item.public_id, {
          resource_type: item.mediaType,
        });
      } catch (cloudinaryError) {
        logger.error(
          `Failed to delete Cloudinary asset ${item.public_id}: ${cloudinaryError.message}`,
        );
        return res.status(500).json({
          success: false,
          message: "Failed to delete media from storage. Database record kept.",
        });
      }
    }

    await item.deleteOne();

    logger.info(`Gallery item deleted: ${item._id} by admin ${req.admin?._id}`);

    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE FEATURED (Admin) ────────────────────────────────────────
export const toggleFeatured = async (req, res, next) => {
  try {
    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
      });
    }

    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.featured = !item.featured;
    await item.save();

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};
