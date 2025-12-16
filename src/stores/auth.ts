import { create } from "zustand";
import { router } from "expo-router";
import { LoginPayload, LoginResponse, LoginUser, LogoutResponse } from "@/types";
import { signin, signout } from "@/services";
import { setAxiosAuthToken, authEmitter } from "@/services/axios.service";

type AuthState = {
  user: LoginUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (payload) => {
    const res: LoginResponse = await signin(payload);
    set({ user: res });
    setAxiosAuthToken(res.token);
    router.replace("(tabs)/noti");
  },
  logout: async () => {
    const token = useAuthStore.getState().user?.token!;
    const res: LogoutResponse = await signout({ token });
    set({ user: null });
    setAxiosAuthToken(null);
    router.replace("auth/login");
  },
  
  resetAuth: () => set({ user: null }),
}));

// Auto logout listener
authEmitter.on("logout", () => {
  useAuthStore.getState().logout();
});