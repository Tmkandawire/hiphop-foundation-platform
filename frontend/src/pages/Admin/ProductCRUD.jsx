// src/pages/Admin/ProductCRUD.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";
import ImageUpload from "../../components/admin/ImageUpload";

/*
 Product CRUD Page
 Handles creating products with Cloudinary image upload
*/

export default function ProductCRUD() {
  const [imageUrl, setImageUrl] = useState("");

  // React Hook Form for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("/products", { ...data, image: imageUrl });
      alert("Product created successfully!");
      reset(); // clear form
      setImageUrl(""); // clear uploaded image preview
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Product Name"
          className="input input-bordered w-full mb-3"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}

        <input
          type="number"
          placeholder="Price"
          className="input input-bordered w-full mb-3"
          {...register("price", {
            required: "Price is required",
            min: { value: 1, message: "Price must be &gt; 0" },
          })}
        />
        {errors.price && (
          <span className="text-red-500">{errors.price.message}</span>
        )}

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-3"
          {...register("description", { required: "Description required" })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}

        {/* Image Upload */}
        <ImageUpload onUpload={setImageUrl} />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-3 rounded-lg" />
        )}

        <button className="btn btn-primary w-full mt-4">Create Product</button>
      </form>
    </div>
  );
}
