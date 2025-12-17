import { ReactNode } from "react";
import { PressableProps, StyleProp, TextStyle, ViewStyle, TextInputProps } from "react-native";
import { SafeAreaViewProps } from "react-native-safe-area-context";

export interface MyButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  loading: boolean;
  children: ReactNode;
}

export interface MyCardProps {
  style?: StyleProp<ViewStyle>;
}

export interface MyContainerProps extends SafeAreaViewProps {}

export interface MyTextProps {
  style?: StyleProp<TextStyle>;
  title?: boolean;
  children?: ReactNode;
}

export interface MyTextInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
}