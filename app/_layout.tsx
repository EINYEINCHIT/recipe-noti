import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context";
import { useTheme, useNotification } from "@/hooks";
import { useAuthStore } from "@/stores";
import { subscribeNoti } from "@/services";
import { UserTypeEnum } from "@/types";

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
          type: UserTypeEnum.STAFF,
        });
      } catch (err) {
        console.warn("Subscription Error: ", err);
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
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="profile/me" options={{ title: "Profile", headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="messenger/[roomId]" options={{ title: "Messenger", headerShown: true }} />
      <Stack.Screen name="redirect/[token]" options={{ title: "Redirect", headerShown: true }} />
    </Stack>
  );
};

const RootLayout = () => (
  <ThemeProvider>
    <PaperProvider>
      <RootLayoutContent />
    </PaperProvider>
  </ThemeProvider>
);

export default RootLayout;

const styles = StyleSheet.create({});