import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks";
import { MyContainerProps } from "@/types";

export const MyContainer = ({ style, edges = [], ...props }: MyContainerProps) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
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
