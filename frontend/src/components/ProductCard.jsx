import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group bg-white border border-gray-100 hover:border-blue-300 rounded-[20px] overflow-hidden cursor-pointer transition-all duration-200"
    >
      {/* Image area — light blue bg, product floats */}
      <div className="relative bg-[#F8FAFE] aspect-square flex items-center justify-center p-6">
        {product.image?.url ? (
          <img
            src={product.image.url}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-200">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 text-[11px] font-medium bg-white text-[#0C447C] border border-[#B5D4F4] px-3 py-1 rounded-full">
            {product.category}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 border-t border-gray-100">
        <p className="text-xs font-medium text-[#185FA5] mb-1">
          HHF Collection
        </p>
        <h3 className="font-medium text-[#190E0E] mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2 min-h-[32px]">
          {product.description || "Official HHF merchandise."}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-gray-400 block">Price</span>
            <span className="text-sm font-medium text-[#190E0E]">
              MWK {product.price?.toLocaleString()}
            </span>
          </div>
          <button className="flex-1 py-2.5 bg-[#145CF3] hover:bg-[#0f4fd4] text-white text-xs font-medium rounded-xl transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
