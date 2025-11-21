import { StyleSheet, Pressable, PressableProps, StyleProp, ViewStyle  } from "react-native";
import { Colors } from "@/constants";

interface MyButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
}

const MyButton = ({ style, ...props }: MyButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
      {...props}
    />
  );
};
export default MyButton;

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    backgroundColor: Colors.primary[500],
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
});