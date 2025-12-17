import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: async (payload) => {
        const res: LoginResponse = await signin(payload);
        set({ user: res });
        setAxiosAuthToken(res.token);
        router.replace("(tabs)/noti");
      },

      logout: async () => {
        const token = get().user?.token!;
        const res: LogoutResponse = await signout({ token });
        set({ user: null });
        setAxiosAuthToken(null);
        router.replace("auth/login");
      },

      resetAuth: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Auto logout listener
authEmitter.on("logout", () => {
  useAuthStore.getState().logout();
});