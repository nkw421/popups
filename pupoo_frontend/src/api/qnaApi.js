// file: src/api/qnaApi.js
import { axiosInstance } from "../app/http/axiosInstance";

const USER_TOKEN_KEY = "pupoo_user_token";
const ADMIN_TOKEN_KEY = "pupoo_admin_token";

function base64UrlToBase64(base64Url) {
  if (!base64Url) return null;
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  return base64;
}

function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payloadBase64 = base64UrlToBase64(parts[1]);
    if (!payloadBase64) return null;
    return JSON.parse(atob(payloadBase64));
  } catch (e) {
    console.error("[JWT] decode failed:", e);
    return null;
  }
}

function buildAuthHeaders(tokenKey, idHeaderName) {
  const token = localStorage.getItem(tokenKey);
  if (!token) return {};

  const decoded = parseJwtPayload(token);
  if (!decoded) return { Authorization: `Bearer ${token}` };

  const subjectId =
    decoded.sub ??
    decoded.userId ??
    decoded.adminId ??
    decoded.user_id ??
    decoded.admin_id ??
    decoded.id ??
    null;

  const headers = { Authorization: `Bearer ${token}` };
  if (subjectId != null) headers[idHeaderName] = String(subjectId);
  return headers;
}

function userAuthHeaders() {
  return buildAuthHeaders(USER_TOKEN_KEY, "X-USER-ID");
}

function adminAuthHeaders() {
  return buildAuthHeaders(ADMIN_TOKEN_KEY, "X-ADMIN-ID");
}

export function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

export const qnaApi = {
  list: (uiPage = 1, size = 10) =>
    axiosInstance.get("/api/qnas", {
      params: { page: uiPage - 1, size },
    }),

  get: (qnaId) => axiosInstance.get(`/api/qnas/${qnaId}`),

  create: (data) =>
    axiosInstance.post(
      "/api/qnas",
      { title: data.title, content: data.content },
      { headers: userAuthHeaders() },
    ),

  update: (qnaId, data) =>
    axiosInstance.patch(
      `/api/qnas/${qnaId}`,
      { title: data.title, content: data.content },
      { headers: userAuthHeaders() },
    ),

  delete: (qnaId) =>
    axiosInstance.delete(`/api/qnas/${qnaId}`, {
      headers: userAuthHeaders(),
    }),

  close: (qnaId) =>
    axiosInstance.post(`/api/qnas/${qnaId}/close`, null, {
      headers: userAuthHeaders(),
    }),
};

export const adminQnaApi = {
  // AdminQnaController: POST /api/admin/qnas/{qnaId}/answer
  answer: (qnaId, answerContent) =>
    axiosInstance.post(
      `/api/admin/qnas/${qnaId}/answer`,
      { answerContent },
      { headers: adminAuthHeaders() },
    ),

  // 목록/상세는 공개 API 재사용
  list: (uiPage = 1, size = 20) =>
    axiosInstance.get("/api/qnas", {
      params: { page: uiPage - 1, size },
    }),

  get: (qnaId) => axiosInstance.get(`/api/qnas/${qnaId}`),
};
