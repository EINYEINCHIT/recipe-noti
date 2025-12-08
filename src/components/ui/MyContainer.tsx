import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks";
import { MyContainerProps } from "@/types";

export const MyContainer = ({ style, ...props }: MyContainerProps) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: theme.background,
        },
        style,
      ]}
      {...props}
    />
  );
};

