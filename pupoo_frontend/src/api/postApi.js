import { axiosInstance } from "../app/http/axiosInstance";

export function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

export const postApi = {
  list: ({ boardId, uiPage = 1, size = 10, searchType, keyword }) =>
    axiosInstance.get("/api/posts", {
      params: {
        boardId,
        page: uiPage - 1,
        size,
        ...(searchType ? { searchType } : {}),
        ...(keyword ? { keyword } : {}),
      },
    }),
  get: (postId) => axiosInstance.get(`/api/posts/${postId}`),
};
