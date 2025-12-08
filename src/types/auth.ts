export enum DepartmentEnum {
  CHAT = "CHAT",
  LAB = "LAB",
  MACHINE = "MACHINE",
  RECIPE = "RECIPE",
  RECIPE_DESIGN = "RECIPE_DESIGN",
}

export enum RoleEnum {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export interface LoginUser {
  user_id: number;
  username: string;
  email: string;
  token: string;
  session_id: number;
  department: DepartmentEnum;
  role: RoleEnum;
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
  department: DepartmentEnum;
  role: RoleEnum;
}

export interface LogoutPayload {
  token: string;
}

export interface LogoutResponse {
  subscription_id: number;
}