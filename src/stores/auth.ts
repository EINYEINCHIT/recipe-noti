import axios from "axios";
import { create } from "zustand";
import { router } from "expo-router";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import { LoginPayload, LoginResponse, LoginUser } from "@/types";

type AuthStore = {
  user: LoginUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  login: async (payload: LoginPayload) => {
    const { data } = await axios.post<{ content: LoginResponse }>(
      `${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
      payload,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    set({ user: data.content });
  },

  logout: async () => {
    const token = useAuthStore.getState().user?.token;

    await axios
      .post(
        `${API_BASE_URL}${API_ENDPOINTS.auth.logout}`,
        { token },
        { headers: { "User-Agent": "Mozilla/5.0" } }
      )
      .catch(() => {});

    set({ user: null });
    router.replace("auth/Login");
  },
}));