export const API_BASE_URL = "http://192.168.100.146:8000";
export const SHOP_BASE_URL = "https://stage0.myskinrecipes.com/shop/";
export const SOCKET_SERVER = "http://192.168.100.146:8000"

/**
 * - Staging → https://chat0.myskinrecipes.com
 * - Local → http://192.168.100.146:8000
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
    seen: "api/noti/staff/notification/seen",
    read: "api/noti/staff/notification/read",
  },
  room: {
    findAll: "/api/chat/room",
    findOne: (roomId: number) => `/api/chat/room/${roomId}`,
    update: "/api/chat/room",
    join: "api/chat/room/join",
  },
  service: {
    findAll: "/api/chat/service",
  },
  message: {
    findAll: "/api/chat/message",
  },
  file: {
    chat: "/api/file/chat",
    machine: "api/file/machine",
    recipes: "api/file/recipes",
    upload: "api/file/upload",
  },
  shop: {
    getOrder: "/module/ajaxmodule/getOrder",
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;