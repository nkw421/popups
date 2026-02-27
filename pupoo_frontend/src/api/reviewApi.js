import { axiosInstance } from "../app/http/axiosInstance";
import { unwrapApiResponse } from "../app/http/apiResponse";

export function unwrap(res) {
  return unwrapApiResponse(res?.data);
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
