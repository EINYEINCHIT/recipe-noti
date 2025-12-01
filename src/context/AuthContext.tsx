import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { router } from "expo-router";
import { User, LoginPayload, LoginResponse } from "@/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";

export interface AuthProviderProps {
  children: ReactNode;
};

export interface AuthContextType {
  user: User | null;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export let currentUser: User | null = null;
export let currentLogout: (() => void) | null = null;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async(credentials: LoginPayload) => {
    const { data } = await axios.post<{ content: LoginResponse }>(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`,
      credentials, {
        headers: { "User-Agent": "Mozilla/5.0" }
      }
    );
    setUser(data.content);
  }

  const logout = async() => {
    const token = user?.token;
    await axios.post(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, { token }).catch(() => {});
    setUser(null);
    router.replace("auth/Login");
  }

  useEffect(() => {
    currentUser = user;
    currentLogout = logout;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}