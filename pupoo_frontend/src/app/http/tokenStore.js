import { clearToken, getToken, setToken } from "./authStore";

// Access Token is memory-only.
export const tokenStore = {
  getAccess() {
    return getToken();
  },

  getRefresh() {
    return null;
  },

  setAccess(accessToken) {
    setToken(accessToken);
  },

  setRefresh() {
    // no-op
  },

  setTokens({ accessToken }) {
    setToken(accessToken);
  },

  clear() {
    clearToken();
  },
};
