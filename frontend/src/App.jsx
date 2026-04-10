import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

// Public Pages
import Home from "./pages/Home";
//import Products from "./pages/Products";// Placeholder for future product page
//import ProductDetail from "./pages/ProductDetail"; // Placeholder for future productDetail page
import About from "./pages/About";
import Gallery from "./pages/Gallery";
const Donate = lazy(() => import("./pages/Donate"));
import Blog from "./pages/Blog";
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
import Contact from "./pages/Contact";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./pages/Admin/ProtectedRoute";
import Login from "./pages/Admin/Login";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Public layout wrapper — adds Navbar and Footer to all public pages
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
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

        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes — all wrapped with Navbar + Footer */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            {/* <Route
            path="/products"
            element={
              <PublicLayout>
                <Products />
              </PublicLayout> }
            }
          />
          <Route
            path="/products/:id"
            element={
              <PublicLayout>
                <ProductDetail />
              </PublicLayout>
            }
          />*/}
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <About />
                </PublicLayout>
              }
            />
            <Route
              path="/gallery"
              element={
                <PublicLayout>
                  <Gallery />
                </PublicLayout>
              }
            />
            <Route
              path="/donate"
              element={
                <PublicLayout>
                  <Donate />
                </PublicLayout>
              }
            />
            <Route
              path="/blog"
              element={
                <PublicLayout>
                  <Blog />
                </PublicLayout>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <PublicLayout>
                  <BlogDetail />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <Contact />
                </PublicLayout>
              }
            />

            {/* Admin routes — NO Navbar or Footer */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
