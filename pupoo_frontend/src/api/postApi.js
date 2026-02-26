import { axiosInstance } from "../app/http/axiosInstance";

export const postApi = {
  list: (uiPage = 1, size = 10) => axiosInstance.get("/api/posts", { params: { page: uiPage - 1, size } }),
  get: (postId) => axiosInstance.get(`/api/posts/${postId}`),
  create: (payload) => axiosInstance.post("/api/posts", payload),
  update: (postId, payload) => axiosInstance.put(`/api/posts/${postId}`, payload),
  delete: (postId) => axiosInstance.delete(`/api/posts/${postId}`),
  close: (postId) => axiosInstance.patch(`/api/posts/${postId}/close`),
  report: (postId, payload) => axiosInstance.post(`/api/posts/${postId}/report`, payload),
};

export const adminPostApi = {
  softDelete: (postId) => axiosInstance.patch(`/api/admin/posts/${postId}/delete`),
};
