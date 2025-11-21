import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants";
import { MyButton } from "@/components";
import { SafeAreaView } from "react-native-safe-area-context";

const Noti = () => {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>This is Notifications page.</Text>
      </View>
    </SafeAreaView>
  );
};
export default Noti;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});