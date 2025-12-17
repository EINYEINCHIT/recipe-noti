import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { Message, MessageTypeEnum } from "@/types";
import { Colors } from "@/constants";
import { useAuthStore } from "@/stores";
// components
import ParentMessage from "./ParentMessage";

type MessageTextCardProps = {
  item: Message;
  onToggleSource: (type: MessageTypeEnum) => void;
  onFocus: (event?: any) => void;
};

const MessageTextCard: React.FC<MessageTextCardProps> = ({
  item,
  onToggleSource,
  onFocus,
}) => {
  const { width } = useWindowDimensions();
  const user = useAuthStore((state) => state.user);

  const showParentMessage = item.parent_message_id && !(item.textMessage && item.fileMessage);

  const isUrlLink = (message: string) => {
    if (!message) return false;

    const decodedMessage = message
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&");

    const urlRegex = /(https?:\/\/[^\s]+)/;
    const anchorRegex =
      /<a\s+(?:[^>]*?\s+)?href=["'](https?:\/\/[^\s"']+)["']/i;

    return urlRegex.test(decodedMessage) && !anchorRegex.test(decodedMessage);
  };

  const formattedContent = (item: Message) => {
    if (!item?.textMessage) {
      return { type: "text", value: item.type };
    }

    const content = item.textMessage.content;

    if (isUrlLink(content)) {
      return { type: "link", value: content };
    }

    return { type: "text", value: content };
  };

  const content = formattedContent(item);

  const handleCardClick = () => {
    if (item?.source?.sent_from_url || item?.source?.instant_messaging_type) {
      onToggleSource(MessageTypeEnum.TEXT);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCardClick}
      style={[
        styles.card,
        user?.user_id === item.user_id ? styles.rightCard : styles.leftCard,
      ]}
      activeOpacity={0.8}
    >
      {showParentMessage && (
        <ParentMessage item={item} />
      )}

      <View style={styles.messageWrapper}>
        <RenderHtml
          contentWidth={width}
          source={{ html: content.value }}
          renderersProps={{
            a: {
              onPress: (event, href) => {
                Linking.openURL(href);
              },
            },
          }}
        />
      </View>
    </TouchableOpacity>
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
  messageWrapper: {
  },
});

export default MessageTextCard;
