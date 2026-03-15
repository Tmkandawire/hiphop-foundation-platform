// utils/multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Define storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hiphop-products", // Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const parser = multer({ storage });

export default parser;
