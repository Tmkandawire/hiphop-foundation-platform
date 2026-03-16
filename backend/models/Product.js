import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    image: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    }, // store Cloudinary URL
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
