import axios from "axios";
import { tokenStore } from "./tokenStore";

// ============================
// Public GET (token not required)
// ============================
const PUBLIC_GET_PREFIXES = [
  "/api/posts",
  "/api/qnas",
  "/api/notices",
  "/api/reviews",
  "/api/faqs",
  "/api/events",
  "/api/programs",
  "/api/speakers",
  "/api/booths",
  "/api/galleries",
  "/api/replies",
];

function isPublicGetRequest(config) {
  const method = (config?.method || "get").toLowerCase();
  if (method !== "get") return false;

  const url = String(config?.url || "");
  return PUBLIC_GET_PREFIXES.some(
    (prefix) => url === prefix || url.startsWith(`${prefix}/`),
  );
}

// ============================
// Auth expired event (UI hook)
// ============================
const AUTH_EXPIRED_EVENT = "pupoo:auth-expired";

export function onAuthExpired(callback) {
  window.addEventListener(AUTH_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, callback);
}

function fireAuthExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

// ============================
// Helpers
// ============================
function pickAccessTokenFromResponse(res) {
  return (
    res?.data?.data?.accessToken ??
    res?.data?.accessToken ??
    res?.data?.data?.access_token ??
    res?.data?.access_token ??
    null
  );
}

// (선택) JWT payload에서 userId 추출 → X-USER-ID 헤더로 전달
function getUserIdFromToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return (
      decoded.userId ?? decoded.sub ?? decoded.user_id ?? decoded.id ?? null
    );
  } catch {
    return null;
  }
}

// (선택) 상태별 메시지
const ERROR_MESSAGES = {
  400: "요청 형식이 올바르지 않습니다.",
  401: "로그인이 만료되었습니다. 다시 로그인해주세요.",
  403: "접근 권한이 없습니다.",
  404: "요청한 데이터를 찾을 수 없습니다.",
  409: "이미 존재하는 데이터입니다.",
  422: "입력값이 올바르지 않습니다.",
  429: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  500: "서버에 문제가 발생했습니다.",
  502: "서버와 연결할 수 없습니다.",
  503: "서버가 점검 중입니다.",
};

function getErrorMessage(status, serverMsg) {
  if (serverMsg && typeof serverMsg === "string" && serverMsg.length < 120) {
    return serverMsg;
  }
  return ERROR_MESSAGES[status] || `오류가 발생했습니다. (${status})`;
}

function showError(msg) {
  console.warn("[PUPOO]", msg);
}

function isPublicPath(url, publicPathPrefixes = []) {
  return publicPathPrefixes.some((prefix) => url.startsWith(prefix));
}

// ============================
// Single-flight refresh lock + queue
// ============================
let isRefreshing = false;
let refreshQueue = [];

function resolveQueue(error, newAccessToken) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken);
  });
  refreshQueue = [];
}

/**
 * attachInterceptors
 * @param {import("axios").AxiosInstance} instance
 * @param {{ publicPathPrefixes?: string[] }} options
 */
export function attachInterceptors(instance, options = {}) {
  const publicPathPrefixes = options.publicPathPrefixes || ["/api/auth/"];

  // ============================
  // Request interceptor
  // ============================
  instance.interceptors.request.use((config) => {
    const url = String(config?.url || "");

    // 공개 엔드포인트는 토큰 붙이지 않음 (login/refresh/logout/signup/oauth 등)
    if (isPublicPath(url, publicPathPrefixes)) return config;

    // 공개 GET 엔드포인트는 Authorization 헤더 생략
    if (isPublicGetRequest(config)) return config;

    const access = tokenStore.getAccess();
    if (access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access}`;

      // (선택) 서버가 사용한다면 유지
      const userId = getUserIdFromToken(access);
      if (userId) config.headers["X-USER-ID"] = String(userId);
    }

    return config;
  });

  // ============================
  // Response interceptor
  // ============================
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const original = err?.config;
      const status = err?.response?.status;

      // 네트워크/서버 다운 등(response 자체가 없음)
      if (!err?.response) {
        showError("서버와 연결할 수 없습니다.");
        return Promise.reject(err);
      }
      if (!original) return Promise.reject(err);

      const url = String(original?.url || "");
      const isAuth = isPublicPath(url, publicPathPrefixes);

      // 401이 아니거나, auth 요청이면 그대로 실패
      if (status !== 401 || isAuth) {
        if (status && status >= 400) {
          const serverMsg = err?.response?.data?.message || null;
          showError(getErrorMessage(status, serverMsg));
        }
        return Promise.reject(err);
      }

      // 401: refresh 1회만 시도 (무한루프 방지)
      if (original._retry) {
        tokenStore.clear();
        fireAuthExpired();
        return Promise.reject(err);
      }
      original._retry = true;

      // refresh 진행 중이면 큐에 걸고 토큰 받으면 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newAccessToken) => {
              original.headers = original.headers || {};
              if (newAccessToken) {
                original.headers.Authorization = `Bearer ${newAccessToken}`;
                const uid = getUserIdFromToken(newAccessToken);
                if (uid) original.headers["X-USER-ID"] = String(uid);
              }
              resolve(instance(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // ✅ refresh는 인터셉터 없는 별도 axios로 호출(무한루프 방지)
        const baseURL = instance.defaults.baseURL || "";
        const refreshClient = axios.create({
          baseURL,
          withCredentials: true, // refresh_token(HttpOnly 쿠키) 포함
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
        });

        const refreshRes = await refreshClient.post("/api/auth/refresh", null);
        const newAccessToken = pickAccessTokenFromResponse(refreshRes);
        if (!newAccessToken) {
          throw new Error("Refresh succeeded but accessToken missing");
        }

        tokenStore.setAccess(newAccessToken);
        resolveQueue(null, newAccessToken);

        // 원 요청 재시도
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        const uid = getUserIdFromToken(newAccessToken);
        if (uid) original.headers["X-USER-ID"] = String(uid);

        return instance(original);
      } catch (refreshErr) {
        tokenStore.clear();
        resolveQueue(refreshErr, null);
        fireAuthExpired(); // UI에서 로그인 팝업/블러 처리 가능
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
