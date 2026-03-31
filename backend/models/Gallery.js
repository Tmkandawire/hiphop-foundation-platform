import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Media type is required"],
    },
    url: {
      type: String,
      required: [true, "Media URL is required"],
    },
    public_id: {
      type: String,
      required: [true, "Cloudinary public_id is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Outreach", "Events", "Community", "Music", "General"],
      default: "General",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // ✅ NEW: tracks who uploaded the item
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true },
);

/* -------------------------
   INDEXES
   Speeds up common queries
------------------------- */
// Filter by category and sort by featured + date
gallerySchema.index({ category: 1, featured: -1, createdAt: -1 });

// Filter by mediaType
gallerySchema.index({ mediaType: 1 });

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

export default Gallery;
