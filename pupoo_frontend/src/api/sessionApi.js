// src/api/sessionApi.js
// ─────────────────────────────────────────────────────────
// 세션/강연 API  (QnA·공지사항 패턴 동일)
// ─────────────────────────────────────────────────────────
// 세션은 별도 테이블이 아니라 event_program (category='SESSION') 입니다.
// 조회: /api/events/{eventId}/programs?category=SESSION
// 관리: /api/admin/programs  (ProgramAdminController)
// ─────────────────────────────────────────────────────────
import { axiosInstance } from "../app/http/axiosInstance";

/* ── 토큰 관리 (qnaApi / noticeApi 와 동일) ── */
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

/* ══════════════════════════════════════════════
   사용자용 (Session.jsx — 홈페이지)
   ══════════════════════════════════════════════ */
export const sessionApi = {
  /**
   * 세션 목록 조회
   * GET /api/events/{eventId}/programs?category=SESSION
   */
  list: (eventId, uiPage = 1, size = 50) =>
    axiosInstance.get(`/api/events/${eventId}/programs`, {
      params: { category: "SESSION", page: uiPage - 1, size },
    }),

  /**
   * 세션 상세 조회
   * GET /api/programs/{programId}
   */
  get: (programId) => axiosInstance.get(`/api/programs/${programId}`),

  /**
   * 세션 연사 목록
   * GET /api/programs/{programId}/speakers
   */
  getSpeakers: (programId) =>
    axiosInstance.get(`/api/programs/${programId}/speakers`),
};

/* ══════════════════════════════════════════════
   관리자용 (SessionManage.jsx — 대시보드)
   ══════════════════════════════════════════════ */
export const adminSessionApi = {
  /**
   * 세션 목록 (관리자)
   * GET /api/events/{eventId}/programs?category=SESSION
   */
  list: (eventId, uiPage = 1, size = 50) =>
    axiosInstance.get(`/api/events/${eventId}/programs`, {
      params: { category: "SESSION", page: uiPage - 1, size },
      headers: authHeaders(),
    }),

  /**
   * 세션 상세 (관리자)
   * GET /api/programs/{programId}
   */
  get: (programId) =>
    axiosInstance.get(`/api/programs/${programId}`, {
      headers: authHeaders(),
    }),

  /**
   * 세션 등록
   * POST /api/admin/programs
   * body: ProgramCreateRequest { eventId, category, programTitle, description, startAt, endAt, boothId }
   */
  create: (data) =>
    axiosInstance.post("/api/admin/programs", data, {
      headers: authHeaders(),
    }),

  /**
   * 세션 수정
   * PATCH /api/admin/programs/{programId}
   * body: ProgramUpdateRequest { category, programTitle, description, startAt, endAt, boothId }
   */
  update: (programId, data) =>
    axiosInstance.patch(`/api/admin/programs/${programId}`, data, {
      headers: authHeaders(),
    }),

  /**
   * 세션 삭제
   * DELETE /api/admin/programs/{programId}
   */
  delete: (programId) =>
    axiosInstance.delete(`/api/admin/programs/${programId}`, {
      headers: authHeaders(),
    }),

  /**
   * 연사 목록 (관리자)
   * GET /api/programs/{programId}/speakers
   */
  getSpeakers: (programId) =>
    axiosInstance.get(`/api/programs/${programId}/speakers`, {
      headers: authHeaders(),
    }),
};
