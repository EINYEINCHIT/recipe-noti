import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { Colors } from "@/constants";
import { Feather, AntDesign }from '@expo/vector-icons';

const RootLayout = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      { 
        text: "Logout", 
        onPress: () => {
          router.replace("(auth)/Login");
        }
      }
    ]);
  };

  const goProfile = () => {
    router.push("(profile)/Me");
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary[500] },
        headerBackTitle: "Back",
        headerTintColor: Colors.white,
        headerShadowVisible: true,
        headerTransparent: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)" options={{ title: "Me", headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{
        title: "Recipe Noti",
        headerShown: true,
        headerRight: () => (
          <>
            <TouchableOpacity onPress={goProfile} style={styles.profileBtn}>
              <Feather name="user" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <AntDesign name="lock" size={24} color={Colors.white} />
            </TouchableOpacity>
          </>
        ),
      }} />
    </Stack>
  );
};
export default RootLayout;

const styles = StyleSheet.create({
  profileBtn: {
    marginRight: 20,
  }
});