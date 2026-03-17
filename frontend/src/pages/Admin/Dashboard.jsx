import { Link, Routes, Route } from "react-router-dom";

/*
  Admin Dashboard Page
  Corrected Version: Added sub-route support and a better layout.
*/

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Link to="/" className="btn btn-ghost btn-sm">
          ← Back to Site
        </Link>
      </div>

      {/* Dashboard Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link
          to="/admin/products"
          className="card bg-primary text-primary-content p-6 hover:shadow-lg transition-all"
        >
          <h2 className="card-title">Products</h2>
          <p className="opacity-80">Add, edit, or delete inventory.</p>
        </Link>

        <Link
          to="/admin/posts"
          className="card bg-secondary text-secondary-content p-6 hover:shadow-lg transition-all"
        >
          <h2 className="card-title">Blog Posts</h2>
          <p className="opacity-80">Write and manage your articles.</p>
        </Link>

        <Link
          to="/admin/messages"
          className="card bg-accent text-accent-content p-6 hover:shadow-lg transition-all"
        >
          <h2 className="card-title">Messages</h2>
          <p className="opacity-80">Check user inquiries.</p>
        </Link>
      </div>

      <div className="divider">Admin View</div>

      {/* IMPORTANT: This section handles the sub-pages.
        When you go to /admin/products, the component below will render 
        WITHOUT leaving the Dashboard layout.
      */}
      <div className="bg-base-200 p-4 rounded-xl min-h-[300px]">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center py-10">
                <h3 className="text-xl font-medium">Welcome back, Admin!</h3>
                <p className="text-gray-500">
                  Select a category above to start managing your data.
                </p>
              </div>
            }
          />
          {/* These paths are relative to /admin. 
            So path="products" becomes /admin/products 
          */}
          <Route
            path="products"
            element={<div>Product Management Component Goes Here</div>}
          />
          <Route
            path="posts"
            element={<div>Post Management Component Goes Here</div>}
          />
          <Route
            path="messages"
            element={<div>Message List Component Goes Here</div>}
          />
        </Routes>
      </div>
    </div>
  );
}
