import { useColorScheme, Text } from "react-native";
import { Colors } from "@/constants";
import { MyTextProps } from "@/types";

export const MyText = ({ style, title = false, ...props }: MyTextProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme!] ?? Colors.light;

  const textColor = title ? theme.title : theme.text;

  return <Text style={[{ color: textColor }, style]} {...props} />;
};