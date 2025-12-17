import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { MyContainer, RequiredAuth } from "@/components";
import { Colors, LIMIT, ORDER, SUPPLY_CHAIN_SERVICE_ID } from "@/constants";
import { Message } from "@/types";
import { useAuthStore, useMessengerStore } from "@/stores";
import SocketService from "@/services/wss.service";
// components
import MessengerNavbar from "./components/MessengerNavbar";
import MessengerContent from "./components/MessengerContent";

type MessengerScreenProps = {
  roomId: string;
};

export const MessengerScreen: React.FC<MessengerScreenProps> = ({ roomId }) => {
  const user = useAuthStore((state) => state.user);
  const [isInitializing, setIsInitializing] = useState(true);
  const {
    addMessage,
    getMessages,
    getRoomById,
    getParticipants,
    getServices,
    getOrderDetails,
    readMessage,
    resetMessenger,
  } = useMessengerStore((state) => state);
  const messages = useMessengerStore((state) => state.messages);
  const activeRoom = useMessengerStore((state) => state.activeRoom);
  const participants = useMessengerStore((state) => state.participants);
  const services = useMessengerStore((state) => state.services);
  const orderDetails = useMessengerStore((state) => state.orderDetails);

  /** -------------------- Init Data -------------------- */
  useEffect(() => {
    getServices({ page: 1, limit: LIMIT, order: ORDER });
    return () => resetMessenger(); // cleanup on exit
  }, []);

  // Initialize room, participants, and messages before showing UI
  useEffect(() => {
    let isMounted = true;

    const initRoomData = async () => {
      try {
        setIsInitializing(true);

        await getRoomById(Number(roomId));
        const activeRoom = useMessengerStore.getState().activeRoom;

        if (activeRoom) await getParticipants(activeRoom.memberships);

        await getMessages({
          room_id: Number(roomId),
          page: 1,
          limit: LIMIT,
          order: ORDER,
        });
      } catch (err: any) {
        console.warn("Init messenger error:", err);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initRoomData();

    return () => {
      isMounted = false;
    };
  }, [roomId, getRoomById, getParticipants, getMessages]);

  useEffect(() => {
    if (
      activeRoom?.is_tag_room &&
      activeRoom?.roomTags?.length &&
      activeRoom?.roomTags[0]?.tag?.type === "order"
    ) {
      const order_id = activeRoom?.roomTags[0]?.tag_value;
      getOrderDetails({
        ajax: 1,
        order_id: Number(order_id),
        action: "GetOrder",
        key: "CHATKEY",
      });
    }
  }, [orderDetails]);

  /* ------------------------- Helper Flags ------------------------- */
  const filteredServices = services.filter(
    (s) => s.id !== activeRoom?.service?.id
  );

  const lineConnected = ((): boolean => {
    try {
      const arr = participants
        .filter((p) => p.user?.id == activeRoom?.owner_id)
        .flatMap((p) => p.user?.lineCustomers || []);
      return arr.length > 0;
    } catch (e) {
      return false;
    }
  })();

  const supplierChatServiceIdRaw = SUPPLY_CHAIN_SERVICE_ID;
  const parsedSupplierServiceId = Number(supplierChatServiceIdRaw);
  const supplierChatServiceId = Number.isNaN(parsedSupplierServiceId)
    ? null
    : parsedSupplierServiceId;

  const isSupplierRoom = ((): boolean => {
    if (supplierChatServiceId === null) return false;
    const currentServiceId = Number(activeRoom?.service?.id);
    return (
      !Number.isNaN(currentServiceId) &&
      currentServiceId === supplierChatServiceId
    );
  })();

  /* ------------------------- Socket setup ------------------------- */
  useEffect(() => {
    if (!user) return;
    if (!SocketService.isAliveSocket()) {
      SocketService.setupSocketConnection(user.user_id, user.token);
    }
  }, [user]);

  /* ------------------------- Messenger Navbar Actions ------------------------- */
  const handleSendMessage = useCallback(
    (event: any) => {
      SocketService.sendMessage({ room_id: Number(roomId), ...event });
    },
    [roomId]
  );

  const updateRoomStatus = () => {
    console.log("TODO: updateRoomStatus");
  };

  /* ------------------------- Messenger Content Actions ------------------------- */
  const handleFindMessage = useCallback(
    async (messageId: number) => {
      console.log("TODO: findMessageListener");
      await getMessages({ message_id: messageId });
      // setTimeout(() => {
      //   messengerContentRef.current?.scrollToTarget?.(messageId);
      // }, 100);
    },
    [getMessages]
  );

  /* ------------------------- Socket & message handling ------------------------- */
  useEffect(() => {
    const handleIncomingMessage = async (messageDetail: Message) => {
      try {
        if (messageDetail.room_id === Number(roomId)) {
          addMessage(messageDetail);
          await readMessage({ room_id: Number(roomId), seen_by_staff: true });
        }
      } catch (err: any) {
        console.warn("addMessage Error: ", err);
      }
    };

    SocketService.onMessageReceived<Message>(handleIncomingMessage);

    return () => {
      SocketService.offMessageReceived<Message>(handleIncomingMessage);
    };
  }, [roomId, getRoomById, addMessage, readMessage]);

  return (
    <RequiredAuth>
      <MyContainer style={styles.container} edges={["bottom"]}>
        {isInitializing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[500]} />
          </View>
        ) : (
          <View style={styles.container}>
            <MessengerNavbar
              roomId={roomId}
              lineConnected={lineConnected}
              services={filteredServices}
              isSupplierRoom={isSupplierRoom}
              onSendMessage={handleSendMessage}
              updateRoomStatus={updateRoomStatus}
              checkSnoozeTime={getRoomById}
            />
            <MessengerContent
              roomId={roomId}
              isSupplierRoom={isSupplierRoom}
              supplierChatServiceId={supplierChatServiceId}
              onSendMessage={handleSendMessage}
              onFindMessage={handleFindMessage}
            />
          </View>
        )}
      </MyContainer>
    </RequiredAuth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
