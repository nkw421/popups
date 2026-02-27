import { axiosInstance } from "./axiosInstance";
import { unwrapApiResponse } from "./apiResponse";

export async function runDevApiSmokeTest() {
  if (!import.meta.env.DEV) return;

  try {
    const response = await axiosInstance.get("/api/events", {
      params: { page: 0, size: 1 },
      timeout: 5000,
    });

    const data = unwrapApiResponse(response.data);
    console.info("[dev-smoke] public endpoint OK", data);
  } catch (error) {
    console.warn("[dev-smoke] public endpoint FAILED", {
      message: error?.message,
      code: error?.code,
    });
  }
}
