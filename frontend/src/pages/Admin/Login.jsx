import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Admin Login Page
  Handles authentication and saves a token to localStorage
*/

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // FAKE LOGIN LOGIC:
    // In a real app, you would use: axiosInstance.post("/auth/login", { email, password })
    setTimeout(() => {
      // 1. Save a "token" to localStorage
      localStorage.setItem("token", "fake-admin-token-123");

      // 2. Redirect to the dashboard
      setLoading(false);
      navigate("/admin");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleLogin}>
          <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-xs text-center mt-4 text-gray-400">
            Hint: Any email/password will work for this demo.
          </p>
        </form>
      </div>
    </div>
  );
}
