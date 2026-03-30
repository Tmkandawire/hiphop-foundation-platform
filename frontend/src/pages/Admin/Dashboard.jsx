import { useEffect, useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";

// Services
import { productService } from "../../services/productService";
import { postService } from "../../services/postService";
import { messageService } from "../../services/messageService";
import { galleryService } from "../../services/galleryService";

// Components
import ProductCRUD from "./ProductCRUD";
import PostCRUD from "./PostCRUD";
import Inbox from "./Inbox";
import GalleryCRUD from "./GalleryCRUD";
import LogoutModal from "../../components/LogoutModal";

export default function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState({
    products: 0,
    posts: 0,
    messages: 0,
    gallery: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCounts = async () => {
      try {
        setLoading(true);
        const [p, b, m, g] = await Promise.all([
          productService.getAll(),
          postService.getAll(),
          messageService.getAll(),
          galleryService.getAll(),
        ]);
        setStats({
          products: Array.isArray(p) ? p.length : p.data?.length || 0,
          posts: Array.isArray(b) ? b.length : b.data?.length || 0,
          messages: Array.isArray(m) ? m.length : m.data?.length || 0,
          gallery: Array.isArray(g) ? g.length : g.data?.length || 0,
        });
      } catch (err) {
        console.error("Dashboard Stats Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getCounts();
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-[#145CF3] text-white shadow-lg shadow-blue-200"
      : "text-[#190E0E]/50 hover:bg-[#EBF2FC] hover:text-[#145CF3]";

  const menuItems = [
    { to: "/admin", label: "Overview", icon: "📊" },
    { to: "/admin/products", label: "Inventory", icon: "📦" },
    { to: "/admin/posts", label: "Blog Hub", icon: "📝" },
    { to: "/admin/gallery", label: "Gallery", icon: "🖼️" },
    { to: "/admin/messages", label: "Messages", icon: "✉️" },
  ];

  const statCards = [
    {
      label: "Products",
      count: stats.products,
      icon: "📦",
      color: "bg-blue-500",
      link: "products",
    },
    {
      label: "Stories",
      count: stats.posts,
      icon: "📝",
      color: "bg-purple-500",
      link: "posts",
    },
    {
      label: "Gallery Items",
      count: stats.gallery,
      icon: "🖼️",
      color: "bg-pink-500",
      link: "gallery",
    },
    {
      label: "Messages",
      count: stats.messages,
      icon: "✉️",
      color: "bg-emerald-500",
      link: "messages",
    },
  ];

  return (
    <div className="drawer lg:drawer-open font-inter antialiased text-[#190E0E]">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-[#F8F9FB] min-h-screen">
        {/* Mobile Navbar */}
        <div className="navbar bg-white lg:hidden px-6 border-b border-gray-100">
          <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <span className="font-poppins font-black text-xl ml-2 tracking-tighter">
            HHF-HUB
          </span>
        </div>

        <main className="p-6 md:p-12 max-w-7xl mx-auto w-full">
          <Routes>
            {/* OVERVIEW */}
            <Route
              path="/"
              element={
                <div className="space-y-10 animate-fade-in">
                  <header>
                    <h1 className="text-5xl font-black font-poppins tracking-tight">
                      Platform <span className="text-[#145CF3]">Overview</span>
                    </h1>
                    <p className="text-[#190E0E]/50 text-lg mt-2 font-medium">
                      Welcome back, Admin.
                    </p>
                  </header>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                      <Link
                        key={i}
                        to={stat.link}
                        className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:rotate-12 transition-transform`}
                        >
                          {stat.icon}
                        </div>
                        <span className="block text-4xl font-black">
                          {loading ? (
                            <span className="loading loading-dots loading-sm opacity-20" />
                          ) : (
                            stat.count
                          )}
                        </span>
                        <span className="block text-sm font-bold text-[#190E0E]/40 uppercase tracking-widest mt-1">
                          {stat.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              }
            />

            {/* CRUD ROUTES */}
            <Route path="products" element={<ProductCRUD />} />
            <Route path="posts" element={<PostCRUD />} />
            <Route path="gallery" element={<GalleryCRUD />} />
            <Route path="messages" element={<Inbox />} />
          </Routes>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="admin-drawer" className="drawer-overlay" />
        <div className="w-80 min-h-full bg-white border-r border-gray-100 flex flex-col">
          <div className="p-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#145CF3] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">
                H
              </div>
              <div className="leading-tight">
                <span className="block font-poppins font-black text-xl tracking-tighter uppercase">
                  Admin Hub
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">
                  Malawi Core
                </span>
              </div>
            </div>
          </div>

          <ul className="px-6 space-y-3 flex-grow">
            <li className="px-4 text-[10px] font-black uppercase tracking-widest text-[#190E0E]/20 mb-4">
              Management
            </li>
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive(item.to)}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="p-8 border-t border-gray-50">
            <button
              onClick={() =>
                document.getElementById("logout_confirm").showModal()
              }
              className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all"
            >
              <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                🚪
              </span>
              Log Out
            </button>
          </div>
        </div>
      </div>

      <LogoutModal id="logout_confirm" />
    </div>
  );
}
