import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants";
import {
  MyContainer,
  MyText,
  MyButton,
  MyTextInput,
  Spacer,
} from "@/components";
import { useAuth } from "@/hooks";

const Login = () => {
  const [email, setEmail] = useState<string>("zaw@chanjao.com");
  const [password, setPassword] = useState<string>("password");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const handleLogin = async () => {

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login({ email, password, device_name: "Mobile" });
      router.replace("(tabs)/Noti");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MyContainer style={styles.container}>

        {error && (<Text style={{ color: Colors.error }}>{error}</Text>)}

        <Spacer />

        <MyText title={false} style={styles.title}>
          Login to your account
        </MyText>

        <MyTextInput
          style={styles.input}
          placeholder="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        <View style={styles.passwordContainer}>
          <MyTextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            style={styles.showPasswordContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <MyButton onPress={handleLogin} loading={loading}>
          <Text style={{ color: Colors.white }}>Login</Text>
        </MyButton>
      </MyContainer>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
  input: {
    width: "80%",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    position: "relative",
  },
  showPasswordContainer: {
    position: "absolute",
    top: 20,
    right: 15,
  },
});
