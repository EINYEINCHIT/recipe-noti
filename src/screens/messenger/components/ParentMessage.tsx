import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const ParentMessage = ({ item, memberships, participants, user, onFocusEvent }) => {
  const isMyMessage = user?.user_id === item.user_id;

  const renderName = () => {
    const parentUserId = item.parent.user_id;
    const parentMembership = memberships.find((m) => m.user_id === parentUserId);

    if (!parentMembership) return "Unknown";

    if (parentMembership.type === "CUSTOMER") {
      const index = memberships.filter((m) => m.type === "CUSTOMER").findIndex((m) => m.user_id === parentUserId);
      return `Cu ${index + 1}`;
    } else if (parentMembership.type === "BOT") {
      return "BOT";
    } else {
      return user?.user_id === parentUserId ? "You:" : "Staff:";
    }
  };

  const fileType = item.parent.fileMessage?.url
    ? getFileType(item.parent.fileMessage.url)
    : null;

  function getFileType(url) {
    const ext = url.split('.').pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "image";
    if (["mp4", "mov", "webm"].includes(ext)) return "video";
    return "application";
  }

  const renderContent = () => {
    if (item.parent.textMessage) {
      return <Text style={styles.message}>{item.parent.textMessage.content}</Text>;
    } else if (item.parent.fileMessage) {
      if (fileType === "image") return <Text style={styles.message}>IMAGE</Text>;
      if (fileType === "video") return <Text style={styles.message}>VIDEO</Text>;
      if (fileType === "application") return <Text style={styles.message}>FILE</Text>;
    } else if (item.parent.orderMessage) {
      return <Text style={styles.message}>{item.parent.orderMessage.content}</Text>;
    } else if (item.parent.transferMessage) {
      return <Text style={styles.message}>
        Transfer to {item.parent.transferMessage?.service?.name}
      </Text>;
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}
      onPress={() => onFocusEvent(item.parent_message_id)}
    >
      <Text style={styles.name}>{renderName()}</Text>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
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
});

export default ParentMessage;