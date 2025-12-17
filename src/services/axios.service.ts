import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_SERVER, SHOP_SERVER } from "@/constants";
import EventEmitter from "events";

export const appApi: AxiosInstance = axios.create({
  baseURL: API_SERVER,
});

export const shopApi: AxiosInstance = axios.create({
  baseURL: SHOP_SERVER,
});

export const authEmitter = new EventEmitter();
function handleAuthError(status?: number) {
  if (status === 401 || status === 403) {
    authEmitter.emit("logout");
  }
}

let authToken: string | null;
export function setAxiosAuthToken(token: string | null) {
  authToken = token;
}
export function getAxiosAuthToken(): string | null {
  return authToken;
}

// Request interceptor
appApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken) config.headers["Authorization"] = `Bearer ${authToken}`;
    config.headers["User-Agent"] = "Mozilla/5.0";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
appApi.interceptors.response.use(
  (response) => response,
  (error) => {
    handleAuthError(error.response?.status);
    return Promise.reject(error);
  }
);
