import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import { Menu, IconButton } from "react-native-paper";
import { Message, MessageTypeEnum, MembershipTypeEnum } from "@/types";
import { formatDate, formatParticipantName } from "@/utils";
import { Colors } from "@/constants";
import { downloadFile } from "@/services";
import { useAuthStore, useMessengerStore } from "@/stores";
// components
import MessageFileCard from "./MessageFileCard";
import MessageTextCard from "./MessageTextCard";
import MessageOrderCard from "./MessageOrderCard";
import MessageTransferCard from "./MessageTransferCard";

type MessageItemProps = {
  item: Message;
  roomId: string;
  onFocus: (event?: any) => void;
};

const MessageItem: React.FC<MessageItemProps> = ({ item, roomId, onFocus }) => {
  const user = useAuthStore((state) => state.user);
  const activeRoom = useMessengerStore((state) => state.activeRoom);
  const participants = useMessengerStore((state) => state.participants);

  const [activeTextId, setActiveTextId] = useState<number | null>(null);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean;}>({});

  const isCustomerMessage = activeRoom?.memberships.some(
    (elem) =>
      elem.user_id === item.user_id && elem.type === MembershipTypeEnum.CUSTOMER
  );

  const isBotMessage = activeRoom?.memberships.some(
    (elem) =>
      elem.user_id === item.user_id && elem.type === MembershipTypeEnum.BOT
  );

  const isStaffMessage = activeRoom?.memberships.some(
    (elem) => elem.type === MembershipTypeEnum.STAFF
  );

  const isSupplierMessage = activeRoom?.memberships.some(
    (elem) =>
      elem.user_id === item.user_id && elem.type === MembershipTypeEnum.SUPPLIER
  );

  const isStaffOrBotMessage = activeRoom?.memberships.some(
    (elem) =>
      elem.user_id === item.user_id &&
      elem.type !== MembershipTypeEnum.CUSTOMER &&
      elem.type !== MembershipTypeEnum.SUPPLIER
  );

  const customerIndex: any = activeRoom?.memberships
    .filter((elem) => elem.type === MembershipTypeEnum.CUSTOMER)
    .findIndex((member) => member.user_id === item.user_id);

  const customerLabel = `Cu ${customerIndex + 1}`;

  const showSource = item.textMessage
    ? activeTextId === item.id
    : activeImageId === item.id;

  const onToggleSource = (type: MessageTypeEnum) => {
    if (type === MessageTypeEnum.TEXT) {
      setActiveTextId(activeTextId === item?.id ? null : item?.id);
      setActiveImageId(null);
    } else {
      setActiveImageId(activeImageId === item?.id ? null : item?.id);
      setActiveTextId(null);
    }
  };

  const onReply = () => {
    Alert.alert("TODO: replyMessage");
  };

  const onDownload = async () => {
    const url = item.fileMessage?.url;
    const displayName = item.fileMessage?.display_name;

    if (!item.fileMessage?.is_available) return;

    try {
      setLoadingStates((prev) => ({ ...prev, [url]: true }));
      const localUri = await downloadFile(url, displayName, roomId);
      Alert.alert("Downloaded", `File saved at:\n${localUri}`);
    } catch (err: any) {
      console.warn("Download File Error: ", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [url]: false }));
    }
  };

  return (
    <View
      style={[
        styles.messageItem,
        isStaffOrBotMessage ? styles.messageItemRight : styles.messageItemLeft,
      ]}
    >
      {/* Avatar */}
      {isCustomerMessage ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{customerLabel}</Text>
        </View>
      ) : isBotMessage ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Bot</Text>
        </View>
      ) : isSupplierMessage ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Supplier</Text>
        </View>
      ) : isStaffMessage ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.user_id === item.user_id ? "You" : "Staff"}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.messageWrapper,
          isStaffOrBotMessage
            ? styles.messageWrapperRight
            : styles.messageWrapperLeft,
        ]}
      >
        {/* DateTime */}
        <View
          style={[
            styles.datetime,
            isStaffOrBotMessage ? styles.datetimeRight : styles.datetimeLeft,
          ]}
        >
          <Text style={styles.nameText}>
            {formatParticipantName(participants, item.user_id)}
          </Text>
          <Text style={styles.timeText}>
            {formatDate(item.created_at, "fromNow")}
          </Text>
        </View>

        {/* Messages */}
        <View style={{ position: "relative" }}>
          {item.fileMessage && (
            <MessageFileCard
              item={item}
              roomId={roomId}
              onToggleSource={onToggleSource}
            />
          )}

          {item.textMessage && (
            <MessageTextCard
              item={item}
              onToggleSource={onToggleSource}
              onFocus={onFocus}
            />
          )}

          {item.orderMessage && (
            <MessageOrderCard item={item} />
          )}

          {item.transferMessage && (
            <MessageTransferCard item={item} />
          )}

          {/* Download & Reply */}
          <View
            style={[
              styles.menuWrapper,
              isStaffOrBotMessage
                ? styles.menuWrapperRight
                : styles.menuWrapperLeft,
            ]}
          >
            <Menu
              visible={openMenuId === item.id}
              onDismiss={() => setOpenMenuId(null)}
              anchor={
                <IconButton
                  icon="dots-horizontal"
                  iconColor={Colors.gray[400]}
                  onPress={() =>
                    setOpenMenuId((prev: number | null) =>
                      prev === item.id ? null : item.id
                    )
                  }
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  setOpenMenuId(null);
                  onReply();
                }}
                title="Reply"
              />
              {item.fileMessage && item.fileMessage.is_available && (
                <Menu.Item
                  onPress={() => {
                    if (!loadingStates[item.fileMessage.url]) {
                      setOpenMenuId(null);
                      onDownload();
                    }
                  }}
                  title={loadingStates[item.fileMessage.url] ? "Downloading ..." : "Download"}
                />
              )}
              
            </Menu>
          </View>
        </View>

        {/* Source */}
        {showSource && item.source && (
          <View style={styles.sourceWrapper}>
            {item.source.type === "WS" && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.source.sent_from_url)}
              >
                <Text style={styles.sourceText}>
                  {item.source.sent_from_url}
                </Text>
              </TouchableOpacity>
            )}
            {item.source.type === "INSTANT_MESSAGE" && (
              <Text style={styles.sourceText}>
                {item.source.instant_messaging_type}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageItem: {
    flex: 1,
    marginVertical: 10,
  },
  messageItemLeft: {
    flexDirection: "row",
  },
  messageItemRight: {
    flexDirection: "row-reverse",
  },
  avatar: {
    backgroundColor: Colors.primary[500],
    borderRadius: 100,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  messageWrapper: {
    flexDirection: "column",
    maxWidth: "80%",
  },
  messageWrapperLeft: {
    alignItems: "flex-start",
  },
  messageWrapperRight: {
    alignItems: "flex-end",
  },
  datetime: {
    flexDirection: "row",
  },
  datetimeLeft: {
    justifyContent: "flex-start",
  },
  datetimeRight: {
    justifyContent: "flex-end",
  },
  nameText: {
    fontSize: 12,
    color: Colors.gray[400],
  },
  timeText: {
    fontSize: 12,
    color: Colors.gray[400],
  },
  sourceWrapper: {
    marginTop: 4,
    marginHorizontal: 6,
  },
  sourceText: {
    color: "#007bff",
    fontSize: 11,
  },
  menuWrapper: {
    width: 20,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  menuWrapperRight: {
    position: "absolute",
    left: -30,
    top: "45%",
  },
  menuWrapperLeft: {
    position: "absolute",
    right: -30,
    top: "45%",
  },
});

export default MessageItem;
