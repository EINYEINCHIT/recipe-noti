import { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Portal, Dialog, Button, RadioButton } from "react-native-paper";
import { Colors } from "@/constants";
import { MyText } from "@/components";
import { useMessengerStore, useAuthStore } from "@/stores";
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
  isSupplierRoom,
  onSendMessage,
  updateRoomStatus,
  checkSnoozeTime,
}) => {
  const activeRoom = useMessengerStore((state) => state.activeRoom);
  const participants = useMessengerStore((state) => state.participants);
  const services = useMessengerStore((state) => state.services);
  const user = useAuthStore((state) => state.user);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const transferService = async () => {
    if (!user) {
      Alert.alert("Transfer service", "User information is not available.");
      return;
    }

    if (!services || services.length === 0) {
      Alert.alert("Transfer service", "No services available to transfer.");
      return;
    }

    setSelectedServiceId(null);
    setDialogVisible(true);  
  };

  const handleConfirm = () => {
    if (!user || !selectedServiceId) {
      setDialogVisible(false);
      return;
    }

    onSendMessage({
      user_id: user.user_id,
      type: "TRANSFER",
      service_id: selectedServiceId,
    });
    setDialogVisible(false);
  };

  return (
    <>
      <View style={styles.navBar}>
        <Text style={styles.title}>{activeRoom?.display_name}</Text>
        <TouchableOpacity onPress={transferService}>
          <Ionicons name="add-circle" size={30} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* Transfer Service Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Transfer to Service</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => setSelectedServiceId(Number(value))}
              value={selectedServiceId?.toString() ?? ""}
            >
              {services.map((service) => (
                <View
                  key={service.id}
                  style={styles.serviceOption}
                >
                  <RadioButton
                    value={service.id.toString()}
                    color={Colors.primary[500]}
                  />
                  <MyText>{service.name}</MyText>
                </View>
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity onPress={() => setDialogVisible(false)}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmBtn}>Confirm</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
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
    fontSize: 14,
    fontWeight: 700,
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelBtn: {
    color: Colors.error,
    marginRight: 15,
  },
  confirmBtn: {
    color: Colors.primary[500],
  },
});