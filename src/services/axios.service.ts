import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";
import { useAuthStore } from "@/stores";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

function getAuthToken(): string | undefined {
  return useAuthStore.getState().user?.token;
}

function handleAuthError(status?: number) {
  if (status === 401 || status === 403) {
    const logout = useAuthStore.getState().logout;
    logout();
  }
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
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