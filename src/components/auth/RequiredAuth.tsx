import { useEffect, ReactNode } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/stores";

interface RequiredAuthProps {
  children: ReactNode;
}

export const RequiredAuth: React.FC<RequiredAuthProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  const goLogin = () => {
    router.replace("auth/login");
  };

  useEffect(() => {
    if (!user || !user?.user_id || !user?.token) {
      goLogin();
    }
  }, [user]);

  return <>{children}</>;
};