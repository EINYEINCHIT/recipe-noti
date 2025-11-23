import { axiosInstance } from "./axios.service";
import { NotificationListPayload, NotificationListResponse } from "@/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

export const findAllNoti = async (params: NotificationListPayload) => {
  const response = await axiosInstance.get<{ content: NotificationListResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.noti.findAll}`,
    { params }
  );
  return response.data.content;
};