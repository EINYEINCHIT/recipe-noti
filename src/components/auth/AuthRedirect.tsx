import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores";

export const AuthRedirect: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user || !user?.user_id || !user?.token) {
    // not logged in → go to login
    return <Redirect href="/auth/login" />;
  }

  // logged in → go to noti
  return <Redirect href="/(tabs)/noti" />;
};