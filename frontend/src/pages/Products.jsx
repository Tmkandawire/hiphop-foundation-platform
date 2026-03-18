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

        // ✅ Correct data extraction
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

  // ✅ UX STATES
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-poppins text-neutral">
          Our Products
        </h1>
        <span className="badge badge-primary">{products.length} Items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </Container>
  );
}
