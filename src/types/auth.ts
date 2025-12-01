export interface User {
    user_id: number;
    username: string;
    email: string;
    token: string;
    session_id: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  device_name: string;
}

export interface LoginResponse {
  user_id: number;
  username: string;
  email: string;
  token: string;
  session_id: number;
}