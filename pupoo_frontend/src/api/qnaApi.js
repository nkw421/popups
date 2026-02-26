// file: src/api/qnaApi.js
import { axiosInstance } from "../app/http/axiosInstance";

/* =========================
 * 토큰 키 (USER/ADMIN 분리)
 * ========================= */
const USER_TOKEN_KEY = "pupoo_user_token";
const ADMIN_TOKEN_KEY = "pupoo_admin_token";

/* =========================
 * Base64URL -> JSON payload 디코딩
 * - JWT payload는 Base64URL 이므로 atob() 직행하면 깨짐
 * - '-' -> '+', '_' -> '/', padding '=' 보정 필요
 * ========================= */
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
    const payloadBase64Url = parts[1];
    const payloadBase64 = base64UrlToBase64(payloadBase64Url);
    if (!payloadBase64) return null;

    const json = atob(payloadBase64);
    const decoded = JSON.parse(json);
    return decoded;
  } catch (e) {
    console.error("[JWT] decode failed:", e);
    return null;
  }
}

/* =========================
 * JWT payload에서 id 추출
 * - Pupoo 백엔드(JJWT) 기본: sub = userId/adminId (문자열)
 * - 그래도 호환 위해 후보 유지
 * ========================= */
function extractIdFromPayload(decoded) {
  if (!decoded) return null;

  const id =
    decoded.sub ??
    decoded.userId ??
    decoded.adminId ??
    decoded.user_id ??
    decoded.admin_id ??
    decoded.id ??
    null;

  // sub가 "31" 처럼 문자열인 경우 숫자로 변환할지 정책 선택 가능
  // header에 string으로 보내도 보통 문제 없으니 그대로 둠
  return id;
}

/* =========================
 * (선택) 만료 체크
 * - exp는 seconds (JWT 표준)
 * ========================= */
function isExpired(decoded) {
  if (!decoded?.exp) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowSec;
}

/* =========================
 * 헤더 생성 공통화
 * - X-USER-ID / X-ADMIN-ID 는 "백엔드가 요구할 때만" 붙임
 * - token 없거나 decode 실패면 Authorization조차 붙이지 않음(정책 선택)
 *   (원하면 Authorization만 붙이도록 바꿀 수 있음)
 * ========================= */
function buildAuthHeaders(tokenKey, idHeaderName) {
  const token = localStorage.getItem(tokenKey);
  if (!token) return {};

  const decoded = parseJwtPayload(token);

  // 토큰 decode 실패해도 Authorization은 붙이고 싶다면 아래 if 제거 가능
  if (!decoded) {
    console.warn("[JWT] payload decode failed; skip auth headers");
    return {};
  }

  // 만료된 access token이면 일단 헤더 안 붙이고 401 흐름으로 유도(선택)
  // (axiosInstance에서 refresh 재시도 구현되어 있으면 자연스럽게 갱신됨)
  if (isExpired(decoded)) {
    console.warn("[JWT] access token expired; skip auth headers");
    return {};
  }

  const id = extractIdFromPayload(decoded);

  const headers = { Authorization: `Bearer ${token}` };
  if (id != null) headers[idHeaderName] = String(id);

  return headers;
}

function userAuthHeaders() {
  return buildAuthHeaders(USER_TOKEN_KEY, "X-USER-ID");
}

function adminAuthHeaders() {
  return buildAuthHeaders(ADMIN_TOKEN_KEY, "X-ADMIN-ID");
}

/* =========================
 * 공통 유틸
 * ========================= */
export function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

/* =========================
 * 사용자용 (Site QnA)
 * - 백엔드: /api/qnas
 * ========================= */
export const qnaApi = {
  list: (uiPage = 1, size = 10) =>
    axiosInstance.get("/api/qnas", {
      params: { page: uiPage - 1, size },
      headers: userAuthHeaders(),
    }),

  get: (qnaId) =>
    axiosInstance.get(`/api/qnas/${qnaId}`, {
      headers: userAuthHeaders(),
    }),

  create: (data) =>
    axiosInstance.post(
      "/api/qnas",
      { title: data.title, content: data.content },
      { headers: userAuthHeaders() }
    ),

  update: (qnaId, data) =>
    axiosInstance.patch(
      `/api/qnas/${qnaId}`,
      { title: data.title, content: data.content },
      { headers: userAuthHeaders() }
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

/* =========================
 * 관리자용 (Admin BoardManage)
 *
 * 정책: ADMIN은 /api/admin/** 로만 접근
 * - 운영자 답변: POST /api/admin/qnas/{qnaId}/answer
 * - list/get/delete는 백엔드에 있을 때만 사용
 * ========================= */
export const adminQnaApi = {
  answer: (qnaId, answerContent) =>
    axiosInstance.post(
      `/api/admin/qnas/${qnaId}/answer`,
      { answerContent },
      { headers: adminAuthHeaders() }
    ),

  list: (uiPage = 1, size = 20) =>
    axiosInstance.get("/api/admin/qnas", {
      params: { page: uiPage - 1, size },
      headers: adminAuthHeaders(),
    }),

  get: (qnaId) =>
    axiosInstance.get(`/api/admin/qnas/${qnaId}`, {
      headers: adminAuthHeaders(),
    }),

  delete: (qnaId) =>
    axiosInstance.delete(`/api/admin/qnas/${qnaId}`, {
      headers: adminAuthHeaders(),
    }),
};