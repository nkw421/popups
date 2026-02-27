import axios from "axios";
import { attachInterceptors } from "./interceptors";

export function createAxiosInstance() {
  const envBase = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  const baseURL = envBase ? envBase.replace(/\/+$/, "") : "http://localhost:8080";

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  attachInterceptors(instance);

  return instance;
}

export const axiosInstance = createAxiosInstance();
