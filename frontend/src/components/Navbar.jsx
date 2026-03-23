import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token } = useAuth();

  return (
    <nav className="sticky top-4 z-[100] px-6">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(20,92,243,0.08)] rounded-[2rem] px-8 py-4 flex items-center justify-between">
        {/* Logo - Using the CharityRight Blue (#145CF3) */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#145CF3] rounded-xl flex items-center justify-center shadow-lg shadow-[#145CF3]/20">
            <span className="text-white font-black text-xl">H</span>
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-[#190E0E]">
            HHF<span className="text-[#145CF3]">.</span>
          </span>
        </Link>

        {/* Links - High Tech Spacing */}
        <div className="hidden md:flex items-center gap-10">
          {["Products", "Blog", "Contact"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-sm font-bold text-[#190E0E]/60 hover:text-[#145CF3] transition-all"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Contextual Action */}
        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/admin"
              className="bg-[#145CF3] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1149c2] transition-all shadow-md shadow-[#145CF3]/20"
            >
              Dashboard
            </Link>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#EBF2FC] flex items-center justify-center text-[#145CF3]">
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
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
