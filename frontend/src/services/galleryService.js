import axiosInstance from "../api/axiosInstance";

export const galleryService = {
  // GET ALL — supports optional filters e.g. { category: "Outreach" }
  getAll: async (params = {}) => {
    const res = await axiosInstance.get("/gallery", { params });
    return res.data?.data || [];
  },

  // GET ONE
  getById: async (id) => {
    const res = await axiosInstance.get(`/gallery/${id}`);
    return res.data?.data;
  },

  // CREATE
  create: async (formData) => {
    const res = await axiosInstance.post("/gallery", formData);
    return res.data?.data;
  },

  // UPDATE
  update: async (id, formData) => {
    const res = await axiosInstance.put(`/gallery/${id}`, formData);
    return res.data?.data;
  },

  // DELETE
  delete: async (id) => {
    const res = await axiosInstance.delete(`/gallery/${id}`);
    return res.data;
  },

  // TOGGLE FEATURED
  toggleFeatured: async (id) => {
    const res = await axiosInstance.patch(`/gallery/${id}/featured`);
    return res.data?.data;
  },
};
