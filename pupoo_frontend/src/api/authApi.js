import { axiosInstance } from "../app/http/axiosInstance";

export const authApi = {
  login: (payload) => axiosInstance.post("/api/auth/login", payload),
  refresh: () => axiosInstance.post("/api/auth/refresh"),
  logout: () => axiosInstance.post("/api/auth/logout"),
  signupStart: (payload) => axiosInstance.post("/api/auth/signup/start", payload),
  signupVerifyOtp: (payload) => axiosInstance.post("/api/auth/signup/verify-otp", payload),
  signupEmailRequest: (payload) => axiosInstance.post("/api/auth/signup/email/request", payload),
  signupEmailConfirm: (payload) => axiosInstance.post("/api/auth/signup/email/confirm", payload),
  signupComplete: (payload) => axiosInstance.post("/api/auth/signup/complete", payload),
};
