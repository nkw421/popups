const USER_TOKEN_KEY = "pupoo_user_token";
const ADMIN_TOKEN_KEY = "pupoo_admin_token";

// backward compatibility for previously stored token
const LEGACY_ACCESS_KEY = "pupoo_access_token";

export const tokenStore = {
  getUserToken() {
    return (
      localStorage.getItem(USER_TOKEN_KEY) ||
      localStorage.getItem(LEGACY_ACCESS_KEY)
    );
  },

  getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  setUserToken(token) {
    if (!token) return;
    localStorage.setItem(USER_TOKEN_KEY, token);
  },

  setAdminToken(token) {
    if (!token) return;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },

  clearUserToken() {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ACCESS_KEY);
  },

  clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  clearAllTokens() {
    this.clearUserToken();
    this.clearAdminToken();
  },

  // compatibility methods for existing UI code
  getAccess() {
    return this.getUserToken();
  },
  getAdminAccess() {
    return this.getAdminToken();
  },
  setAccess(token) {
    this.setUserToken(token);
  },
  setAdminAccess(token) {
    this.setAdminToken(token);
  },
  clear() {
    this.clearAllTokens();
  },
};

export { USER_TOKEN_KEY, ADMIN_TOKEN_KEY };
