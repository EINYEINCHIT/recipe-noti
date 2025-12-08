import { Text } from "react-native";
import { useTheme } from "@/hooks";
import { MyTextProps } from "@/types";

export const MyText = ({ style, title = false, ...props }: MyTextProps) => {
  const { theme } = useTheme();

  const textColor = title ? theme.title : theme.text;

  return <Text style={[{ color: textColor }, style]} {...props} />;
};