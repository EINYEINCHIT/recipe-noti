import { useEffect, ReactNode } from "react";
import { router, useRouter } from "expo-router";
import { useAuth } from "@/hooks";

interface RequiredAuthProps {
  children: ReactNode;
}

export const RequiredAuth: React.FC<RequiredAuthProps> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user === null || !user.user_id || !user.token) {
      router.replace("auth/Login");
    }
  }, [user]);

  return children;
};