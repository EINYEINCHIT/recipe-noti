import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import { router, Tabs } from "expo-router";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { useAuthStore } from "@/stores";
import { RequiredAuth } from "@/components";

const TAB_ICONS = {
  "Noti": {
    focused: "notifications",
    unfocused: "notifications-outline",
  },
  "Room": {
    focused: "desktop",
    unfocused: "desktop-outline"
  },
} as const;

type TabKey = keyof typeof TAB_ICONS;

type TabConfig = { name: TabKey; title: string };

const TAB_ITEMS: readonly TabConfig[] = [
  { name: "Noti", title: "Noti" },
  { name: "Room", title: "Room" },
];

const TabsLayout = () => {
  const { theme } = useTheme();
  
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
          } catch (err: any) {
            console.warn(err);
          }
        },
      },
    ]);
  };

  const goProfile = () => {
    router.push("profile/Me");
  };

  return (
    <RequiredAuth>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: theme.navBackground },
          headerBackTitle: "Back",
          headerTintColor: theme.title,
          headerShadowVisible: true,
          headerTransparent: false,
          headerRight: () => (
            <>
              <TouchableOpacity onPress={goProfile} style={styles.headerBtn}>
                <Feather name="user" size={24} color={theme.navIconColor} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.headerBtn}>
                <MaterialIcons name="logout" size={24} color={theme.navIconColor} />
              </TouchableOpacity>
            </>
          ),
          tabBarStyle: {
            backgroundColor: theme.bottomNavBackground,
            paddingTop: 5,
            height: 90,
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ focused }) => {
            const iconSet = TAB_ICONS[route.name as TabKey];
            const iconName = focused ? iconSet?.focused : iconSet?.unfocused;
            const iconColor = focused
              ? theme.iconColorFocused
              : theme.iconColor;

            return <Ionicons name={iconName} size={24} color={iconColor} />;
          },
        })}
      >
        {TAB_ITEMS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{ title: tab.title }}
          />
        ))}
      </Tabs>
    </RequiredAuth>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  headerBtn: {
    marginRight: 20,
  },
});