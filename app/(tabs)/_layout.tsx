import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Colors } from "@/constants";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

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
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          paddingTop: 5,
          height: 90,
        },
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused }) => {
          const iconSet = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          const iconName = focused ? iconSet.focused : iconSet.unfocused;
          const iconColor = focused ? Colors.primary[500] : Colors.gray[400];

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
  );
};
export default TabsLayout;

const styles = StyleSheet.create({});