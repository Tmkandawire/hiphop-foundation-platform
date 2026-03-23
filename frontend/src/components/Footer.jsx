import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#145CF3] rounded-lg flex items-center justify-center text-white font-black text-sm">
                H
              </div>
              <span className="font-poppins font-black text-xl tracking-tight text-[#190E0E]">
                HHF<span className="text-[#145CF3]">.</span>
              </span>
            </Link>
            <p className="text-[#190E0E]/50 text-sm leading-relaxed max-w-xs">
              Empowering Malawian youth through hiphop, culture, and sustainable
              development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#190E0E] mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-[#190E0E]/60">
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#145CF3] transition-colors"
                >
                  Our Products
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-[#145CF3] transition-colors"
                >
                  Foundation News
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#145CF3] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal/Support */}
          <div>
            <h4 className="font-bold text-[#190E0E] mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-[#190E0E]/60">
              <li>
                <Link to="#" className="hover:text-[#145CF3] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#145CF3] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="hover:text-[#145CF3] transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter/Social - High Tech Accent */}
          <div>
            <h4 className="font-bold text-[#190E0E] mb-6">Stay Connected</h4>
            <div className="flex gap-4">
              {/* Replace with actual social icons later */}
              <div className="w-10 h-10 rounded-full bg-[#EBF2FC] flex items-center justify-center text-[#145CF3] cursor-pointer hover:bg-[#145CF3] hover:text-white transition-all">
                FB
              </div>
              <div className="w-10 h-10 rounded-full bg-[#EBF2FC] flex items-center justify-center text-[#145CF3] cursor-pointer hover:bg-[#145CF3] hover:text-white transition-all">
                IG
              </div>
              <div className="w-10 h-10 rounded-full bg-[#EBF2FC] flex items-center justify-center text-[#145CF3] cursor-pointer hover:bg-[#145CF3] hover:text-white transition-all">
                YT
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-[#190E0E]/30 tracking-widest uppercase">
            © {currentYear} HIPHOP FOUNDATION MALAWI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#190E0E]/40 uppercase tracking-tighter">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
