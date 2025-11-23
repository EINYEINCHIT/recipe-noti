import { StyleSheet } from "react-native";
import {
  MyContainer,
  MyText,
  Spacer,
} from "@/components";

const Me = () => {
  return (
    <MyContainer style={styles.container}>
      <Spacer />
      <MyText title={false} style={styles.title}>
        This is Me page.
      </MyText>
    </MyContainer>
  )
};

export default Me;

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