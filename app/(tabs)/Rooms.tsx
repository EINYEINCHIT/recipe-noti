import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Rooms = () => {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>This is Rooms page.</Text>
      </View>
    </SafeAreaView>
  );
};
export default Rooms;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});