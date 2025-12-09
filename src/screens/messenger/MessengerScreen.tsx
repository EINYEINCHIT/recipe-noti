import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MyContainer, MyText } from "@/components";

type MessengerScreenProps = {
  roomId: string;
};

type Message = {
  id: string;
  text: string;
  fromMe: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  { id: "1", text: "Hi there! 👋", fromMe: false },
  { id: "2", text: "Welcome to the chat screen.", fromMe: false },
  { id: "3", text: "Type a message below to get started.", fromMe: true },
];

export const MessengerScreen: React.FC<MessengerScreenProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      fromMe: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleAttach = () => {
    // Placeholder for attach action (e.g., open file picker)
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.fromMe ? styles.messageFromMe : styles.messageFromOther,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <MyContainer style={styles.container}>
      {/* Top navigation bar */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Messenger {roomId}</Text>
      </View>

      {/* Chat content */}
      <KeyboardAvoidingView
        style={styles.chatWrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Message list */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input area */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAttach}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>+</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!input.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MyContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  navBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  chatWrapper: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  messageFromMe: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
  },
  messageFromOther: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e7eb",
  },
  messageText: {
    color: "#111827",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
    marginRight: 6,
  },
  iconText: {
    fontSize: 20,
    lineHeight: 20,
    color: "#374151",
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    fontSize: 14,
    marginRight: 6,
  },
  sendButton: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2563eb",
  },
  sendButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  sendText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
