import { TextInput } from "react-native";
import { useTheme } from "@/hooks";
import { MyTextInputProps } from "@/types";

export const MyTextInput = ({ style, ...props }: MyTextInputProps) => {
  const { theme } = useTheme();

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