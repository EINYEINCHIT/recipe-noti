import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants";
import { MyButton } from "@/components";

const Login = () => {
  const handleLogin = () => {
    router.replace("(tabs)/Noti");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to your account</Text>
      <MyButton onPress={handleLogin}>
        <Text style={{ color: Colors.white }}>Login</Text>
      </MyButton>
    </View>
  )
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  btn: {
    backgroundColor: Colors.primary[500],
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
});