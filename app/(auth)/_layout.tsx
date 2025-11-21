import { StyleSheet } from "react-native";
import { Stack } from "expo-router";

const AuthLayout = () => {
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
export default AuthLayout;

const styles = StyleSheet.create({});
