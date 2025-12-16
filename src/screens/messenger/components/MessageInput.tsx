import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "@/constants";
import { useAuthStore } from "@/stores";
import { FILE_TYPE, FILE_UPLOAD_SIZE, getFileType, uploadFile } from "@/services";
// components
import ParentMessage from "./ParentMessage";
import { MessageTypeEnum } from "@/types";

type MessageInputProps = {
  roomId: string;
  onSendMessage: (event?: any) => void;
  onOpenQuickReply: (event?: any) => void;
  onGenerateAiMessage: (event?: any) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({
  roomId,
  onSendMessage,
  onOpenQuickReply,
  onGenerateAiMessage,
}) => {
  const user = useAuthStore((state) => state.user);
  const [chatMessage, setChatMessage] = useState("");
  const [parentMessage, setParentMessage] = useState<any | null>(null);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [filename, setFilename] = useState("");
  const [fileDisplayName, setFileDisplayName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleSendMessage = async () => {
    if (!user) return;
    if (isSending) return;
    setIsSending(true);

    const data: {
      user_id: number;
      parent_message_id?: number;
      type?: MessageTypeEnum;
      text?: string;
      file_name?: string;
      file_display_name?: string;
    } = { user_id: user.user_id };

    if (!!parentMessage) {
      data["parent_message_id"] = parentMessage.id;
    }

    if (chatMessage.trim() !== "") {
      data["type"] = MessageTypeEnum.TEXT;
      data["text"] = chatMessage.trim().replace(/\n/g, "<br>");
    }

    if (filename.trim() !== "" && file) {
      try {
        const uploadResult = await handleUpload(file);
        if (!uploadResult) return;
        const { storedFileName, storedDisplayName } = uploadResult;

        data["type"] = MessageTypeEnum.FILE;
        data["file_name"] = storedFileName.trim();
        data["file_display_name"] = storedDisplayName.trim();
      } catch (err: any) {
        console.warn("Upload file error: ", err);
        setIsSending(false);
        return;
      }
    }

    if (data.text || data.file_name) {
      onSendMessage(data);
      clearMessage();
      clearFile();
    }

    setIsSending(false);
  };

  const clearMessage = () => {
    setChatMessage("");
    setParentMessage(null);
  };

  const clearFile = () => {
    setFile(null);
    setFilename("");
    setFileDisplayName("");
  };

  const handleUpload = async (asset: DocumentPicker.DocumentPickerAsset) => {
    const formData = new FormData();
    formData.append("section", "chat");
    formData.append("file", {
      uri: asset.uri,
      name: asset.name || "file",
      type: asset.mimeType || "application/octet-stream",
    } as any);

    try {
      const res = await uploadFile(formData);
      const storedFileName: string = res.key.split("/")[1];
      const storedDisplayName: string = res.display_name;
      
      setFilename(storedFileName);
      setFileDisplayName(storedDisplayName);
      return { storedFileName, storedDisplayName };
    } catch (err: any) {
      console.warn("File Upload Error: ", err);
    }
  };

  const onSelectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const pickedName = asset.name || "file";

        const fileExtension = pickedName.split(".").pop()?.toUpperCase();
        const fileType = getFileType(pickedName);
        const fileSize = asset.size ?? 0;

        const isValidType = fileType && fileExtension && FILE_TYPE[fileType].includes(fileExtension);
        if (!isValidType) {
          Alert.alert("Invalid file", "Unsupported file type.");
          clearFile();
          return;
        }

        if (fileSize >= FILE_UPLOAD_SIZE) {
          Alert.alert("File too large", "Allowed maximum size is 5 MB.");
          clearFile();
          return;
        }

        setFile(asset);
        setFilename(pickedName);
      }
    } catch (err) {
      Alert.alert("Error!", "Failed to select file");
    }
  };

  // const generateAiMessage = async () => {
  //   if (isGeneratingAi) return;
  //   setIsGeneratingAi(true);
  //   try {
  //     await axios.post(`/chat-bot/generate-manual/${roomId}`);
  //     Alert.alert("Success", "AI message generated successfully!");
  //     onGenerateAiMessage();
  //   } catch (err) {
  //     Alert.alert("Error", "Failed to generate AI message");
  //   } finally {
  //     setIsGeneratingAi(false);
  //   }
  // };

  return (
    <View style={styles.footer}>
      {/* {parentMessage && (
        <View style={styles.parentMessageWrapper}>
          <ParentMessage
            item={{ user_id: user?.user_id, parent: parentMessage }}
            memberships={memberships}
            participants={participants}
          />
          <TouchableOpacity onPress={() => setParentMessage(null)}>
            <Text style={{ fontSize: 18 }}>X</Text>
          </TouchableOpacity>
        </View>
      )} */}

      {file && (
        <View style={styles.fileWrapper}>
          <View style={styles.fileInfo}>
            <Feather name="file" size={24} color={Colors.white} />
            <Text numberOfLines={1} style={styles.fileName}>
              {file.name || "Selected file"}
            </Text>
          </View>

          <TouchableOpacity onPress={clearFile} style={styles.removeFileButton}>
            <Ionicons name="close-circle" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        {/* <TouchableOpacity onPress={onOpenQuickReply}>
          <Ionicons name="flash" size={20} style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={generateAiMessage}>
          <Ionicons name="sparkles" size={20} style={styles.iconButton} />
        </TouchableOpacity> */}

        <TextInput
          value={chatMessage}
          onChangeText={setChatMessage}
          placeholder="Enter a message"
          multiline
          style={styles.textInput}
          onSubmitEditing={handleSendMessage}
        />

        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={24} style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSelectFile}>
          <Ionicons name="attach" size={24} style={styles.iconButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  parentMessageWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  fileWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primary[500],
    borderRadius: 6,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
    color: Colors.white,
  },
  removeFileButton: {
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray[400],
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    maxHeight: 120,
  },
  iconButton: {
    color: Colors.gray[400],
    marginHorizontal: 5,
  },
});

export default MessageInput;
