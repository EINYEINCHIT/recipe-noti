import { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyContainer, MyText, Spacer, MyButton, RequiredAuth } from "@/components";
import { useAuthStore } from "@/stores";
import { Colors } from "@/constants";

export const MeScreen = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        onPress: async () => {
          setError(null);
          setLoading(true);
          try {
            await logout();
          } catch (err: any) {
            console.warn("Logout Error: ", err);
            setError(err?.message ?? "Login Error.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <RequiredAuth>
      <MyContainer style={styles.container}>

        {error && (<Text style={{ color: Colors.error }}>{error}</Text>)}

        <Spacer />

        {user && (
          <View style={styles.card}>
            <Ionicons
              name="person-circle"
              size={80}
              style={styles.avatarIcon}
            />

            <MyText style={styles.label}>User ID</MyText>
            <MyText style={styles.value}>{user.user_id}</MyText>

            <MyText style={styles.label}>Username</MyText>
            <MyText style={styles.value}>{user.username}</MyText>

            <MyText style={styles.label}>Email</MyText>
            <MyText style={styles.value}>{user.email}</MyText>

            <MyText style={styles.label}>Department</MyText>
            <MyText style={styles.value}>{user.department}</MyText>

            <MyText style={styles.label}>Role</MyText>
            <MyText style={styles.value}>{user.role}</MyText>
          </View>
        )}

        <MyButton onPress={handleLogout} loading={loading} style={styles.logoutBtn}>
          <Text style={{ color: Colors.white }}>Logout</Text>
        </MyButton>
      </MyContainer>
    </RequiredAuth>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: {
    alignSelf: "center",
    marginBottom: 16,
    color: Colors.gray[400],
  },
  card: {
    width: "85%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: Colors.gray[400],
    marginTop: 12,
  },
  value: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: 30,
    width: "85%",
  },
});
