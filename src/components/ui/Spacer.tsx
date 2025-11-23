import { View, StyleSheet } from "react-native";

export const Spacer = ({ width = "100%", height = 40 }) => {
  return <View style={styles.box} />;
};

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 50,
  },
});
