import { axiosInstance } from "./axiosInstance";
import { buildFormData } from "../../shared/utils/buildFormData";

function withApiPrefix(url = "") {
  if (/^https?:\/\//i.test(url)) return url;

  const u = url.startsWith("/") ? url : `/${url}`;

  if (u === "/api" || u.startsWith("/api/")) return u;

  return `/api${u}`;
}

function forceCredentialConfig(config = {}) {
  return {
    ...config,
    withCredentials: true,
  };
}

export const apiJson = {
  get: (url, config) => axiosInstance.get(withApiPrefix(url), forceCredentialConfig(config)),
  post: (url, data, config) =>
    axiosInstance.post(withApiPrefix(url), data, forceCredentialConfig(config)),
  put: (url, data, config) =>
    axiosInstance.put(withApiPrefix(url), data, forceCredentialConfig(config)),
  delete: (url, config) => axiosInstance.delete(withApiPrefix(url), forceCredentialConfig(config)),
};

export const apiForm = {
  post: (url, obj, config) =>
    axiosInstance.post(withApiPrefix(url), buildFormData(obj), forceCredentialConfig(config)),
  put: (url, obj, config) =>
    axiosInstance.put(withApiPrefix(url), buildFormData(obj), forceCredentialConfig(config)),
};

export const apiUrlEncoded = {
  post: (url, params, config) =>
    axiosInstance.post(withApiPrefix(url), new URLSearchParams(params), {
      ...forceCredentialConfig(config),
      headers: {
        ...(config?.headers || {}),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
};
