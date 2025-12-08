export const API_BASE_URL = "https://chat0.myskinrecipes.com";
/**
 * - Staging → https://chat0.myskinrecipes.com
 * - Local → http://192.168.100.144:8000
 */

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/sign-in",
    logout: "/api/auth/sign-out",
  },
  customer: {
    findAll: "/api/customer/all",
  },
  noti: {
    subscribe: "/api/noti/subscribe",
    findAll: "/api/noti/staff/notification",
  },
  room: {
    findAll: "/api/chat/room",
    findOne: (roomId: number) => `/api/chat/room/${roomId}`,
    update: "/api/chat/room",
  },
  service: {
    findAll: "/api/chat/service",
  },
  message: {
    findAll: "/api/chat/message",
  }
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;