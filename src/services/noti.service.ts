import { axiosInstance } from "./axios.service";
import { SubscribeNotiPayload, NotificationListPayload, NotificationListResponse } from "@/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

export const subscribeNoti = async (data: SubscribeNotiPayload) => {
  const { fcm_token: fcmToken, user_id, type, session_id } = data;
  return axiosInstance.post(
    `${API_BASE_URL}${API_ENDPOINTS.noti.subscribe}`,
    {
      fcm_token: fcmToken,
      user_id,
      session_id,
      type,
    },
  );
};

export const findAllNoti = async (params: NotificationListPayload) => {
  const response = await axiosInstance.get<{ content: NotificationListResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.noti.findAll}`,
    { params }
  );
  return response.data.content;
};