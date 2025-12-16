import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks";
import { MyContainerProps } from "@/types";

export const MyContainer = ({ style, ...props }: MyContainerProps) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={["bottom"]} // Only apply bottom safe area padding; top/left/right padding is OFF
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        },
        style,
      ]}
      {...props}
    />
  );
};
