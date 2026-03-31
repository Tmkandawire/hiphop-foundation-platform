import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    // Clear lock message when user starts typing
    if (isLocked) {
      setIsLocked(false);
      setLockMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setIsLocked(false);
    setLockMessage("");
    const authToast = toast.loading("Checking credentials...");

    try {
      const res = await axiosInstance.post("/admin/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      if (res.data.accessToken) {
        // ✅ Store access token — refresh token is set as
        // httpOnly cookie automatically by the browser
        localStorage.setItem("access_token", res.data.accessToken);
        login(res.data.accessToken);
        toast.success("Access Granted!", { id: authToast });
        navigate(from, { replace: true });
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error("Login error:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message;
      const code = err.response?.data?.code;

      // ✅ Handle account locked specifically
      if (status === 423 || code === "ACCOUNT_LOCKED") {
        setIsLocked(true);
        setLockMessage(message || "Account locked. Too many failed attempts.");
        toast.error("Account locked", { id: authToast });
        return;
      }

      // ✅ Handle too many requests from rate limiter
      if (status === 429) {
        toast.error(
          message || "Too many login attempts. Please wait and try again.",
          { id: authToast },
        );
        return;
      }

      // All other errors
      toast.error(message || "Invalid username or password", {
        id: authToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FB] p-4 font-inter">
      <div className="w-full max-w-md space-y-6">
        {/* Logo + Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#145CF3] text-white mb-2 shadow-lg shadow-[#145CF3]/20">
            <span className="text-2xl font-black">HHF</span>
          </div>
          <h1 className="text-3xl font-black font-poppins tracking-tight text-[#190E0E]">
            Admin Portal
          </h1>
          <p className="text-gray-400 text-sm">
            Secure access for Foundation management
          </p>
        </div>

        {/* Account Locked Banner */}
        {isLocked && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">!</span>
            </div>
            <div>
              <p className="text-red-600 font-black text-sm">Account Locked</p>
              <p className="text-red-400 text-xs mt-0.5 leading-relaxed">
                {lockMessage}
              </p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5 p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="admin-username"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Username
              </label>
              <input
                id="admin-username"
                name="username"
                type="text"
                placeholder="Admin username"
                className={`w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-medium text-[#190E0E] focus:outline-none focus:border-[#145CF3] focus:ring-4 focus:ring-[#145CF3]/8 transition-all placeholder:text-gray-300 ${
                  errors.username
                    ? "border-red-300 bg-red-50/30"
                    : "border-gray-200"
                }`}
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />
              {errors.username && (
                <p className="text-red-400 text-xs font-bold ml-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={`w-full bg-gray-50 border rounded-2xl px-5 py-4 text-sm font-medium text-[#190E0E] focus:outline-none focus:border-[#145CF3] focus:ring-4 focus:ring-[#145CF3]/8 transition-all placeholder:text-gray-300 ${
                  errors.password
                    ? "border-red-300 bg-red-50/30"
                    : "border-gray-200"
                }`}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-400 text-xs font-bold ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-4 bg-[#145CF3] hover:bg-[#0f4fd4] text-white font-black rounded-2xl transition-all shadow-lg shadow-[#145CF3]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Verifying...
                </span>
              ) : isLocked ? (
                "Account Locked"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Return to site */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-xs font-bold text-gray-300 hover:text-[#145CF3] transition-colors uppercase tracking-widest"
            >
              ← Return to Public Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
