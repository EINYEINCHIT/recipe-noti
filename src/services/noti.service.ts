import { axiosInstance } from "./axios.service";
import { API_ENDPOINTS } from "@/constants";
import {
  SubscribeNotiPayload,
  SubscribeNotiResponse,
  NotificationListPayload,
  NotificationListResponse,
  SeenNotiPayload,
  ReadNotiPayload,
} from "@/types";

export const subscribeNoti = async (data: SubscribeNotiPayload) => {
  const response = await axiosInstance.post<{ content: SubscribeNotiResponse }>(
    `${API_ENDPOINTS.noti.subscribe}`,
    data
  );
  return response.data.content;
};

export const findAllNoti = async (params: NotificationListPayload) => {
  const response = await axiosInstance.get<{content: NotificationListResponse}>(
    `${API_ENDPOINTS.noti.findAll}`,
    { params }
  );
  return response.data.content;
};

export const seenNoti = async (data: SeenNotiPayload) => {
  const response = await axiosInstance.put<{ content: any }>(
    `${API_ENDPOINTS.noti.seen}`,
    data
  );
  return response.data.content;
};

export const readNoti = async (data: ReadNotiPayload) => {
  const response = await axiosInstance.put<{ content: any }>(
    `${API_ENDPOINTS.noti.read}`,
    data
  );
  return response.data.content;
};