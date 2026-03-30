import axios from "axios";

/**
 * Production-grade Axios Instance
 * Features:
 * 1. Automatic Base URL management
 * 2. Automatic JWT injection on every request
 * 3. Silent token refresh on TOKEN_EXPIRED
 * 4. Request queue during refresh (race condition protection)
 * 5. Automatic session cleanup on unrecoverable 401s
 * 6. withCredentials for httpOnly refresh token cookie
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ← Critical: sends httpOnly cookie on every request
});

/* -------------------------
   REFRESH STATE MANAGEMENT
   Prevents multiple simultaneous
   refresh calls (race condition)
------------------------- */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/* -------------------------
   REQUEST INTERCEPTOR
   Injects access token into
   every outgoing request
------------------------- */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* -------------------------
   RESPONSE INTERCEPTOR
   Handles token expiry silently
   without the user noticing
------------------------- */
axiosInstance.interceptors.response.use(
  // Pass successful responses straight through
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Don't retry if there's no response (network error)
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    /* ── SILENT REFRESH ──────────────────────────────
       Only trigger if:
       1. Status is 401
       2. Backend says TOKEN_EXPIRED (not invalid)
       3. We haven't already retried this request
    ------------------------------------------------- */
    const isTokenExpired =
      status === 401 &&
      data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry;

    if (isTokenExpired) {
      originalRequest._retry = true;

      // If a refresh is already in progress queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint — httpOnly cookie is sent automatically
        const res = await axiosInstance.get("/admin/refresh");
        const newToken = res.data.accessToken;

        // Store new access token
        localStorage.setItem("access_token", newToken);

        // Update default header for future requests
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Resolve all queued requests with new token
        processQueue(null, newToken);

        // Retry the original request that triggered the refresh
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");

        console.error(
          "Critical: Silent refresh failed or session compromised.",
        );

        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login?message=session_expired";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /* ── INVALID TOKEN ───────────────────────────────
       Token was tampered with or malformed
       Force immediate logout
    ------------------------------------------------- */
    if (status === 401 && data?.code === "TOKEN_INVALID") {
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
      return Promise.reject(error);
    }

    /* ── ACCOUNT LOCKED ──────────────────────────────
       Show the error but don't redirect
       Login page will display the message
    ------------------------------------------------- */
    if (status === 403 && data?.code === "ACCOUNT_LOCKED") {
      return Promise.reject(error);
    }

    /* ── NO TOKEN ────────────────────────────────────
       Request made without any token
       Redirect to login
    ------------------------------------------------- */
    if (status === 401 && data?.code === "NO_TOKEN") {
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
      return Promise.reject(error);
    }

    // All other errors pass through normally
    return Promise.reject(error);
  },
);

export default axiosInstance;
