// file: src/app/http/axiosInstance.js
import axios from "axios";

/**
 * 기본값은 same-origin("/")으로 둬서
 * - Vite dev: vite.config.js의 /api proxy를 사용
 * - 배포 환경: 리버스 프록시(Nginx 등) 경로 규칙을 그대로 사용
 *
 * 필요할 때만 VITE_API_BASE_URL로 절대 URL을 주입한다.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "/";

// localStorage 키는 qnaApi.js와 동일하게 유지
const USER_TOKEN_KEY = "pupoo_user_token";
const ADMIN_TOKEN_KEY = "pupoo_admin_token";

// 현재 어떤 모드(USER/ADMIN)로 호출하는지 판별이 필요할 때가 있음.
// 여기서는 "admin 요청 경로"면 admin 토큰을 우선 사용하도록 설계.
function selectTokenKeyByRequest(config) {
  const url = config?.url || "";
  if (url.startsWith("/api/admin")) return ADMIN_TOKEN_KEY;
  return USER_TOKEN_KEY;
}

function getToken(tokenKey) {
  return localStorage.getItem(tokenKey);
}

function setToken(tokenKey, token) {
  if (!token) return;
  localStorage.setItem(tokenKey, token);
}

function clearToken(tokenKey) {
  localStorage.removeItem(tokenKey);
}

/* =========================
 * axios instance
 * - withCredentials: true (refresh_token 쿠키 송수신 필수)
 * ========================= */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* =========================
 * Request interceptor
 * - 여기서 Authorization 붙여도 되고,
 * - 네 qnaApi처럼 각 API가 직접 headers 넣는 방식도 가능
 *
 * 권장: 공통으로 붙이면 실수 줄어듦.
 * 단, admin/user 분리 정책이 있으니 URL 보고 토큰 선택.
 * ========================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenKey = selectTokenKeyByRequest(config);

    // 이미 호출부에서 Authorization 지정한 경우 존중
    if (!config.headers?.Authorization) {
      const token = getToken(tokenKey);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
 * Refresh 호출
 * - 백엔드 엔드포인트: /api/auth/refresh (예시)
 * - 응답에서 accessToken 추출 로직은 프로젝트 응답 규격에 맞춤
 * ========================= */
async function refreshAccessToken(tokenKey) {
  // refresh는 쿠키 기반이므로 Authorization 없이도 호출 가능
  const res = await axiosInstance.post("/api/auth/refresh", null, {
    // 혹시 인터셉터가 Authorization 넣는 걸 원치 않으면 아래로 덮어씌울 수 있음
    headers: {},
  });

  // Pupoo 스타일: ApiResponse { data: { accessToken: "..." } } or { data: "..." }
  const token =
    res?.data?.data?.accessToken ??
    res?.data?.data?.token ??
    res?.data?.accessToken ??
    res?.data?.token ??
    null;

  if (!token) {
    throw new Error("Refresh succeeded but no access token returned");
  }

  setToken(tokenKey, token);
  return token;
}

/* =========================
 * Response interceptor (401 -> refresh -> retry)
 * ========================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config;

    // 네트워크 에러 등
    if (!original) return Promise.reject(error);

    const status = error?.response?.status;

    // refresh 자체가 401이면 무한루프 방지
    if (original.url?.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    // 401이면 1회만 refresh 후 retry
    if (status === 401 && !original._retry) {
      original._retry = true;

      const tokenKey = selectTokenKeyByRequest(original);

      try {
        const newToken = await refreshAccessToken(tokenKey);

        // 재시도 요청에 새 토큰 반영
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original);
      } catch (e) {
        // refresh 실패 -> 토큰 정리 (원하면 로그인 페이지로 보내기)
        clearToken(tokenKey);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
