import { StyleSheet } from "react-native";
import {
  MyContainer,
  MyText,
  Spacer,
} from "@/components";

export const RoomScreen = () => {
  return (
    <MyContainer style={styles.container}>
      <Spacer />
      <MyText title={false} style={styles.title}>
        This is Rooms page.
      </MyText>
    </MyContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
});