import { useColorScheme, StyleSheet, View } from "react-native";
import { Colors } from "@/constants";
import { MyCardProps } from "@/types";

export const MyCard = ({ style, ...props }: MyCardProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme!] ?? Colors.light;

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
  },
});
