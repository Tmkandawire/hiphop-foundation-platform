import axiosInstance from "../api/axiosInstance";

export const productService = {
  // GET ALL
  getAll: async () => {
    const res = await axiosInstance.get("/products");
    return res.data.data || [];
  },

  // GET ONE
  getOne: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data.data;
  },

  // CREATE
  create: async (formData) => {
    // FIX: Remove manual headers. Axios will handle the boundary automatically.
    const res = await axiosInstance.post("/products", formData);
    return res.data.data;
  },

  // UPDATE
  update: async (id, formData) => {
    // FIX: Remove manual headers here too.
    const res = await axiosInstance.put(`/products/${id}`, formData);
    return res.data.data;
  },

  // DELETE
  delete: async (id) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },
};
