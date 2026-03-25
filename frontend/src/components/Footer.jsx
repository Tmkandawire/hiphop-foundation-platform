import { Link } from "react-router-dom";

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const platformLinks = [
  //{ label: "Our Products", to: "/products" },// Placeholder for future product page
  { label: "Foundation News", to: "/blog" },
  { label: "Gallery", to: "/gallery" },
  { label: "Donate", to: "/donate" },
  { label: "Contact Us", to: "/contact" },
];

const resourceLinks = [
  { label: "About Us", to: "#" },
  { label: "Our Mission", to: "#" },
  { label: "Get Involved", to: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Service", to: "#" },
  { label: "Cookie Settings", to: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="border border-gray-200 rounded-[2.5rem] p-10 md:p-14 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* BRAND */}
            <div className="md:col-span-4 space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#145CF3] rounded-xl flex items-center justify-center text-white font-black text-xs">
                  HHF
                </div>
                <span className="font-poppins font-black text-lg tracking-tight text-[#190E0E]">
                  Hip Hop Foundation
                  <span className="text-[#145CF3]">.</span>
                </span>
              </Link>
              <p className="text-[#190E0E]/70 text-sm leading-relaxed max-w-xs">
                Empowering Malawian youth through hip hop, culture, and
                sustainable development.
              </p>

              {/* SOCIAL ICONS */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#145CF3] hover:text-[#145CF3] transition-all"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#145CF3] hover:text-[#145CF3] transition-all"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#145CF3] hover:text-[#145CF3] transition-all"
                >
                  <TikTokIcon />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#145CF3] hover:text-[#145CF3] transition-all"
                >
                  <YouTubeIcon />
                </a>
              </div>
            </div>

            <div className="hidden md:block md:col-span-1" />

            {/* LINKS COLUMNS */}
            <div className="md:col-span-2 space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#190E0E]">
                Platform
              </h4>
              <ul className="space-y-4">
                {platformLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#190E0E]/70 hover:text-[#145CF3] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#190E0E]">
                Resources
              </h4>
              <ul className="space-y-4">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#190E0E]/70 hover:text-[#145CF3] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-5">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#190E0E]">
                Legal
              </h4>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#190E0E]/70 hover:text-[#145CF3] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#190E0E]/50 tracking-widest uppercase">
              © {currentYear} Hip Hop Foundation Malawi. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-xs text-[#190E0E]/50 hover:text-[#145CF3] transition-colors underline underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
