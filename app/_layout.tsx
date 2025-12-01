import { useColorScheme, Appearance, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { AuthProvider } from "@/context";
import { useAuth, useNotification } from "@/hooks";
import { subscribeNoti } from "@/services";
import { SubscriberTypeEnum } from "@/types";
import { useEffect } from "react";

const RootLayoutContent = () => {
  useEffect(() => {
    Appearance.setColorScheme("light");
  }, []);

  const { user, logout } = useAuth();

  const { fcmToken, permissionStatus } = useNotification();

  // Subscribe device token to notifications
  useEffect(() => {
    const doSubscribe = async () => {
      if (!permissionStatus || !fcmToken || !user) return;
            
      try {
        await subscribeNoti({
          fcm_token: fcmToken,
          user_id: user.user_id,
          session_id: user.session_id,
          type: SubscriberTypeEnum.STAFF,
        });
      } catch (err) {
        console.warn("Subscribe notification failed", err);
      }
    };

    doSubscribe();
  }, [permissionStatus, fcmToken, user]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
          } catch (err: any) {
            console.log(err);
          }
        },
      },
    ]);
  };

  const goProfile = () => {
    router.push("profile/Me");
  };

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme!] ?? Colors.light;

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/Login" options={{ headerShown: false }} />
      <Stack.Screen name="profile/Me" options={{ title: "Profile", headerShown: true }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Recipe Noti",
          headerShown: true,
          headerRight: () => (
            <>
              <TouchableOpacity onPress={goProfile} style={styles.profileBtn}>
                <Feather name="user" size={24} color={theme.navIconColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={theme.navIconColor} />
              </TouchableOpacity>
            </>
          ),
        }}
      />
    </Stack>
  );
};

const RootLayout = () => (
  <AuthProvider>
    <RootLayoutContent />
  </AuthProvider>
);

export default RootLayout;

const styles = StyleSheet.create({
  profileBtn: {
    marginRight: 20,
  },
});