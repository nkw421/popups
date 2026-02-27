import { axiosInstance } from "../app/http/axiosInstance";

export function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

export const reviewApi = {
  list: ({ uiPage = 1, size = 10, searchType, keyword } = {}) =>
    axiosInstance.get("/api/reviews", {
      params: {
        page: uiPage - 1,
        size,
        ...(searchType ? { searchType } : {}),
        ...(keyword ? { keyword } : {}),
      },
    }),
  get: (reviewId) => axiosInstance.get(`/api/reviews/${reviewId}`),
};
