import { useState } from "react";
import { useForm } from "react-hook-form";
import { productService } from "@/services/productService"; // Using @ alias
import ImageUpload from "./ImageUpload";
import Button from "./Button";
import toast from "react-hot-toast";

export default function AddProductForm({ onSuccess, initialData }) {
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });

  const handleFormSubmit = async (data) => {
    // 1. Image Validation: Only required for new products
    if (!initialData && !imageFile)
      return toast.error("Please upload a product image");

    setIsSubmitting(true);
    const loadToast = toast.loading(
      initialData ? "Refining Vault Asset..." : "Securing Asset in Vault...",
    );

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description || "");

      formData.append("category", data.category || "General");

      // Append image only if a new one is selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (initialData) {
        await productService.update(initialData._id, formData);
      } else {
        await productService.create(formData);
      }

      toast.success(initialData ? "Vault Asset Updated" : "New Asset Secured", {
        id: loadToast,
      });
      onSuccess();
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Transmission failed. Check link.", { id: loadToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Media Assets */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#145CF3] ml-2">
            Media Assets
          </label>
          <div className="rounded-[2.5rem] overflow-hidden">
            <ImageUpload
              onImageUpload={setImageFile}
              // Handling the new object structure: check for .url
              existingImage={initialData?.image?.url || initialData?.image}
            />
          </div>
          {errors.image && (
            <p className="text-red-500 text-xs mt-1 font-bold">
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Right Column: Identification & Valuation */}
        <div className="space-y-10">
          {/* Product Name Field */}
          <div className="space-y-3">
            <label
              htmlFor="product-designation-input"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-2 block"
            >
              Product Designation
            </label>
            <input
              id="product-designation-input" // Matches htmlFor
              {...register("name", {
                required: "Designation is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className={`w-full bg-[#F8F9FB] border-none rounded-2xl p-6 font-bold text-[#190E0E] transition-all focus:ring-4 focus:ring-[#145CF3]/5 placeholder:text-gray-200 ${
                errors.name ? "ring-2 ring-red-100 bg-red-50/10" : ""
              }`}
              placeholder="e.g. Signature Foundation Tee"
            />
            {errors.name && (
              <span className="text-red-400 text-[10px] mt-1 font-bold ml-2">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Price Field */}
          <div className="space-y-3">
            <label
              htmlFor="product-price-input"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-2 block"
            >
              Asset Valuation (MWK)
            </label>
            <input
              id="product-price-input" // Matches htmlFor
              type="number"
              {...register("price", {
                required: "Valuation is required",
                min: { value: 1, message: "Price must be greater than 0" },
              })}
              className={`w-full bg-[#F8F9FB] border-none rounded-2xl p-6 font-bold text-[#190E0E] transition-all focus:ring-4 focus:ring-[#145CF3]/5 placeholder:text-gray-200 ${
                errors.price ? "ring-2 ring-red-100 bg-red-50/10" : ""
              }`}
              placeholder="15000"
            />
            {errors.price && (
              <span className="text-red-400 text-[10px] mt-1 font-bold ml-2">
                {errors.price.message}
              </span>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-8 rounded-[2rem] shadow-2xl shadow-blue-500/10 text-lg font-black uppercase tracking-widest bg-[#145CF3] hover:scale-[1.02] active:scale-95 transition-all"
            >
              {initialData ? "Update Vault" : "Confirm & Save"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
