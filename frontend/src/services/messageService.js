import axiosInstance from "../api/axiosInstance";

export const messageService = {
  // Public: Send from Contact Form
  send: async (messageData) => {
    const res = await axiosInstance.post("/messages", messageData);
    return res.data;
  },

  // Admin: Fetch messages by folder (inbox, sent, or trash)
  getAll: async (folder = "inbox") => {
    const res = await axiosInstance.get(`/messages?status=${folder}`);
    return res.data?.data || [];
  },

  // Admin: Send a reply (Moves to Sent)
  reply: async (id, replyContent) => {
    const res = await axiosInstance.post(`/messages/${id}/reply`, {
      replyContent,
    });
    return res.data;
  },

  // Admin: Soft Delete (Move to Trash)
  moveToTrash: async (id) => {
    const res = await axiosInstance.patch(`/messages/${id}/trash`);
    return res.data;
  },

  // Admin: Permanent Delete
  purge: async (id) => {
    const res = await axiosInstance.delete(`/messages/${id}/purge`);
    return res.data;
  },
};
