import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants";
import { useMessengerStore } from "@/stores";
import { LIMIT, ORDER } from "@/constants";
// components
import MessageItem from "./MessageItem";
import MessageApproval from "./MessageApproval";

type MessageListProps = {
  roomId: string;
  onFindMessage: (event?: any) => void;
  onApprove: (event?: any) => void;
  onReject: (event?: any) => void;
  onUpdateApprovalMessage: (event?: any) => void;
  onUpdateApprovalInstruction: (event?: any) => void;
};

const MessageList: React.FC<MessageListProps> = ({
  roomId,
  onFindMessage,
  onApprove,
  onReject,
  onUpdateApprovalMessage,
  onUpdateApprovalInstruction,
}) => {
  const messages = useMessengerStore((state) => state.messages);
  const { getMessages, incrementMessagePage } = useMessengerStore();
 
  const loading = messages.loading;
  const page = messages.page;
  const total = messages.total;

  const loadMoreMessages = async () => {
    if (loading) return;

    if (page >= total) return;

    incrementMessagePage();

    await getMessages({
      room_id: Number(roomId),
      page: page + 1,
      limit: LIMIT,
      order: ORDER,
    });
  };

  // const [localShowAlert, setLocalShowAlert] = useState(isAlert);

  // useEffect(() => {
  //   setLocalShowAlert(isAlert);
  // }, [isAlert]);

  const scrollToTarget = () => {
    console.log("TODO: scrollToTarget");
  };

  return (
    <>
      {/* {localShowAlert && orderDetails && (
        <View style={styles.alert}>
          <View>
            <Text style={styles.alertText}>
              <Text style={styles.bold}>Submitted Date:</Text>{" "}
              {orderDetails.submitted_at}
            </Text>
            <Text style={styles.alertText}>
              <Text style={styles.bold}>Amount:</Text> {orderDetails.amount}{" "}
              {orderDetails.currency_symbol}
            </Text>
            <Text style={styles.alertText}>
              <Text style={styles.bold}>Status:</Text> {orderDetails.status}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setLocalShowAlert(false);
              onUpdateShowAlert?.(false);
            }}
          >
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <FlatList
        inverted
        data={messages.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageItem
            item={item}
            roomId={roomId}
            onFocus={scrollToTarget}
          />
        )}
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          messages.loading ? <ActivityIndicator size="large" color={Colors.primary[500]} /> : null
        }
      />

      {/* {messageApproval && messageApproval.message && (
        <MessageApproval
          messageApproval={messageApproval}
          onApprove={onApprove}
          onReject={onReject}
          onUpdateMessage={onUpdateApprovalMessage}
          onUpdateInstruction={onUpdateApprovalInstruction}
        />
      )} */}
    </>
  );
};

const styles = StyleSheet.create({});

export default MessageList;
