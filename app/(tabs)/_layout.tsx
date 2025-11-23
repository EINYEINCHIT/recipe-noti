import { useColorScheme, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { RequiredAuth } from "@/components";

const TAB_ICONS = {
  Noti: { focused: "notifications", unfocused: "notifications-outline" },
  Chat: { focused: "chat-bubble", unfocused: "chat-bubble-outline" },
  Rooms: { focused: "desktop", unfocused: "desktop-outline" },
} as const;

type TabKey = keyof typeof TAB_ICONS;

type TabConfig = { name: TabKey; title: string };

const TAB_ITEMS: readonly TabConfig[] = [
  { name: "Noti", title: "Noti" },
  { name: "Chat", title: "Chat" },
  { name: "Rooms", title: "Rooms" },
];

const TabsLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme!] ?? Colors.light;

  return (
    <RequiredAuth>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.bottomNavBackground,
            paddingTop: 5,
            height: 90,
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ focused }) => {
            const iconSet = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
            const iconName = focused ? iconSet.focused : iconSet.unfocused;
            const iconColor = focused ? theme.iconColorFocused : theme.iconColor;

            switch (route.name) {
              case "Noti":
                return (
                  <Ionicons name={iconName} size={24} color={iconColor} />
                );

              case "Chat":
                return (
                  <MaterialIcons name={iconName} size={24} color={iconColor} />
                );

              default:
                return <Ionicons name={iconName} size={24} color={iconColor} />;
            }
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

const styles = StyleSheet.create({});