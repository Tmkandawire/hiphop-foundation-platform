import axios from "axios";

/**
 * Industry Standard Axios Instance
 * Features:
 * 1. Automatic Base URL management
 * 2. Automatic JWT Injection (Request Interceptor)
 * 3. Automatic Session Cleanup on 401 errors (Response Interceptor)
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ✅ 1. REQUEST INTERCEPTOR: The "Passport Control"
// Automatically adds the token to every request from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ✅ 2. RESPONSE INTERCEPTOR: The "Session Guard"
// This is the part your current file was missing.
// It catches 401 (Unauthorized) errors globally.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401, the token is dead/expired
    if (error.response && error.response.status === 401) {
      // Clear the local storage so the user is truly logged out
      localStorage.removeItem("auth_token");

      // Force a redirect to the login page
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
