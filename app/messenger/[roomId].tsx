import { Stack, useLocalSearchParams } from "expo-router";
import { MessengerScreen } from "@/screens";
import { useTheme } from "@/hooks";

const MessengerRoute = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { theme } = useTheme();

  if (!roomId) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: `Messenger`,
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
        }}
      />
      <MessengerScreen roomId={roomId} />
    </>
  );
};

export default MessengerRoute;

