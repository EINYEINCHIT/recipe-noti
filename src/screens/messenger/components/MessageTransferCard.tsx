import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "@/types";
import { Colors } from "@/constants";
import { useAuthStore } from "@/stores";

type MessageTransferCardProps = {
  item: Message;
};

const MessageTransferCard: React.FC<MessageTransferCardProps> = ({ item }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <View
      style={[
        styles.card,
        user?.user_id === item.user_id ? styles.rightCard : styles.leftCard,
      ]}
    >
      {/* <TouchableOpacity onPress={() => onReply(item)} style={styles.replyBtn}>
        <Text style={styles.replyText}>↩️</Text>
      </TouchableOpacity> */}

      <View style={styles.messageWrapper}>
        <Text>
          Transfer to {item.transferMessage?.service?.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    maxWidth: 250,
    marginTop: 5,
    padding: 10,
    borderRadius: 10,
    position: "relative",
    boxShadow: '0px 2px 2px -1px rgba(9, 30, 66, 0.15)',
  },
  rightCard: {
    backgroundColor: Colors.primary[100],
  },
  leftCard: {
    backgroundColor: Colors.white,
  },
  replyBtn: {
    position: "absolute",
    top: 5,
    right: -35,
  },
  replyText: {
    fontSize: 18,
  },
  messageWrapper: {
    marginTop: 5,
  },
});

export default MessageTransferCard;
