import { create } from "zustand";
import { router } from "expo-router";
import { LoginPayload, LoginResponse, LoginUser, LogoutResponse } from "@/types";
import { signin, signout } from "@/services";

type AuthStore = {
  user: LoginUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  login: async (payload: LoginPayload) => {
    try {
      const res: LoginResponse = await signin(payload);
      set({ user: res });
    } catch (err: any) {
      console.warn("Login Error: ", err);
      throw err;
    }
  },

  logout: async () => {
    const token = useAuthStore.getState().user?.token!;
    try {
      const res: LogoutResponse = await signout({ token });
      set({ user: null });
      router.replace("auth/Login");
    } catch (err: any) {
      console.warn("Logout Error: ", err);
      throw err;
    }
  },
}));