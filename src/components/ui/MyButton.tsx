import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Colors } from "@/constants";
import { MyButtonProps } from "@/types";

export const MyButton = ({
  style,
  loading = false,
  children,
  ...props
}: MyButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && !loading && styles.pressed,
        style,
      ]}
      disabled={loading}
      {...props}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={Colors.white} /> : children}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary[500],
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    minWidth: 60,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
