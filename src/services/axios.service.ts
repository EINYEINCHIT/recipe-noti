import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";
import EventEmitter from "events";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const authEmitter = new EventEmitter();
function handleAuthError(status?: number) {
  if (status === 401 || status === 403) {
    authEmitter.emit("logout");
  }
}

let authToken: string | null = null;
export function setAxiosAuthToken(token: string | null) {
  authToken = token;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken) config.headers["Authorization"] = `Bearer ${authToken}`;
    config.headers["User-Agent"] = "Mozilla/5.0";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleAuthError(error.response?.status);
    return Promise.reject(error);
  }
);