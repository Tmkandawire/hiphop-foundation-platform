import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X, Menu } from "lucide-react";

export default function Navbar() {
  const { token } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = ["Home", "About", "Blog", "Gallery", "Contact"];

  const getPath = (item) => (item === "Home" ? "/" : `/${item.toLowerCase()}`);

  const isActive = (item) => {
    const path = getPath(item);
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="sticky top-4 z-[100] px-6">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(20,92,243,0.08)] rounded-[2rem] px-6 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <div className="px-4 h-10 bg-[#145CF3] rounded-xl flex items-center justify-center shadow-lg shadow-[#145CF3]/20 hover:bg-[#1149c2] transition-colors">
              <span className="text-white font-black text-lg tracking-tighter">
                HHF.
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item}
                  to={getPath(item)}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-bold
                    transition-all duration-300 group
                    ${
                      active
                        ? "text-[#145CF3] bg-[#EBF2FC]"
                        : "text-[#190E0E]/60 hover:text-[#145CF3] hover:bg-[#EBF2FC]/60"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute bottom-1 left-1/2 -translate-x-1/2
                      w-1 h-1 rounded-full bg-[#145CF3]
                      transition-all duration-300
                      ${active ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100"}
                    `}
                  />
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Right side — action button + hamburger */}
          <div className="flex items-center gap-3">
            {/* Action button — always visible */}
            {token ? (
              <Link
                to="/admin"
                className="bg-[#145CF3] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#1149c2] transition-all shadow-md shadow-[#145CF3]/20"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/donate"
                className="bg-[#EBF2FC] text-[#145CF3] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#145CF3] hover:text-white transition-all"
              >
                Donate
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#EBF2FC] flex items-center justify-center text-[#145CF3] hover:bg-[#145CF3] hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={18} strokeWidth={2.5} />
              ) : (
                <Menu size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU DROPDOWN ── */}
        {isMenuOpen && (
          <div className="md:hidden max-w-7xl mx-auto mt-2">
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(20,92,243,0.10)] rounded-[1.75rem] px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item}
                    to={getPath(item)}
                    onClick={closeMenu}
                    className={`
                      flex items-center justify-between px-5 py-3.5 rounded-xl
                      text-sm font-bold transition-all duration-200
                      ${
                        active
                          ? "text-[#145CF3] bg-[#EBF2FC]"
                          : "text-[#190E0E]/60 hover:text-[#145CF3] hover:bg-[#EBF2FC]/50"
                      }
                    `}
                  >
                    {item}
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-[#145CF3]" />
                    )}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-gray-100 mx-2 my-2" />

              {/* Mobile CTA */}
              <div className="px-2 pb-1">
                {token ? (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center justify-center w-full bg-[#145CF3] text-white py-3.5 rounded-xl font-black text-sm hover:bg-[#1149c2] transition-all shadow-md shadow-[#145CF3]/20"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/donate"
                    onClick={closeMenu}
                    className="flex items-center justify-center w-full bg-[#145CF3] text-white py-3.5 rounded-xl font-black text-sm hover:bg-[#0f4fd4] transition-all shadow-md shadow-[#145CF3]/20"
                  >
                    Donate Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
