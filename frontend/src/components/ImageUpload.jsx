import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUpload({ onImageUpload, existingImage = null }) {
  const [preview, setPreview] = useState(existingImage);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        // Create a local URL for the preview
        setPreview(URL.createObjectURL(file));
        // Pass the file back to the parent component (ProductCRUD or PostCRUD)
        onImageUpload(file);
      }
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="w-full">
      <label className="label">
        <span className="label-text font-bold uppercase text-xs tracking-widest opacity-60">
          Media Assets
        </span>
      </label>

      <div
        {...getRootProps()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-[2.5rem] transition-all duration-500 overflow-hidden
          ${isDragActive ? "border-[#145CF3] bg-[#EBF2FC]/50" : "border-[#EBF2FC] bg-[#F8F9FB] hover:border-[#145CF3]/30"}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative h-64 w-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#190E0E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <p className="text-white font-bold bg-[#145CF3] px-6 py-2 rounded-full shadow-lg">
                Replace Image
              </p>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-[#145CF3]/5 flex items-center justify-center text-[#145CF3] mb-4 group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-[#190E0E] font-bold font-poppins">
              {isDragActive ? "Drop the file here" : "Drag & drop image"}
            </p>
            <p className="text-[#190E0E]/40 text-sm mt-1">
              PNG, JPG or WebP (Max. 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
