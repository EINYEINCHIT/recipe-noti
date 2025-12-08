import { StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks";
import { MyCardProps } from "@/types";

export const MyCard = ({ style, ...props }: MyCardProps) => {
  const { theme } = useTheme();

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
