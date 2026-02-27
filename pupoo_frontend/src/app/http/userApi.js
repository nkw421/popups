// src/app/http/userApi.js
import { axiosInstance } from "./axiosInstance";
import { unwrapApiResponse } from "./apiResponse";

function unwrap(res) {
  return unwrapApiResponse(res?.data);
}

export const userApi = {
  /** GET /api/users/me — 로그인 사용자 정보 (userId 등) */
  getMe() {
    return axiosInstance.get("/api/users/me").then((res) => unwrap(res));
  },
};