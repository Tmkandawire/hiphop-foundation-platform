import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProduct } from "../api/productApi";
import Loader from "../components/Loader";
import Container from "../components/Container";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProduct(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <Container>
        <div className="alert alert-error mt-10">
          <span>{error}</span>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <p className="text-center mt-10">Product not found</p>
      </Container>
    );
  }

  return (
    <Container>
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-sm text-[#185FA5] hover:underline flex items-center gap-1"
      >
        ← Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-3xl overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.image?.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          {product.category && (
            <span className="w-fit bg-[#E6F1FB] text-[#185FA5] text-xs font-medium px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl font-bold font-poppins text-[#190E0E]">
            {product.name}
          </h1>
          <p className="text-gray-500 leading-relaxed">{product.description}</p>
          <p className="text-2xl font-bold text-[#185FA5]">
            MWK {product.price?.toLocaleString()}
          </p>
          <button className="w-full py-4 bg-[#145CF3] text-white font-medium rounded-2xl hover:bg-[#0f4fd4] transition-all duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </Container>
  );
}
