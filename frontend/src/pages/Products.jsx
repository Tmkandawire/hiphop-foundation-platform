import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => {
        /* FIX: We check res.data.data (your original code) 
           OR res.data (if the API sends a direct array).
        */
        const incomingData = res.data.data || res.data;
        setProducts(Array.isArray(incomingData) ? incomingData : []);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]); // Fallback to empty array on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-6 text-center">Loading products...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {/* FIX: Ensure products is an array before mapping.
         Also, changed the map variable from 'products' to 'product' 
         to avoid shadowing the state variable.
      */}
      {Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="card card-compact bg-base-100 shadow-xl border border-gray-100"
            >
              <figure className="px-4 pt-4">
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {product.name || "Unnamed Product"}
                </h2>
                <p className="text-gray-600">
                  {product.description?.substring(0, 60)}...
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
}
