export interface CustomerListPayload {
  user_id: number[];
}

export interface Customer {
  id: number;
  reminder_alert: boolean;
  session_token: string;
  shop_user_id: string;
  user_id: number;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  lineCustomers: any[];
}
