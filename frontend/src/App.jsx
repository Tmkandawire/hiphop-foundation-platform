import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext"; // ✅ Added this

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./pages/Admin/ProtectedRoute";
import Login from "./pages/Admin/Login";

function App() {
  return (
    /* ✅ Step 1: Wrap everything in AuthProvider so the whole app knows who is logged in */
    <AuthProvider>
      <Router>
        {/* ✅ Step 2: Global Toaster. 
            Now notifications from ANY page will show up correctly here. */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
