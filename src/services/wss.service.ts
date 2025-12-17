import { io, Socket } from "socket.io-client";
import { SOCKET_SERVER } from "@/constants";

type MessageHandler<T = any> = (payload: T) => void;

class SocketService {
  private socket: Socket | null = null;
  private supplyChainSocket: Socket | null = null;

  isAliveSocket() {
    return !!this.socket;
  }

  isSupplyChainSocketAlive() {
    return !!this.supplyChainSocket;
  }

  setupSocketConnection(userId: number | string, token?: string) {
    console.log("***** setupSocketConnection");
    if (this.socket) {
      return;
    }

    const extraHeaders: Record<string, string> | undefined = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    this.socket = io(SOCKET_SERVER, {
      path: "/socket.io",
      query: {
        userId: String(userId),
        userType: "STAFF",
      },
      extraHeaders,
      transports: ["websocket"],
    });
  }

  setupSupplyChainConnection(userId: number | string, token?: string) {
    if (this.supplyChainSocket) {
      this.supplyChainSocket.disconnect();
      this.supplyChainSocket = null;
    }

    const extraHeaders: Record<string, string> | undefined = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    this.supplyChainSocket = io(`${SOCKET_SERVER}/supply-chain`, {
      path: "/socket.io",
      query: {
        userId: String(userId),
        userType: "STAFF",
      },
      extraHeaders,
      transports: ["websocket"],
    });
  }

  /* ----------------- Main socket events ----------------- */

  onSocketError(callback: MessageHandler) {
    if (!this.socket) return;
    this.socket.off("error");
    this.socket.on("error", callback);
  }

  onMessageReceived<T = any>(callback: MessageHandler<T>) {
    if (!this.socket) return;
    this.socket.off("message");
    this.socket.on("message", callback as any);
  }

  offMessageReceived<T = any>(callback: MessageHandler<T>) {
    if (!this.socket) return;
    this.socket.off("message", callback as any);
  }

  onNotificationReceived<T = any>(callback: MessageHandler<T>) {
    if (!this.socket) return;
    this.socket.off("notification");
    this.socket.on("notification", callback as any);
  }

  sendMessage(message: any) {
    if (!this.socket) return;
    this.socket.emit("message", message);
  }

  onMessageApprovalReceived<T = any>(callback: MessageHandler<T>) {
    if (!this.socket) return;
    this.socket.off("approval.request");
    this.socket.on("approval.request", callback as any);
  }

  rejectChatBotMessage(data: {
    room_id: number | string;
    message: string;
    instruction: string;
    user_id: number | string;
  }) {
    if (!this.socket) return;
    this.socket.emit("reject.bot_message", {
      room_id: data.room_id,
      message: data.message,
      instruction: data.instruction,
      user_id: data.user_id,
    });
  }

  onRejectChatBotMessage<T = any>(callback: MessageHandler<T>) {
    if (!this.socket) return;
    this.socket.off("reject.bot_message");
    this.socket.on("reject.bot_message", callback as any);
  }

  /* ------------- Supply chain socket events ------------- */

  onPendingOrderStatusUpdated<T = any>(callback: MessageHandler<T>) {
    if (!this.supplyChainSocket) return;

    const registerListener = () => {
      if (!this.supplyChainSocket) return;
      this.supplyChainSocket.off("pending-order.status-updated");
      this.supplyChainSocket.on(
        "pending-order.status-updated",
        callback as any
      );
    };

    if (this.supplyChainSocket.connected) {
      registerListener();
    } else {
      this.supplyChainSocket.once("connect", registerListener);
    }
  }

  removePendingOrderStatusListener() {
    if (!this.supplyChainSocket) return;
    this.supplyChainSocket.off("pending-order.status-updated");
  }

  onPendingOrderCreated<T = any>(callback: MessageHandler<T>) {
    if (!this.supplyChainSocket) return;

    const registerListener = () => {
      if (!this.supplyChainSocket) return;
      this.supplyChainSocket.off("pending-order.created");
      this.supplyChainSocket.on("pending-order.created", callback as any);
    };

    if (this.supplyChainSocket.connected) {
      registerListener();
    } else {
      this.supplyChainSocket.once("connect", registerListener);
    }
  }

  removePendingOrderCreatedListener() {
    if (!this.supplyChainSocket) return;
    this.supplyChainSocket.off("pending-order.created");
  }

  /* ---------------------- Disconnect --------------------- */

  disconnectSupplyChain() {
    if (this.supplyChainSocket) {
      this.supplyChainSocket.disconnect();
      this.supplyChainSocket = null;
    }
  }

  disconnectMain() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  disconnect() {
    this.disconnectMain();
    this.disconnectSupplyChain();
  }
}

export default new SocketService();

