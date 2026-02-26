import { tokenStore } from "./tokenStore";

/**
 * JWT payload에서 userId를 추출한다.
 * JWT 구조: header.payload.signature (각각 base64url 인코딩)
 */
function getUserIdFromToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    // 일반적으로 userId, sub, user_id, id 중 하나에 들어있음
    return (
      decoded.userId ?? decoded.sub ?? decoded.user_id ?? decoded.id ?? null
    );
  } catch {
    return null;
  }
}

export function attachInterceptors(instance) {
  instance.interceptors.request.use((config) => {
    const url = config?.url || "";

    // auth 계열은 Authorization 헤더를 붙이지 않는다
    if (url.includes("/api/auth/")) {
      return config;
    }

    const access = tokenStore.getAccess();
    if (access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access}`;

      // X-USER-ID 헤더 추가 (백엔드 컨트롤러에서 요구)
      const userId = getUserIdFromToken(access);
      if (userId) {
        config.headers["X-USER-ID"] = userId;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const status = err?.response?.status;
      const original = err?.config;
      if (!original) return Promise.reject(err);

      const url = original?.url || "";
      const isAuth = url.includes("/api/auth/");

      if (status !== 401 || isAuth) {
        return Promise.reject(err);
      }

      if (original._retry) {
        tokenStore.clear();
        return Promise.reject(err);
      }

      tokenStore.clear();
      return Promise.reject(err);
    },
  );
}
