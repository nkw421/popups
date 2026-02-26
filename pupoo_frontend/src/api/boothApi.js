import { axiosInstance } from "../app/http/axiosInstance";

export const boothApi = {
  listByEvent: (eventId, uiPage = 1, size = 20) =>
    axiosInstance.get(`/api/events/${eventId}/booths`, {
      params: { page: uiPage - 1, size },
    }),
  get: (boothId) => axiosInstance.get(`/api/booths/${boothId}`),
};
