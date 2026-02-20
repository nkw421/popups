// src/app/http/programApi.js
import { axiosInstance } from "./axiosInstance";

export const programApi = {
  // GET /api/events/{eventId}/programs
  getPrograms: ({ eventId, category, page = 0, size = 10, sort }) =>
    axiosInstance.get(`/api/events/${eventId}/programs`, {
      params: {
        ...(category ? { category } : {}),
        page,
        size,
        ...(sort ? { sort } : {}),
      },
    }),

  // GET /api/programs/{programId}
  getProgramDetail: (programId) =>
    axiosInstance.get(`/api/programs/${programId}`),

  // GET /api/programs/{programId}/speakers
  getProgramSpeakers: (programId) =>
    axiosInstance.get(`/api/programs/${programId}/speakers`),

  // GET /api/programs/{programId}/speakers/{speakerId}
  getProgramSpeaker: (programId, speakerId) =>
    axiosInstance.get(`/api/programs/${programId}/speakers/${speakerId}`),

  // GET /api/program-applies/my
  getMyProgramApplies: ({ page = 0, size = 10, sort }) =>
    axiosInstance.get(`/api/program-applies/my`, {
      params: { page, size, ...(sort ? { sort } : {}) },
    }),

  // POST /api/program-applies
  createProgramApply: (payload) =>
    axiosInstance.post(`/api/program-applies`, payload),

  // PATCH /api/program-applies/{id}/cancel
  cancelProgramApply: (applyId) =>
    axiosInstance.patch(`/api/program-applies/${applyId}/cancel`),

  // GET /api/program-applies/{id}
  getProgramApply: (applyId) =>
    axiosInstance.get(`/api/program-applies/${applyId}`),
};
