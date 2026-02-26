// file: src/app/http/axiosInstance.js
import axios from "axios";
import { attachInterceptors } from "./interceptors";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is required. Set it in .env.local");
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

attachInterceptors(axiosInstance);
