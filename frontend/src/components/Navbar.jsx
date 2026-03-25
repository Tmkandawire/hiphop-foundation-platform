import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token } = useAuth();

  const navItems = ["Home", "About", "Blog", "Gallery", "Contact"];

  return (
    <nav className="sticky top-4 z-[100] px-6">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(20,92,243,0.08)] rounded-[2rem] px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="px-4 h-10 bg-[#145CF3] rounded-xl flex items-center justify-center shadow-lg shadow-[#145CF3]/20 hover:bg-[#1149c2] transition-colors">
            <span className="text-white font-black text-lg tracking-tighter">
              HHF.
            </span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-sm font-bold text-[#190E0E]/60 hover:text-[#145CF3] transition-all"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/admin"
              className="bg-[#145CF3] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1149c2] transition-all shadow-md shadow-[#145CF3]/20"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/donate"
              className="bg-[#EBF2FC] text-[#145CF3] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#145CF3] hover:text-white transition-all"
            >
              Donate
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
