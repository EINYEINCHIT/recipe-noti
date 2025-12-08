import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context";
import { useTheme, useNotification } from "@/hooks";
import { useAuthStore } from "@/stores";
import { subscribeNoti } from "@/services";
import { SubscriberTypeEnum } from "@/types";

const RootLayoutContent = () => {
  const { theme } = useTheme();

  const user = useAuthStore((state) => state.user);
  const { fcmToken, permissionStatus } = useNotification();

  // Subscribe device token to notifications
  useEffect(() => {
    const doSubscribe = async () => {
      if (!permissionStatus || !fcmToken || !user) return;
            
      try {
        await subscribeNoti({
          fcm_token: fcmToken,
          user_id: user?.user_id,
          session_id: user?.session_id,
          type: SubscriberTypeEnum.STAFF,
        });
      } catch (err) {
        console.warn("Subscribe notification failed", err);
      }
    };

    doSubscribe();
  }, [permissionStatus, fcmToken, user]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerBackTitle: "Back",
        headerTintColor: theme.title,
        headerShadowVisible: true,
        headerTransparent: false,
      }}
    >
      <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
      <Stack.Screen name="profile/Me" options={{ title: "Profile", headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => (
  <ThemeProvider>
    <RootLayoutContent />
  </ThemeProvider>
);

export default RootLayout;

const styles = StyleSheet.create({});