import { StyleSheet } from "react-native";
import {
  MyContainer,
  MyText,
  Spacer,
} from "@/components";
import { RequiredAuth } from "@/components";

export const MeScreen = () => {
  return (
    <RequiredAuth>
      <MyContainer style={styles.container}>
        <Spacer />
        <MyText title={false} style={styles.title}>
          This is Me page.
        </MyText>
      </MyContainer>
    </RequiredAuth>
  )
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