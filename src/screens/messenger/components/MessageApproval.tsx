import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { formatDistanceToNow } from "date-fns"; // for "fromNow" formatting

const MessageApproval = ({ messageApproval, onApprove, onReject, onUpdateMessage, onUpdateInstruction }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableMessage, setEditableMessage] = useState(messageApproval.message || "");
  const [instruction, setInstruction] = useState("");
  const editableRef = useRef(null);

  useEffect(() => {
    if (messageApproval.message !== editableMessage) {
      setEditableMessage(messageApproval.message || "");
    }
  }, [messageApproval]);

  const handleInputChange = (text) => {
    setEditableMessage(text);
    onUpdateMessage && onUpdateMessage(text);
  };

  const handleInstructionChange = (text) => {
    setInstruction(text);
    onUpdateInstruction && onUpdateInstruction(text);
  };

  return (
    <View style={styles.container}>
      {/* Bot Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>Bot</Text>
        </View>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(new Date(messageApproval.created_at), { addSuffix: true })}
        </Text>
      </View>

      {/* Approval Card */}
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerIcon}>☑️</Text>
            <Text style={styles.headerText}>Approval Request</Text>
          </View>
          <View style={styles.headerRight}>
            <Switch value={isEditMode} onValueChange={setIsEditMode} />
          </View>
        </View>

        {/* Editable / Preview */}
        {isEditMode ? (
          <TextInput
            ref={editableRef}
            style={styles.editable}
            multiline
            value={editableMessage}
            onChangeText={handleInputChange}
          />
        ) : (
          <Text style={[styles.editable, { backgroundColor: "#f0f0f0" }]}>{editableMessage}</Text>
        )}

        <Text style={styles.instructionTitle}>Instruction</Text>
        <TextInput
          style={styles.editable}
          multiline
          placeholder="Instructions"
          value={instruction}
          onChangeText={handleInstructionChange}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => onApprove(messageApproval)}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => onReject(messageApproval)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "flex-end",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1976D2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timestamp: {
    marginLeft: 8,
    fontSize: 12,
    color: "#555",
  },
  card: {
    backgroundColor: "#f5f9ff",
    padding: 16,
    borderRadius: 12,
    maxWidth: 420,
    width: "90%",
    borderWidth: 1,
    borderColor: "#cfdff7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerRight: {
    height: 40,
    justifyContent: "center",
  },
  editable: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbe7fb",
    minHeight: 80,
    marginBottom: 12,
    textAlignVertical: "top",
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  approveButton: {
    backgroundColor: "#1976D2",
  },
  rejectButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default MessageApproval;