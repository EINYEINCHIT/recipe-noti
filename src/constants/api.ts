export const API_BASE_URL = "http://192.168.100.144:8000";

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/sign-in",
    logout: "/api/auth/sign-out",
  },
  noti: {
    subscribe: "/api/noti/subscribe",
    findAll: "/api/noti/staff/notification"
  }
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;