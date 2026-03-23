import multer from "multer";
import pkg from "multer-storage-cloudinary";
import cloudinaryV2 from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // ← ensures env vars are loaded

const { CloudinaryStorage } = pkg;
const StorageConstructor =
  typeof CloudinaryStorage === "function"
    ? CloudinaryStorage
    : pkg.default?.CloudinaryStorage || pkg.CloudinaryStorage || pkg;

cloudinaryV2.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productStorage = new StorageConstructor({
  cloudinary: cloudinaryV2,
  params: {
    folder: "hiphop/products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const postStorage = new StorageConstructor({
  cloudinary: cloudinaryV2,
  params: {
    folder: "hiphop/posts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const fileFilter = (req, file, cb) => {
  if (file?.mimetype?.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadProduct = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPost = multer({
  storage: postStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
