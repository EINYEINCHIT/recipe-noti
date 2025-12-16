import { StyleSheet, View, Text } from "react-native";
import { Colors } from "@/constants";
import { MyText } from "@/components";
import { useMessengerStore } from "@/stores";
import { Service } from "@/types";

type MessengerNavbarProps = {
  roomId: string;
  lineConnected: boolean;
  services: Service[];
  isSupplierRoom: boolean;
  onSendMessage: (event?: any) => void;
  updateRoomStatus: (status: boolean) => void;
  checkSnoozeTime: (roomId: number) => void;
};

const MessengerNavbar: React.FC<MessengerNavbarProps> = ({
  roomId,
  lineConnected,
  services,
  isSupplierRoom,
  onSendMessage,
  updateRoomStatus,
  checkSnoozeTime,
}) => {
  const { activeRoom, participants } = useMessengerStore((state) => state);

  return (
    <View style={styles.navBar}>
      <MyText style={styles.title}>{ activeRoom?.display_name }</MyText>
    </View>
  );
};

export default MessengerNavbar;

const styles = StyleSheet.create({
  navBar: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
  },
});