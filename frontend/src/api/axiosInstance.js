// src/api/axiosInstance.js
import axios from "axios";

/*
 Axios instance with:
 - Base URL from environment variables
 - JSON headers
 - JWT token automatically added if present
*/

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically for all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token"); // token saved after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
