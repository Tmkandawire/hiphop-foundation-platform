import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";

// PRODUCT IMAGE STORAGE
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hiphop/products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// POST IMAGE STORAGE
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hiphop/posts",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

// EXPORT MIDDLEWARES
export const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});

export const uploadPost = multer({
  storage: postStorage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});
