import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

/*
 ImageUpload Component

 Purpose:
 - Handles file selection
 - Sends image to backend (Cloudinary via Multer)
 - Returns uploaded image URL to parent component
*/

export default function ImageUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Send uploaded image URL back to parent (Product form)
      onUpload(res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        className="file-input file-input-bordered w-full"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} className="btn btn-secondary mt-2 w-full">
        Upload Image
      </button>
    </div>
  );
}
