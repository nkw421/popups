import { tokenStore } from "./tokenStore";

const REFRESH_SKIP_PATTERNS = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/signup/",
];

function isAdminRequest(url = "") {
  return url.startsWith("/api/admin/");
}

function shouldSkipRefresh(url = "") {
  return REFRESH_SKIP_PATTERNS.some((p) => url.includes(p));
}

function extractAccessToken(res) {
  return (
    res?.data?.data?.accessToken ??
    res?.data?.data?.token ??
    res?.data?.accessToken ??
    res?.data?.token ??
    null
  );
}

function assertApiPathInDev(url = "") {
  if (!import.meta.env.DEV) return;
  if (!url.startsWith("/api/")) {
    throw new Error(`[HTTP] Invalid API path (must start with /api/): ${url}`);
  }
}

export function attachInterceptors(instance) {
  instance.interceptors.request.use(
    (config) => {
      const url = config?.url || "";

      assertApiPathInDev(url);

      if (!config.headers?.Authorization) {
        const token = isAdminRequest(url)
          ? tokenStore.getAdminToken()
          : tokenStore.getUserToken();

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error?.config;
      if (!original) return Promise.reject(error);

      const status = error?.response?.status;
      const url = original.url || "";

      if (status !== 401 || shouldSkipRefresh(url) || original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;
      const admin = isAdminRequest(url);

      try {
        const refreshRes = await instance.post("/api/auth/refresh", null, {
          headers: {},
        });

        const accessToken = extractAccessToken(refreshRes);
        if (!accessToken) {
          throw new Error("Refresh succeeded but access token missing");
        }

        if (admin) tokenStore.setAdminToken(accessToken);
        else tokenStore.setUserToken(accessToken);

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;

        return instance(original);
      } catch (refreshError) {
        if (admin) tokenStore.clearAdminToken();
        else tokenStore.clearUserToken();
        return Promise.reject(refreshError);
      }
    },
  );
}
