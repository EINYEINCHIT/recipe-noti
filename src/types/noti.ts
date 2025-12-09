import { UserTypeEnum } from "./auth";

export interface SubscribeNotiPayload {
  fcm_token: string;
  user_id: number;
  type: UserTypeEnum;
  session_id: number;
}

export interface SubscribeNotiResponse {
  id: number;
  user_id: number;
  fcm_token: string;
}

export interface Notification {
  id: number;
  description: string;
  ms_name: string;
  redirect_content: {
    page_token: string;
    redirect_name: string;
  };
  title: string;
  staffNotiReadBy: any[];
  staffNotiReceivedBy: any[];
  staffNotiRoom: any[];
  staffNotiSeenBy: any[];
  created_at: string;
}

export interface NotificationListPayload {
  user_id: number;
  page?: number;
  limit?: number;
  order?: string;
}

export interface NotificationListResponse {
  data: Notification[];
  currentPage: number;
  totalPage: number;
  unseen_count: number;
}

export interface SeenNotiPayload {
  user_id: number;
}

export interface ReadNotiPayload {
  noti_id: number;
  user_id: number;
}