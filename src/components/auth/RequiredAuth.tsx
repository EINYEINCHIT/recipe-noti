import { useEffect, ReactNode } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/stores";

interface RequiredAuthProps {
  children: ReactNode;
}

export const RequiredAuth: React.FC<RequiredAuthProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || !user?.user_id || !user?.token) {
      router.replace("auth/Login");
    }
  }, [user]);

  return <>{children}</>;
};