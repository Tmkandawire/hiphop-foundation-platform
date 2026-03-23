import axiosInstance from "../api/axiosInstance";

export const adminService = {
  getStats: async () => {
    // This hits your router.get("/stats", protectAdmin, getDashboardStats)
    const res = await axiosInstance.get("/admin/stats");
    return res.data; // Should return { productCount, postCount, messageCount, etc. }
  },

  getActivity: async () => {
    // This hits your router.get("/activity", protectAdmin, getActivityLogs)
    const res = await axiosInstance.get("/admin/activity");
    return res.data;
  },
};
