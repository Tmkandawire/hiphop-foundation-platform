import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return false;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    if (form.currentPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const loadToast = toast.loading("Updating password...");

    try {
      await axiosInstance.put("/admin/update-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password updated. Please log in again.", {
        id: loadToast,
        duration: 3000,
      });

      // Log out and redirect to login
      setTimeout(async () => {
        await logout();
        navigate("/admin/login", { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password", {
        id: loadToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (show) => `
    w-full bg-gray-50 border border-gray-200 rounded-2xl pl-5 pr-12 py-4
    font-medium text-sm text-[#190E0E] focus:outline-none
    focus:border-[#145CF3] transition-all placeholder:text-gray-300
  `;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* HEADER */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <h1 className="text-4xl font-black text-[#190E0E] tracking-tighter">
          Admin <span className="text-[#145CF3]">Settings</span>
        </h1>
        <p className="text-[#190E0E]/40 mt-1 font-medium italic">
          Manage your account security.
        </p>
      </div>

      {/* PASSWORD SECTION */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-10 py-8 border-b border-gray-50 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#EBF2FC] flex items-center justify-center text-[#145CF3]">
            <Lock size={18} />
          </div>
          <div>
            <h2 className="font-black text-[#190E0E] text-lg">
              Change Password
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              After updating, you will be logged out of all devices.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-10 py-10 space-y-6 max-w-xl"
        >
          {/* Current password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className={inputClass(showCurrent)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#145CF3] transition-colors"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={inputClass(showNew)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#145CF3] transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat new password"
                className={inputClass(showConfirm)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#145CF3] transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Password match indicator */}
          {form.newPassword && form.confirmPassword && (
            <p
              className={`text-xs font-bold ${
                form.newPassword === form.confirmPassword
                  ? "text-green-500"
                  : "text-red-400"
              }`}
            >
              {form.newPassword === form.confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-[#145CF3] hover:bg-[#0f4fd4] text-white font-black rounded-2xl transition-all shadow-lg shadow-[#145CF3]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
