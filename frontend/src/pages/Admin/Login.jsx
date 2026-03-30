import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const authToast = toast.loading("Checking credentials...");

    try {
      const res = await axiosInstance.post("/admin/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      if (res.data.accessToken) {
        // Store access token in localStorage
        // Refresh token is automatically stored as httpOnly cookie by the browser
        localStorage.setItem("access_token", res.data.accessToken);
        login(res.data.accessToken);
        toast.success("Access Granted!", { id: authToast });
        navigate(from, { replace: true });
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message || "Invalid username or password";
      toast.error(message, { id: authToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 font-inter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-content mb-4 shadow-lg">
            <span className="text-3xl font-bold">HHF</span>
          </div>
          <h1 className="text-3xl font-bold font-poppins tracking-tight">
            Admin Portal
          </h1>
          <p className="text-base-content/60 mt-2">
            Secure access for Foundation management
          </p>
        </div>

        <div className="card bg-base-100 shadow-2xl rounded-3xl border border-base-300">
          <div className="card-body p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold uppercase text-xs tracking-widest opacity-60">
                    Username
                  </span>
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Admin username"
                  className={`input input-bordered w-full ${
                    errors.username ? "input-error" : ""
                  }`}
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
                {errors.username && (
                  <span className="text-error text-xs mt-1">
                    {errors.username}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold uppercase text-xs tracking-widest opacity-60">
                    Password
                  </span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full ${
                    errors.password ? "input-error" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="text-error text-xs mt-1">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block text-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-base-200 text-center">
              <button
                onClick={() => navigate("/")}
                className="btn btn-ghost btn-sm opacity-50"
              >
                ← Return to Public Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
