export const API_BASE_URL = "https://chat0.myskinrecipes.com";

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/sign-in",
    logout: "/api/auth/sign-out",
  },
  noti: {
    findAll: "/api/noti/staff/notification"
  }
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;