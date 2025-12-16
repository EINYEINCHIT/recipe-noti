import React, { useEffect, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { AntDesign } from "@expo/vector-icons";
import { getFileType, getBase64File } from "@/services";
import { Message, MessageTypeEnum } from "@/types";
import { Colors } from "@/constants";
import { useAuthStore } from "@/stores";
// components
import ParentMessage from "./ParentMessage";

type MessageFileCardProps = {
  item: Message;
  roomId: string;
  onToggleSource: (type: MessageTypeEnum) => void;
};

const MessageFileCard: React.FC<MessageFileCardProps> = ({
  item,
  roomId,
  onToggleSource,
}) => {
  const user = useAuthStore((state) => state.user);
  const [base64, setbase64] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileType = getFileType(item?.fileMessage?.url);

  const isImageOrVideo = fileType === "image" || fileType === "video";

  useEffect(() => {
    const loadImageOrVideo = async () => {
      const file = await getBase64File("chat", item.fileMessage.url, roomId);
      setbase64(file);
    };

    loadImageOrVideo();
  }, [item.fileMessage.url, roomId]);

  const handleCardClick = () => {
    if (item?.source?.sent_from_url || item?.source?.instant_messaging_type) {
      onToggleSource(MessageTypeEnum.FILE);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCardClick}
      style={[
        styles.card,
        user?.user_id === item.user_id ? styles.rightCard : styles.leftCard,
        isImageOrVideo && { width: 220, height: 220, justifyContent: "center" }
      ]}
      activeOpacity={0.8}
    >
      {/* {item.parent_message_id && (
        <ParentMessage
          item={item}
          memberships={memberships}
          participants={participants}
          onFocusEvent={onFocusEvent}
        />
      )} */}

      <View style={styles.fileWrapper}>
        {isImageOrVideo && !base64 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary[500]} />
          </View>
        )}

        {fileType === "image" && base64 && (
          <TouchableOpacity onPress={() => setShowPreview(true)}>
            <Image
              source={{ uri: base64 }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {fileType === "video" && base64 && (
          <Video
            source={{ uri: base64 }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
          />
        )}

        {fileType === "application" && (
          <View style={styles.docWrapper}>
            <Text style={styles.fileName}>{item.fileMessage.display_name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <AntDesign
                name={item.fileMessage.is_available ? "file-text" : "file-unknown"}
                size={20}
              />

              {!item.fileMessage.is_available && (
                <Text style={styles.notAvailable}>This file is no longer available for download.</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Preview image */}
      {fileType === "image" && base64 && (
        <Modal
          visible={showPreview}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPreview(false)}
        >
          <TouchableOpacity style={styles.previewOverlay} activeOpacity={1} onPress={() => setShowPreview(false)}>
            <Image
              source={{ uri: base64 }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      )}
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
  replyBtn: {
    position: "absolute",
    top: 5,
    right: -35,
  },
  replyText: {
    fontSize: 18,
  },
  fileWrapper: {
    marginTop: 5,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  video: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  docWrapper: {
    padding: 10,
  },
  fileName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  notAvailable: {
    color: Colors.gray[500],
    fontSize: 12,
    marginBottom: 5,
  },
  previewOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  previewScroll: {
    flex: 1,
  },
  previewScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
});

export default MessageFileCard;
