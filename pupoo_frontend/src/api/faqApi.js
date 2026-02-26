import { axiosInstance } from "../app/http/axiosInstance";

export const faqApi = {
  list: (uiPage = 1, size = 10) =>
    axiosInstance.get("/api/faqs", { params: { page: uiPage - 1, size } }),
  get: (postId) => axiosInstance.get(`/api/faqs/${postId}`),
};

export const adminFaqApi = {
  create: (payload) => axiosInstance.post("/api/admin/faqs", payload),
  update: (postId, payload) => axiosInstance.patch(`/api/admin/faqs/${postId}`, payload),
  delete: (postId) => axiosInstance.delete(`/api/admin/faqs/${postId}`),
};
