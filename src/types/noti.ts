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
  currentPage: number;
  data: Notification[];
  totalPage: number;
  unseen_count: number;
}