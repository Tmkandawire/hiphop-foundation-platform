import { useEffect, useState, useCallback } from "react";
import { productService } from "@/services/productService";
import toast from "react-hot-toast";
import AddProductForm from "@/components/AddProductForm";

export default function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  /**
   * 1. MEMOIZED FETCH FUNCTION
   * Stable identity prevents infinite loops in useEffect.
   */
  const fetchProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Vault Sync Error:", err);

      if (err.code !== "ERR_CONNECTION_REFUSED") {
        toast.error("Failed to sync inventory");
      }
    }
  }, []);

  /**
   * 2. INITIAL LOAD
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this asset from the vault permanently?"))
      return;

    try {
      await productService.delete(id);
      toast.success("Asset Purged");
      fetchProducts();
    } catch (err) {
      console.error("Purge Error:", err);
      toast.error("Purge failed");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black font-poppins text-[#190E0E]">
            Inventory <span className="text-[#145CF3]">Vault</span>
          </h1>
          <p className="text-[#190E0E]/40 mt-1 font-medium italic">
            Securely managing platform assets.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
          }}
          className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
            showAddForm
              ? "bg-red-50 text-red-500 hover:bg-red-100 shadow-red-100"
              : "bg-[#145CF3] text-white shadow-blue-100 hover:scale-105"
          }`}
        >
          {showAddForm ? "Close Vault" : "Add New Asset"}
        </button>
      </div>

      {/* Structured Form Entry */}
      {(showAddForm || editingProduct) && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-[#145CF3]/5 shadow-2xl shadow-blue-500/5 animate-slide-up">
          <header className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#145CF3]">
              Asset Entry Protocol
            </span>
            <h2 className="text-3xl font-black mt-2">
              {editingProduct
                ? `Modify: ${editingProduct.name}`
                : "Product Details"}
            </h2>
          </header>
          <AddProductForm
            initialData={editingProduct}
            onSuccess={() => {
              setShowAddForm(false);
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        </div>
      )}

      {/* Catalog Display */}
      <div className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <h2 className="font-black uppercase tracking-widest text-[10px] opacity-30">
            Vaulted Assets ({products.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {products.map((p) => (
            <div
              key={p._id}
              className="group flex flex-col md:flex-row items-center gap-8 p-8 hover:bg-[#F8F9FB] transition-all"
            >
              {/* Defensive Image Rendering */}
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-gray-100 border border-gray-50 flex-shrink-0 flex items-center justify-center">
                {p.image?.url ||
                (typeof p.image === "string" && p.image !== "") ? (
                  <img
                    src={p.image?.url || p.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={p.name}
                  />
                ) : (
                  <span className="text-[10px] font-black opacity-20 uppercase tracking-tighter">
                    No Image
                  </span>
                )}
              </div>

              {/* Text details */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-[#190E0E] text-xl uppercase italic tracking-tight">
                  {p.name}
                </h3>
                <p className="text-xs font-black text-[#145CF3] uppercase tracking-[0.2em] mt-2 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                  {new Intl.NumberFormat("en-MW", {
                    style: "currency",
                    currency: "MWK",
                  }).format(p.price)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setShowAddForm(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-3 rounded-xl font-bold text-xs bg-white border border-gray-100 hover:border-[#145CF3] hover:text-[#145CF3] transition-all shadow-sm"
                >
                  Edit Asset
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-4 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="p-20 text-center opacity-20 font-black uppercase tracking-[0.5em] text-xs">
              Vault Status: Empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
