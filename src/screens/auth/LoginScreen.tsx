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
import { Colors } from "@/constants";
import {
  MyContainer,
  MyText,
  MyButton,
  MyTextInput,
  Spacer,
} from "@/components";
import { useAuthStore } from "@/stores";

export const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login({ email, password, device_name: "Mobile" });
    } catch (err: any) {
      console.warn("Login Error: ", err);
      setError(err?.message ?? "Login Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <MyContainer>

        {error && (<Text style={{ color: Colors.error }}>{error}</Text>)}

        <Spacer />

        <MyText style={styles.title}>
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

        <MyButton onPress={handleLogin} loading={loading} style={styles.loginBtn}>
          <Text style={{ color: Colors.white }}>Login</Text>
        </MyButton>
      </MyContainer>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 500,
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
  loginBtn: {
    width: "80%",
  },
});