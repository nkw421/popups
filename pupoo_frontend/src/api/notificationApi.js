import { axiosInstance } from "../app/http/axiosInstance";

export const notificationApi = {
  list: (uiPage = 1, size = 20) => axiosInstance.get("/api/notifications", { params: { page: uiPage - 1, size } }),
  click: (inboxId) => axiosInstance.post(`/api/notifications/${inboxId}/click`),
  getSettings: () => axiosInstance.get("/api/notifications/settings"),
  updateSettings: (payload) => axiosInstance.put("/api/notifications/settings", payload),
};

export const adminNotificationApi = {
  sendEvent: (payload) => axiosInstance.post("/api/admin/notifications/event", payload),
};
