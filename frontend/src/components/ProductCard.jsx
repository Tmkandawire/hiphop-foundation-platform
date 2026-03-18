import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="card bg-base-100 shadow-md">
      <figure>
        <img src={product.image} alt={product.name} />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p className="text-sm">{product.description.slice(0, 60)}...</p>

        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price}</span>

          <Link
            to={`/products/${product._id}`}
            className="btn btn-primary btn-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
