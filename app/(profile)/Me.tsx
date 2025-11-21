import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>This is Profile page.</Text>
      </View>
    </SafeAreaView>
  )
};
export default Profile;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});