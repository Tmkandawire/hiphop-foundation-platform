import axiosInstance from "../api/axiosInstance";

export const postService = {
  getAll: async () => {
    const res = await axiosInstance.get("/posts");
    const data = res.data?.posts || res.data?.data || res.data;
    return Array.isArray(data) ? data : [];
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/posts/${id}`);
    return res.data?.post || res.data?.data || res.data;
  },

  create: async (formData) => {
    // FIX: Removed manual Content-Type header
    return await axiosInstance.post("/admin/posts", formData);
  },

  update: async (id, formData) => {
    // FIX: Removed manual Content-Type header
    return await axiosInstance.put(`/admin/posts/${id}`, formData);
  },

  delete: async (id) => {
    return await axiosInstance.delete(`/admin/posts/${id}`);
  },
};
