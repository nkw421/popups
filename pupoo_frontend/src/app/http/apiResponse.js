export function unwrapApiResponse(payload) {
  if (!payload || typeof payload !== "object") {
    throw Object.assign(new Error("Invalid ApiResponse payload"), {
      code: "INVALID_API_RESPONSE",
      fieldErrors: null,
      payload,
    });
  }

  if (payload.success === true) {
    return payload.data;
  }

  const error = new Error(payload.message || "API request failed");
  error.code = payload.code || "API_ERROR";
  error.fieldErrors = payload.fieldErrors || null;
  error.payload = payload;
  throw error;
}

export function unwrapAxiosResponse(response) {
  return unwrapApiResponse(response?.data);
}
