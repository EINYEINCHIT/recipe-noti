import { useColorScheme, TextInput } from "react-native";
import { Colors } from "@/constants";
import { MyTextInputProps } from "@/types";

export const MyTextInput = ({ style, ...props }: MyTextInputProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme!] ?? Colors.light;

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6,
        },
        style,
      ]}
      placeholderTextColor={theme.textFaded}
      {...props}
    />
  );
};