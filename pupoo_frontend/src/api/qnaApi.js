// src/api/qnaApi.js
import { axiosInstance } from "../app/http/axiosInstance";

/* ── 토큰 관리 (noticeApi와 동일) ── */
const TOKEN_KEY = "pupoo_admin_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  if (!token) return {};
  let userId = null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    userId =
      decoded.userId ?? decoded.sub ?? decoded.user_id ?? decoded.id ?? null;
  } catch {}
  const headers = { Authorization: `Bearer ${token}` };
  if (userId) headers["X-USER-ID"] = userId;
  return headers;
}

/* ── 공통 유틸 ── */
export function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

/* ── 사용자용 (QnA.jsx) ── */
export const qnaApi = {
  list: (uiPage = 1, size = 10) =>
    axiosInstance.get("/api/qnas", {
      params: { page: uiPage - 1, size },
      headers: authHeaders(),
    }),

  get: (qnaId) =>
    axiosInstance.get(`/api/qnas/${qnaId}`, { headers: authHeaders() }),

  create: (data) =>
    axiosInstance.post(
      "/api/qnas",
      { title: data.title, content: data.content },
      { headers: authHeaders() },
    ),

  update: (qnaId, data) =>
    axiosInstance.patch(
      `/api/qnas/${qnaId}`,
      { title: data.title, content: data.content },
      { headers: authHeaders() },
    ),

  delete: (qnaId) =>
    axiosInstance.delete(`/api/qnas/${qnaId}`, { headers: authHeaders() }),
};

/* ── 관리자용 (BoardManage) ── */
export const adminQnaApi = {
  list: (uiPage = 1, size = 20) =>
    axiosInstance.get("/api/qnas", {
      params: { page: uiPage - 1, size },
      headers: authHeaders(),
    }),

  get: (qnaId) =>
    axiosInstance.get(`/api/qnas/${qnaId}`, { headers: authHeaders() }),

  create: (data) =>
    axiosInstance.post(
      "/api/qnas",
      { title: data.title, content: data.content },
      { headers: authHeaders() },
    ),

  update: (qnaId, data) =>
    axiosInstance.patch(
      `/api/qnas/${qnaId}`,
      { title: data.title, content: data.content },
      { headers: authHeaders() },
    ),

  delete: (qnaId) =>
    axiosInstance.delete(`/api/qnas/${qnaId}`, { headers: authHeaders() }),

  /** 운영자 답변 등록/수정 */
  answer: (qnaId, content) =>
    axiosInstance.post(
      `/api/qnas/${qnaId}/answer`,
      { content },
      { headers: authHeaders() },
    ),
};
