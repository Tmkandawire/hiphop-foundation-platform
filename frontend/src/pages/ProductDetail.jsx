import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

/*
  Product Detail Page
  Corrected Version: Added 'export default' and API safety checks.
*/

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/products/${id}`);

        // Safety check for data nesting (handles res.data or res.data.data)
        const data = res.data.data || res.data.product || res.data;

        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4">Loading product...</p>
      </div>
    );
  }

  // 2. Error or Not Found State
  if (error || !product) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="mb-6">{error || "Product details are unavailable."}</p>
        <Link to="/products" className="btn btn-outline">
          Return to Shop
        </Link>
      </div>
    );
  }

  // 3. Final Render
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/products" className="text-primary hover:underline">
          &larr; Back to Products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={product.image || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-green-600 font-semibold mb-4">
            ${product.price ? product.price.toLocaleString() : "0.00"}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>
          </div>

          <button className="btn btn-primary w-full md:w-auto px-8">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
