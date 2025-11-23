import { ReactNode } from "react";
import { PressableProps, StyleProp, ViewStyle, TextInputProps } from "react-native";

export interface MyButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  loading: boolean;
  children: ReactNode;
}

export interface MyCardProps {
  style?: StyleProp<ViewStyle>;
}

export interface MyContainerProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export interface MyTextProps {
  style?: StyleProp<ViewStyle>;
  title: boolean;
  children?: ReactNode;
}

export interface MyTextInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
}