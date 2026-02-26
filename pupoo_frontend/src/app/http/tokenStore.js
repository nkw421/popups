const USER_ACCESS_KEY = "pupoo_user_token";
const ADMIN_ACCESS_KEY = "pupoo_admin_token";

// 레거시 키(과거 코드 호환)
const LEGACY_ACCESS_KEY = "pupoo_access_token";
const LEGACY_REFRESH_KEY = "pupoo_refresh_token";

function readFirst(...keys) {
  for (const key of keys) {
    const v = localStorage.getItem(key);
    if (v) return v;
  }
  return null;
}

export const tokenStore = {
  // site(사용자) 기본 접근 토큰
  getAccess() {
    return readFirst(USER_ACCESS_KEY, LEGACY_ACCESS_KEY);
  },

  // admin 접근 토큰
  getAdminAccess() {
    return localStorage.getItem(ADMIN_ACCESS_KEY);
  },

  // refresh_token은 HttpOnly Cookie 정책이 기본이므로
  // localStorage refresh 키는 레거시 읽기 전용으로만 남긴다.
  getRefresh() {
    return localStorage.getItem(LEGACY_REFRESH_KEY);
  },

  setAccess(accessToken) {
    if (accessToken) localStorage.setItem(USER_ACCESS_KEY, accessToken);
  },

  setAdminAccess(accessToken) {
    if (accessToken) localStorage.setItem(ADMIN_ACCESS_KEY, accessToken);
  },

  setRefresh(refreshToken) {
    if (refreshToken) localStorage.setItem(LEGACY_REFRESH_KEY, refreshToken);
  },

  setTokens({ accessToken, refreshToken, role } = {}) {
    if (accessToken) {
      if (role === "ADMIN") localStorage.setItem(ADMIN_ACCESS_KEY, accessToken);
      else localStorage.setItem(USER_ACCESS_KEY, accessToken);
    }
    if (refreshToken) localStorage.setItem(LEGACY_REFRESH_KEY, refreshToken);
  },

  clear() {
    localStorage.removeItem(USER_ACCESS_KEY);
    localStorage.removeItem(ADMIN_ACCESS_KEY);
    localStorage.removeItem(LEGACY_ACCESS_KEY);
    localStorage.removeItem(LEGACY_REFRESH_KEY);
  },
};
