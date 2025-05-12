import { get, post } from "@/utils/fetchTools";

type RegisterParams = {
  user_name: string;
  password: string;
  nickname: string;
  password_confirm: string;
};

type LoginParams = {
  user_name: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  user_name: string;
  nickname: string;
  status: string;
  avatar: string;
  created_at: number;
  bio: string;
};

export type UpdateInfoParams = {
  id: number;
  nickname: string;
  avatar: string;
  bio: string;
};

// register
export const fetchRegister = async <T = any>(params: RegisterParams) => {
  return await post<{ code: number; data: T }>("/api/v1/user/register", params);
};

// login
export const fetchLogin = async <T = any>(params: LoginParams) => {
  return await post<{ code: number; data: T }>("/api/v1/user/login", params);
};

// user
export const fetchGetUser = async <T = any>() => {
  return await get<{ code: number; data: T }>("/api/v1/user/me");
};

// logout
export const fetchLogout = async <T = any>() => {
  return await post<{ code: number; data: T }>("/api/v1/user/logout", {});
};

// 更新
export const fetchUpdateUserInfo = async <T = any>(data: UpdateInfoParams) => {
  return await post<{ code: number; data: T }>(
    "/api/v1/user/updateInfo",
    data
  );
};
