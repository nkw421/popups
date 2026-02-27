import { tokenStore } from "./tokenStore";
import { toast } from "../../pages/admin/shared/Toast";

// refresh는 인터셉터 없는 별도 axios로 호출(무한루프 방지)
import axios from "axios";

let isRefreshing = false;
let refreshQueue = [];

function resolveQueue(error, newAccessToken) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken);
  });
  refreshQueue = [];
}

function pickAccessTokenFromResponse(res) {
  return (
    res?.data?.data?.accessToken ??
    res?.data?.accessToken ??
    res?.data?.data?.access_token ??
    res?.data?.access_token ??
    null
  );
}

/**
 * JWT payload에서 userId를 추출한다.
 */
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

/* ── 401 이벤트 (블러 + 로그인 팝업용) ── */
const AUTH_EXPIRED_EVENT = "pupoo:auth-expired";

export function onAuthExpired(callback) {
  window.addEventListener(AUTH_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, callback);
}

function fireAuthExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

/* ── HTTP 상태별 한국어 에러 메시지 ── */
const ERROR_MESSAGES = {
  400: "요청 형식이 올바르지 않습니다. 입력 내용을 확인해주세요.",
  401: "로그인이 만료되었습니다. 다시 로그인해주세요.",
  403: "접근 권한이 없습니다. 관리자 계정으로 로그인해주세요.",
  404: "요청한 데이터를 찾을 수 없습니다.",
  405: "허용되지 않은 요청입니다.",
  408: "서버 응답 시간이 초과되었습니다. 다시 시도해주세요.",
  409: "이미 존재하는 데이터입니다. 중복 여부를 확인해주세요.",
  413: "파일 또는 데이터 크기가 너무 큽니다. 용량을 줄여주세요.",
  422: "입력값이 올바르지 않습니다. 필수 항목을 확인해주세요.",
  429: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  500: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  502: "서버와 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.",
  503: "서버가 점검 중입니다. 잠시 후 다시 시도해주세요.",
};

/** 상태 코드 → 한국어 메시지 */
function getErrorMessage(status, serverMsg) {
  // 서버에서 보낸 커스텀 메시지가 있으면 우선 사용
  if (serverMsg && typeof serverMsg === "string" && serverMsg.length < 100) {
    return serverMsg;
  }
  return (
    ERROR_MESSAGES[status] || `알 수 없는 오류가 발생했습니다. (${status})`
  );
}

export function attachInterceptors(instance) {
  /* ── 요청 인터셉터 ── */
  instance.interceptors.request.use((config) => {
    const url = config?.url || "";

    // auth 계열은 Authorization을 붙이지 않는다(로그인/refresh/logout/signup/oauth)
    if (url.includes("/api/auth/")) {
      return config;
    }

    const access = tokenStore.getAccess();
    if (access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access}`;

      const userId = getUserIdFromToken(access);
      if (userId) {
        config.headers["X-USER-ID"] = userId;
      }
    }
    return config;
  });

  /* ── 응답 인터셉터 ── */
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const status = err?.response?.status;
      const original = err?.config;

      /* ── 네트워크 에러 (서버 꺼짐, 인터넷 끊김) ── */
      if (!err.response) {
        toast.error(
          "서버와 연결할 수 없습니다. 인터넷 또는 백엔드 상태를 확인해주세요.",
        );
        return Promise.reject(err);
      }

      if (!original) return Promise.reject(err);

      const url = String(original?.url || "");
      const isAuth = url.includes("/api/auth/");

      // 401이 아니거나 auth 요청이면 그대로 실패
      if (status !== 401 || isAuth) {
        return Promise.reject(err);
      }

      // 1회만 재시도
      if (original._retry) {
        tokenStore.clear();
        fireAuthExpired();
        // 401은 팝업으로 처리하므로 토스트 X
        return Promise.reject(err);
      }
      original._retry = true;

      // refresh 진행 중이면 대기열에 걸고 토큰 받으면 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newAccessToken) => {
              original.headers = original.headers || {};
              if (newAccessToken) {
                original.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              resolve(instance(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const baseURL = instance.defaults.baseURL || "";
        const refreshClient = axios.create({
          baseURL,
          withCredentials: true,
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

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(original);
      } catch (refreshErr) {
        tokenStore.clear();
        resolveQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
