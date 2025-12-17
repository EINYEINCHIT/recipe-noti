import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { SUPPLY_CHAIN_SERVICE_ID } from "@/constants";
import { useMessengerStore } from "@/stores";
import { Message } from "@/types";
// components
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
// import PreviewDialog from "./PreviewDialog";
// import QuickReplyDialog from "./QuickReplyDialog";
// import SocketService from "@/services/wss.service";

type MessengerContentProps = {
  roomId: string;
  isSupplierRoom: boolean;
  supplierChatServiceId: number | null;
  onSendMessage: (event?: any) => void;
  onFindMessage: (event?: any) => void;
};

const MessengerContent: React.FC<MessengerContentProps> = ({
  roomId,
  isSupplierRoom,
  supplierChatServiceId,
  onSendMessage,
  onFindMessage,
}) => {
  const messages = useMessengerStore((state) => state.messages);
  const activeRoom = useMessengerStore((state) => state.activeRoom);
  const participants = useMessengerStore((state) => state.participants);
  const orderDetails = useMessengerStore((state) => state.orderDetails);

  const [loadingStates, setLoadingStates] = useState({});
  const [messageApproval, setMessageApproval] = useState(null);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);

  /* ------------------------- Messenger List Actions ------------------------- */

  const handleSendMessage = (data: any) => {
    // if (!data.botMessageApporval) {
    //   setMessageApproval(null);
    // }
    onSendMessage(data);
  };

  const handleReplyMessage = (message: Message) => {
    if (isSupplierRoom) return;
    setReplyMessage(message);
  };

  const openReplyDialog = () => {
    console.log("TODO: openReplyDialog");
  };

  const onGenerateAiMessage = () => {
    console.log("TODO: onGenerateAiMessage");
  };

  const approveMessage = () => {
    console.log("TODO: approveMessage");
  };

  const rejectMessage = () => {
    console.log("TODO: rejectMessage");
  };

  const updateApprovalMessage = () => {
    console.log("TODO: updateApprovalMessage");
  };

  const updateApprovalInstruction = () => {
    console.log("TODO: updateApprovalInstruction");
  };

  // const getRequestMessage = async () => {
  //   if (!serviceID) return;
  //   try {
  //     const res = await axios.get(`/chat-bot/getAiApproval/${serviceID}`);
  //     if (res.data.statusCode === 200 && res.data.content) {
  //       setMessageApproval(res.data.content);
  //     } else {
  //       setMessageApproval(null);
  //     }
  //   } catch {
  //     setMessageApproval(null);
  //   }
  // };

  // useEffect(() => {
  //   getRequestMessage();
  // }, [serviceID]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // useEffect(() => {
  //   const messageApprovalHandler = (msgApproval) => {
  //     setMessageApproval(msgApproval);
  //   };
  //   const rejectHandler = ({ room_id }) => {
  //     setMessageApproval(null);
  //   };
  //   SocketService.onMessageApprovalReceived(messageApprovalHandler);
  //   SocketService.onRejectChatBotMessage(rejectHandler);
  //   return () => {
  //     SocketService.offMessageApprovalReceived(messageApprovalHandler);
  //     SocketService.offRejectChatBotMessage(rejectHandler);
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <MessageList
        roomId={roomId}
        onFindMessage={onFindMessage}
        onReply={handleReplyMessage}
        onApprove={approveMessage}
        onReject={rejectMessage}
        onUpdateApprovalMessage={updateApprovalMessage}
        onUpdateApprovalInstruction={updateApprovalInstruction}
      />

      {!isSupplierRoom && (
        <MessageInput
          roomId={roomId}
          parentMessage={replyMessage}
          onClearParentMessage={() => setReplyMessage(null)}
          onSendMessage={handleSendMessage}
          onOpenQuickReply={openReplyDialog}
          onGenerateAiMessage={onGenerateAiMessage}
        />
      )}

      {/* <QuickReplyDialog ref={quickReplyDialogRef} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MessengerContent;
