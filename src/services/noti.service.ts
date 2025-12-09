import { axiosInstance } from "./axios.service";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import {
  SubscribeNotiPayload,
  SubscribeNotiResponse,
  NotificationListPayload,
  NotificationListResponse,
} from "@/types";

export const subscribeNoti = async (data: SubscribeNotiPayload) => {
  const response = await axiosInstance.post<{ content: SubscribeNotiResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.noti.subscribe}`,
    data
  );
  return response.data.content;
};

export const findAllNoti = async (params: NotificationListPayload) => {
  const response = await axiosInstance.get<{content: NotificationListResponse}>(
    `${API_BASE_URL}${API_ENDPOINTS.noti.findAll}`,
    { params }
  );
  return response.data.content;
};