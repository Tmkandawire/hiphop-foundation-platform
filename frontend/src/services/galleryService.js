import axiosInstance from "../api/axiosInstance";

export const galleryService = {
  // ─── GET ALL ─────────────────────────────────────────────────────
  // Supports optional filters e.g. { category: "Outreach", mediaType: "video" }
  getAll: async (params = {}) => {
    try {
      const res = await axiosInstance.get("/gallery", { params });
      return res.data?.data || [];
    } catch (error) {
      console.error("Gallery getAll error:", error.message);
      return [];
    }
  },

  // ─── GET ONE ─────────────────────────────────────────────────────
  getById: async (id) => {
    const res = await axiosInstance.get(`/gallery/${id}`);
    return res.data?.data;
  },

  // ─── CREATE ──────────────────────────────────────────────────────
  // FormData must include: title, media file
  // Optional: description, category, featured
  create: async (formData) => {
    const res = await axiosInstance.post("/gallery", formData);
    return res.data?.data;
  },

  // ─── UPDATE ──────────────────────────────────────────────────────
  update: async (id, formData) => {
    const res = await axiosInstance.put(`/gallery/${id}`, formData);
    return res.data?.data;
  },

  // ─── DELETE ──────────────────────────────────────────────────────
  delete: async (id) => {
    const res = await axiosInstance.delete(`/gallery/${id}`);
    return res.data;
  },

  // ─── TOGGLE FEATURED ─────────────────────────────────────────────
  toggleFeatured: async (id) => {
    const res = await axiosInstance.patch(`/gallery/${id}/featured`);
    return res.data?.data;
  },

  // ─── GET BY CATEGORY ─────────────────────────────────────────────
  // Convenience method for filtered fetches on the public gallery page
  getByCategory: async (category) => {
    const res = await axiosInstance.get("/gallery", {
      params: { category },
    });
    return res.data?.data || [];
  },

  // ─── GET IMAGES ONLY ─────────────────────────────────────────────
  getImages: async () => {
    const res = await axiosInstance.get("/gallery", {
      params: { mediaType: "image" },
    });
    return res.data?.data || [];
  },

  // ─── GET VIDEOS ONLY ─────────────────────────────────────────────
  getVideos: async () => {
    const res = await axiosInstance.get("/gallery", {
      params: { mediaType: "video" },
    });
    return res.data?.data || [];
  },
};
