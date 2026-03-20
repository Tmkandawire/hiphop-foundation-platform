import { useEffect, useState, useCallback } from "react";
import { productService } from "../../services/productService";
import toast from "react-hot-toast";
import AddProductForm from "../../components/AddProductForm";
import Button from "../../components/Button";

export default function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. We define the function here so the whole component can see it
  const fetchProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to sync inventory");
    }
  }, []);

  // 2. This triggers the initial data load when the page opens
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. Handle Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product permanently?")) return;

    try {
      await productService.delete(id);
      toast.success("Product deleted");
      // Refresh the list from the server to ensure sync
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black font-poppins text-[#190E0E]">
            Inventory <span className="text-[#145CF3]">Vault</span>
          </h1>
          <p className="text-[#190E0E]/40 mt-1 font-medium">
            Manage prices, items, and stock levels.
          </p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
          }}
          className={showAddForm ? "bg-gray-100 text-gray-600" : ""}
        >
          {showAddForm ? "Cancel" : "Add New Item"}
        </Button>
      </div>

      {/* Conditional Form Rendering */}
      {(showAddForm || editingProduct) && (
        <div className="bg-white p-10 rounded-[3rem] border-2 border-[#145CF3]/10 shadow-xl shadow-blue-50 animate-slide-up">
          <h2 className="text-xl font-bold mb-8 text-[#145CF3]">
            {editingProduct
              ? `Editing: ${editingProduct.name}`
              : "Product Details"}
          </h2>
          <AddProductForm
            initialData={editingProduct}
            onSuccess={() => {
              setShowAddForm(false);
              setEditingProduct(null);
              fetchProducts(); // ✅ No more red underline!
            }}
          />
        </div>
      )}

      {/* Product Feed */}
      <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold uppercase tracking-widest text-[10px] opacity-30">
            Current Catalog ({products.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-50">
          {products.map((p) => (
            <div
              key={p._id}
              className="group flex flex-col md:flex-row items-center gap-6 p-6 hover:bg-[#F8F9FB] transition-all"
            >
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={p.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={p.name}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-[#190E0E] text-xl">{p.name}</h3>
                <p className="text-xs font-black text-[#145CF3] uppercase tracking-[0.2em] mt-2">
                  {new Intl.NumberFormat("en-MW", {
                    style: "currency",
                    currency: "MWK",
                  }).format(p.price)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="px-8 py-3 h-auto text-xs"
                  onClick={() => {
                    setEditingProduct(p);
                    setShowAddForm(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  Edit
                </Button>
                <button
                  className="p-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  onClick={() => handleDelete(p._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="p-20 text-center opacity-30 font-bold uppercase tracking-widest text-sm">
              Vault is empty. Add your first item.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
