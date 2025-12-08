import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, Chip } from "react-native-paper";
import { Notification } from "@/types";
import { Colors } from "@/constants";
import { formatDate } from "@/utils";
import { useAuthStore } from "@/stores";

interface NotiItemProps {
  item: Notification;
  onClickNoti: (item: Notification) => void;
}

const NotiItem: React.FC<NotiItemProps> = ({ item, onClickNoti }) => {
  const user = useAuthStore((state) => state.user);

  const isUnRead =
    item?.staffNotiReadBy.map((r) => r.user_id).includes(user?.user_id) === false;

  return (
    <TouchableOpacity
      style={[styles.notiItem, isUnRead && styles.unread]}
      onPress={() => onClickNoti(item)}
    >
      <View style={styles.notiHeader}>
        <Avatar.Text size={40} label="💬" style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item?.title}:</Text>
          <Text style={styles.description}>
            {item?.description.replace(/<[^>]+>/g, "")}
          </Text>
        </View>
      </View>

      <View style={styles.notiInfo}>
        <Chip style={styles.chip} textStyle={styles.chipText} mode="outlined">
          {item?.ms_name}
        </Chip>
        <Text style={styles.datetime}>
          {formatDate(item?.created_at, "fromNow")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(NotiItem);

const styles = StyleSheet.create({
  notiItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.gray[200],
  },
  unread: {
    backgroundColor: Colors.primary[50],
  },
  notiHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    backgroundColor: Colors.primary[200],
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
  },
  description: {
    color: Colors.gray[500],
  },
  notiInfo: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    marginLeft: 50,
  },
  chipText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  datetime: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.gray[400],
    alignSelf: "flex-end",
  },
});
