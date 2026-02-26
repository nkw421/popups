import { axiosInstance } from "../app/http/axiosInstance";

export const paymentApi = {
  create: (eventId, payload) => axiosInstance.post(`/api/events/${eventId}/payments`, payload),
  myList: (uiPage = 1, size = 10) => axiosInstance.get("/api/payments/my", { params: { page: uiPage - 1, size } }),
  approve: (paymentId, params) => axiosInstance.get(`/api/payments/${paymentId}/approve`, { params }),
  cancel: (paymentId, payload) => axiosInstance.post(`/api/payments/${paymentId}/cancel`, payload),
};

export const adminPaymentApi = {
  list: (uiPage = 1, size = 20) => axiosInstance.get("/api/admin/payments", { params: { page: uiPage - 1, size } }),
  get: (id) => axiosInstance.get(`/api/admin/payments/${id}`),
};
