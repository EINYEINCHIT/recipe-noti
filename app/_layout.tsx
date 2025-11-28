import { useColorScheme, Appearance, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { AuthProvider } from "@/context";
import { useAuth, useNotification } from "@/hooks";
import { useEffect } from "react";

const RootLayoutContent = () => {
  const { logout } = useAuth();

  useNotification();

  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);


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