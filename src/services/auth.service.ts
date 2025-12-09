import { axiosInstance } from "./axios.service";
import { API_ENDPOINTS } from "@/constants";
import {
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  LogoutResponse,
} from "@/types";

export const signin = async (data: LoginPayload) => {
  const response = await axiosInstance.post<{ content: LoginResponse }>(
    `${API_ENDPOINTS.auth.login}`,
    data
  );
  return response.data.content;
};

export const signout = async (data: LogoutPayload) => {
  const response = await axiosInstance.post<{ content: LogoutResponse }>(
    `${API_ENDPOINTS.auth.logout}`,
    data
  );
  return response.data.content;
};