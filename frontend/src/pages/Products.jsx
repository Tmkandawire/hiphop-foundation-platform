import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Container from "../components/Container";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  if (!products.length) {
    return (
      <Container>
        <EmptyState message="Our inventory is currently empty." />
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-[#190E0E]">
            Our products
          </h1>
          <p className="text-sm text-gray-400 mt-1">Official HHF merchandise</p>
        </div>
        <span className="bg-[#E6F1FB] text-[#0C447C] text-xs font-medium px-4 py-1.5 rounded-full mt-1">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </Container>
  );
}
