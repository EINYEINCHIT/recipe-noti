import { StyleSheet } from "react-native";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
    </>
  );
};
export default ProfileLayout;

const styles = StyleSheet.create({});