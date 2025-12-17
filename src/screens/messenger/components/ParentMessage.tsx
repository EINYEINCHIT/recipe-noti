import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { MembershipTypeEnum, Message } from "@/types";
import { getFileType } from "@/services";
import { Colors } from "@/constants";
import { formatDate, formatParticipantName } from "@/utils";
import { useAuthStore, useMessengerStore } from "@/stores";

type ParentMessageProps = {
  item: Message;
  isAttachment?: boolean;
  onFocus?: (event?: any) => void;
};

const ParentMessage: React.FC<ParentMessageProps> = ({
  item,
  isAttachment = false,
  onFocus,
}) => {
  const user = useAuthStore((state) => state.user);
  const activeRoom = useMessengerStore((state) => state.activeRoom);
  const participants = useMessengerStore((state) => state.participants);

  const fileType = item?.parent?.fileMessage?.url
    ? getFileType(item?.parent?.fileMessage.url)
    : null;

  const renderName = () => {
    const parentUserId = item?.parent?.user_id;
    const memberships = activeRoom?.memberships || [];

    const isCustomer = memberships.some(
      (m) =>
        m.user_id === parentUserId && m.type === MembershipTypeEnum.CUSTOMER
    );

    const isBot = memberships.some(
      (m) => m.user_id === parentUserId && m.type === MembershipTypeEnum.BOT
    );

    if (isCustomer) {
      return formatParticipantName(participants as any, parentUserId, false);
    }

    if (isBot) {
      return MembershipTypeEnum.BOT;
    }

    // Staff name: "You :" or "Staff :"
    if (user?.user_id === parentUserId) {
      return "You :";
    }

    return "Staff :";
  };

  const renderContent = () => {
    if (item?.parent?.textMessage) {
      return (
        <Text style={styles.message}>{item?.parent?.textMessage?.content}</Text>
      );
    } else if (item?.parent?.fileMessage) {
      if (fileType === "image") {
        return (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <View style={styles.avatar}>
              <Entypo name="image-inverted" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.message}>IMAGE</Text>
              <Text style={styles.datetime}>{formatDate(item.created_at, "fromNow")}</Text>
            </View>
          </View>
        );
      }
      if (fileType === "video") {
        return (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <View style={styles.avatar}>
              <FontAwesome name="video-camera" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.message}>VIDEO</Text>
              <Text style={styles.datetime}>{formatDate(item.created_at, "fromNow")}</Text>
            </View>
          </View>
        );
      }
      if (fileType === "application") {
        return (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <View style={styles.avatar}>
              <FontAwesome name="file-text" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.message}>FILE</Text>
              <Text style={styles.datetime}>{formatDate(item.created_at, "fromNow")}</Text>
            </View>
          </View>
        );
      }
    } else if (item?.parent?.orderMessage) {
      return (
        <Text style={styles.message}>
          {item?.parent?.orderMessage?.content}
        </Text>
      );
    } else if (item?.parent?.transferMessage) {
      return (
        <Text style={styles.message}>
          Transfer to {item?.parent?.transferMessage?.service?.name}
        </Text>
      );
    }
    return null;
  };
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isAttachment && styles.attachmentCard,
        !isAttachment &&
          (user?.user_id === item.user_id ? styles.rightCard : styles.leftCard),
      ]}
    >
      <Text style={styles.name}>{renderName()}</Text>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    maxWidth: 250,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    marginHorizontal: -10,
    marginTop: -10,
    marginBottom: 10,
    padding: 10,
    position: "relative",
  },
  attachmentCard: {
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    backgroundColor: Colors.primary[50],
  },
  rightCard: {
    backgroundColor: Colors.primary[200],
  },
  leftCard: {
    backgroundColor: Colors.gray[300],
  },
  name: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  avatar: {
    backgroundColor: Colors.primary[300],
    borderRadius: 100,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  datetime: {
    fontSize: 12,
  }
});

export default ParentMessage;