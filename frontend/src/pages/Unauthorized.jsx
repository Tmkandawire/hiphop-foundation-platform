import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB] px-6 text-center">
      <h1 className="text-6xl font-black text-gray-200 mb-4">403</h1>

      <h2 className="text-2xl font-bold text-[#190E0E] mb-2">Access Denied</h2>

      <p className="text-gray-500 max-w-md mb-6">
        You don't have permission to access this page.
      </p>

      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-[#145CF3] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-[#145CF3]/20 hover:scale-105 transition"
        >
          Home
        </Link>

        <Link
          to="/admin/login"
          className="text-[#145CF3] font-bold border-b-2 border-[#145CF3] pb-1 hover:opacity-70 transition"
        >
          Switch Account
        </Link>
      </div>
    </div>
  );
}
