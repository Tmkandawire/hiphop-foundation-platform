import { useEffect, useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// Services & Components
import ProductCRUD from "./productcrud";
import PostCRUD from "./postcrud";
import LogoutModal from "../../components/LogoutModal";
import { productService } from "../../services/productService";
import { postService } from "../../services/postService";
import { messageService } from "../../services/messageService";
import Container from "../../components/Container";

/* -------------------------------------------------------------------------- */
/* INTERNAL COMPONENT: THE INBOX (Integrated here to avoid file errors)      */
/* -------------------------------------------------------------------------- */
const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getAll();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Inbox sync failed", err);
      toast.error("Failed to sync inbox.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    document.getElementById("message_view_modal").showModal();
  };

  const handleDelete = async (id) => {
    const loadToast = toast.loading("Purging transmission...");
    try {
      await messageService.delete(id);
      toast.success("Message deleted", { id: loadToast });
      setMessages(messages.filter((m) => m._id !== id));
      document.getElementById("message_view_modal").close();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed", { id: loadToast });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-[#190E0E] tracking-tighter">
            Foundation <span className="text-[#145CF3]">Inbox</span>
          </h1>
          <p className="text-gray-400 font-medium italic text-lg">
            Direct transmissions from the global community.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
            Scanning Channels...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
            <p className="text-gray-300 font-bold">
              No new transmissions received.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => openMessage(msg)}
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-50 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/5 transition-all active:scale-[0.98]"
            >
              <div className="w-3 h-3 rounded-full bg-[#145CF3] shadow-[0_0_15px_rgba(20,92,243,0.5)]"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-black text-xl text-gray-900 truncate">
                    {msg.name}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#145CF3] font-bold text-sm mb-1">
                  {msg.subject || "General Inquiry"}
                </p>
                <p className="text-gray-400 line-clamp-1 font-medium italic">
                  "{msg.message}"
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-[#145CF3]">
                Read Entry →
              </span>
            </div>
          ))
        )}
      </div>

      <dialog id="message_view_modal" className="modal backdrop-blur-md">
        <div className="modal-box bg-white rounded-[4rem] p-0 max-w-3xl border border-gray-100 shadow-2xl overflow-hidden">
          <div className="bg-[#145CF3] p-10 text-white">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Incoming
              </span>
              <button
                onClick={() =>
                  document.getElementById("message_view_modal").close()
                }
                className="font-bold"
              >
                ✕
              </button>
            </div>
            <h2 className="text-4xl font-black tracking-tighter">
              {selectedMessage?.subject || "Subject"}
            </h2>
          </div>
          <div className="p-12 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-black text-[#145CF3]">
                {selectedMessage?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">
                  {selectedMessage?.name}
                </p>
                <p className="text-[#145CF3] font-bold text-sm">
                  {selectedMessage?.email}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[2.5rem] p-10 text-lg leading-relaxed text-gray-600 font-medium border border-gray-100 whitespace-pre-wrap italic">
              {selectedMessage?.message}
            </div>
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => handleDelete(selectedMessage?._id)}
                className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors"
              >
                Purge Data
              </button>
              <a
                href={`mailto:${selectedMessage?.email}`}
                className="bg-[#145CF3] text-white px-10 py-4 rounded-2xl font-black text-sm"
              >
                Reply Now
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN DASHBOARD COMPONENT                                                 */
/* -------------------------------------------------------------------------- */
export default function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState({ products: 0, posts: 0, messages: 0 });

  useEffect(() => {
    const getCounts = async () => {
      try {
        const [p, b, m] = await Promise.all([
          productService.getAll(),
          postService.getAll(),
          messageService.getAll(),
        ]);
        setStats({ products: p.length, posts: b.length, messages: m.length });
      } catch (err) {
        console.error("Stats failed", err);
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
    { to: "/admin/messages", label: "Messages", icon: "✉️" },
  ];

  return (
    <div className="drawer lg:drawer-open font-inter antialiased text-[#190E0E]">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-[#F8F9FB] min-h-screen">
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
          <span className="font-poppins font-black text-xl ml-2">HHF-HUB</span>
        </div>

        <main className="p-6 md:p-12 max-w-7xl mx-auto w-full">
          <Routes>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
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
                        label: "Messages",
                        count: stats.messages,
                        icon: "✉️",
                        color: "bg-emerald-500",
                        link: "messages",
                      },
                    ].map((stat, i) => (
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
                          {stat.count}
                        </span>
                        <span className="block text-sm font-bold text-[#190E0E]/40 uppercase tracking-widest mt-1">
                          {stat.label}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="bg-[#145CF3] rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-200">
                    <div className="max-w-md">
                      <h2 className="text-2xl font-bold mb-2 tracking-tight">
                        Editorial Hub
                      </h2>
                      <p className="opacity-80">
                        Update the foundation's stories or manage community
                        feedback from here.
                      </p>
                    </div>
                    <Link
                      to="posts"
                      className="bg-white text-[#145CF3] px-10 py-4 rounded-full font-black hover:scale-105 transition-transform"
                    >
                      Manage Blog
                    </Link>
                  </div>
                </div>
              }
            />
            <Route path="products" element={<ProductCRUD />} />
            <Route path="posts" element={<PostCRUD />} />
            <Route path="messages" element={<Inbox />} />{" "}
            {/* 🟢 Renders the integrated Inbox */}
          </Routes>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
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
                  <span className="text-xl">{item.icon}</span> {item.label}
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
              </span>{" "}
              Log Out
            </button>
          </div>
        </div>
      </div>
      <LogoutModal id="logout_confirm" />
    </div>
  );
}
