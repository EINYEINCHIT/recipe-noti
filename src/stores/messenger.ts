import { create } from "zustand";
import {
  Room,
  Message,
  Membership,
  RoomListPayload,
  RoomListResponse,
  MessageListPayload,
  MessageListResponse,
  Customer,
  Service,
  ServiceListPayload,
  ShopOrderPayload,
  ShopOrder,
  UpdateRoomPayload,
} from "@/types";
import {
  findAllRoom,
  findAllMessage,
  findOneRoom,
  findAllCustomer,
  findAllService,
  getShopOrder,
  updateRoom,
} from "@/services";

interface PaginatedState<T> {
  page: number;
  total: number;
  data: T[];
  loading: boolean;
}

type MessengerState = {
  rooms: PaginatedState<Room>;
  messages: PaginatedState<Message>;
  activeRoom: Room | null;
  participants: Customer[];
  services: Service[];
  orderDetails: ShopOrder | null;

  getRooms: (payload: RoomListPayload) => Promise<void>;
  getMessages: (payload: MessageListPayload) => Promise<void>;
  getRoomById: (roomId: number) => Promise<void>;
  getParticipants: (memberships: Membership[]) => Promise<void>;
  getServices: (payLoad: ServiceListPayload) => Promise<void>;
  getOrderDetails: (payLoad: ShopOrderPayload) => Promise<void>;
  readMessage: (payload: UpdateRoomPayload) => Promise<void>;

  setRooms: (content: RoomListResponse) => void;
  setRoomPage: (page: number) => void;
  setRoomTotal: (total: number) => void;
  setRoomLoading: (loading: boolean) => void;
  incrementRoomPage: () => void;

  addMessage: (message: Message) => void;
  setMessages: (content: MessageListResponse) => void;
  setMessagePage: (page: number) => void;
  setMessageTotal: (total: number) => void;
  setMessageLoading: (loading: boolean) => void;
  incrementMessagePage: () => void;

  setActiveRoom: (room: Room) => void;
  setParticipants: (customers: Customer[]) => void;
  setServices: (services: Service[]) => void;
  setOrderDetails: (order: ShopOrder) => void;

  resetMessenger: () => void;
};

const getInitialState = () => ({
  rooms: {
    page: 1,
    total: 0,
    data: [],
    loading: false,
  },
  messages: {
    page: 1,
    total: 0,
    data: [],
    loading: false,
  },
  activeRoom: null,
  participants: [],
  services: [],
  orderDetails: null,
});

export const useMessengerStore = create<MessengerState>((set) => ({
  ...getInitialState(),

  getRooms: async (payload) => {
    const { setRooms, setRoomPage, setRoomTotal } = useMessengerStore.getState();
    try {
      const content = await findAllRoom(payload);
      setRooms(content);
      setRoomPage(content.currentPage);
      setRoomTotal(content.totalPage);
    } catch (err: any) {
      console.warn("Error fetching rooms:", err);
      throw err;
    }
  },
  getMessages: async (payload) => {
    const { setMessages, setMessagePage, setMessageTotal, setMessageLoading } = useMessengerStore.getState();
    try {
      setMessageLoading(true);
      const content = await findAllMessage(payload);
      setMessages(content);
      setMessagePage(content.currentPage);
      setMessageTotal(content.totalPage);
    } catch (err: any) {
      console.warn("Error fetching messages:", err);
      throw err;
    } finally {
      setMessageLoading(false);
    }
  },
  getRoomById: async (roomId) => {
    const { setActiveRoom } = useMessengerStore.getState();
    try {
      const content = await findOneRoom(roomId);
      setActiveRoom(content);
    } catch (err: any) {
      console.warn("Error fetching room by id:", err);
      throw err;
    }
  },
  getParticipants: async (memberships) => {
    const { setParticipants } = useMessengerStore.getState();
    const userIds: number[] = memberships
      ?.filter((elem) => elem.type === "CUSTOMER")
      .map((elem) => elem.user_id);
    if (userIds.length) {
      try {
        const customers = await findAllCustomer({ user_id: userIds });
        setParticipants(customers);
      } catch (err: any) {
        console.warn("Error fetching room by id:", err);
        throw err;
      }
    }
  },
  getServices: async (payload) => {
    const { setServices } = useMessengerStore.getState();
    try {
      const content = await findAllService(payload);
      setServices(content.data);
    } catch (err: any) {
      console.warn("Error fetching services:", err);
      throw err;
    }
  },
  getOrderDetails: async (payload) => {
    const { setOrderDetails } = useMessengerStore.getState();
    try {
      const orderDetails = await getShopOrder(payload);
      setOrderDetails(orderDetails);
    } catch (err: any) {
      console.warn("Error fetching services:", err);
      throw err;
    }
  },
  readMessage: async (payload) => {
    await updateRoom(payload);
  },

  setRooms: (content) => {
    set((state) => {
      let newData = [...state.rooms.data];
      if (content.currentPage === 1) newData = [...content.data];
      else if (state.rooms.data.length !== content.currentPage * 15)
        newData.push(...content.data);

      return {
        rooms: {
          ...state.rooms,
          data: newData,
        },
      };
    });
  },
  setRoomPage: (page) => set((state) => ({ rooms: { ...state.rooms, page } })),
  setRoomTotal: (total) => set((state) => ({ rooms: { ...state.rooms, total } })),
  setRoomLoading: (loading) => set((state) => ({ rooms: { ...state.rooms, loading } })),
  incrementRoomPage: () => set((state) => ({ rooms: { ...state.rooms, page: state.rooms.page + 1 } })),

  addMessage: (message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        data: [message, ...state.messages.data],
      },
    }));
  },
  setMessages: (content) => {
    set((state) => {
      const existing = state.messages.data;
      let newData: Message[];

      if (content.currentPage === 1) {
        // First page: replace with fresh data
        newData = [...content.data];
      } else {
        // Next pages: append only messages that don't already exist (by id)
        const existingIds = new Set(existing.map((m) => m.id));
        const toAppend = content.data.filter((m) => !existingIds.has(m.id));
        newData = [...existing, ...toAppend];
      }

      return {
        messages: {
          ...state.messages,
          data: newData,
        },
      };
    });
  },
  setMessagePage: (page) => set((state) => ({ messages: { ...state.messages, page } })),
  setMessageTotal: (total) => set((state) => ({ messages: { ...state.messages, total } })),
  setMessageLoading: (loading) => set((state) => ({ messages: { ...state.messages, loading } })),
  incrementMessagePage: () => set((state) => ({ messages: { ...state.messages, page: state.messages.page + 1 } })),

  setActiveRoom: (room) => set((state) => ({ activeRoom: room })),
  setParticipants: (customers) => set((state) => ({ participants: customers })),
  setServices: (services) => set((state) => ({ services })),
  setOrderDetails: (orderDetails) => set((state) => ({ orderDetails })),

  resetMessenger: () => set(getInitialState()),
}));
