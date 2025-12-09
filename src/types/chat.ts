export enum RoomStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  REPLIED = "REPLIED",
}

export enum MessageTypeEnum {
  TEXT = "TEXT",
  FILE = "FILE",
  TRANSFER = "TRANSFER",
  ORDER = "ORDER",
}

export enum MessageSourceEnum {
  WS = "WS",
  API = "API",
  INSTANT_MESSAGE = "INSTANT_MESSAGE",
}

export enum ChatApiEnum {
  CHAT = "CHAT",
  TAG = "TAG"
}

export enum InstantMessageEnum {
  LINE = "LINE",
  WHATSAPP = "WHATSAPP",
  EMAIL = "EMAIL",
}

export interface Service {
  id: number;
  name: string;
  description: string;
  email: string;
  staffs: ServiceStaff[];
  instantMessaging: any[];
}

export interface ServiceStaff {
  id: number;
  staff_id: number;
  service_id: number;
  default_sender: boolean;
}

export interface MessageSource {
  id: number;
  instant_messaging_type: InstantMessageEnum;
  message_id: number;
  sent_from_api: ChatApiEnum;
  sent_from_url: string;
  type: MessageSourceEnum;
}

export interface Message {
  id: number;
  room_id: number;
  user_id: number;
  type: MessageTypeEnum;
  source: MessageSourceEnum;
  seen_by_staff: boolean;
  seen_by_customer: boolean;
  parent_message_id: number;
  textMessage: TextMessage;
  fileMessage: FileMessage;
  transferMessage: TransferMessage;
  orderMessage: OrderMessage;
}

export interface TextMessage {
  id: number;
  message_id: number;
  content: string;
}

export interface FileMessage {
  id: number;
  message_id: number;
  url: string;
  is_available: boolean;
  expired_at: string;
  display_name: string;
  description: string;
}

export interface TransferMessage {
  id: number;
  message_id: number;
  service_id: number;
  room_id: number;
}

export interface OrderMessage {
  id: number;
  message_id: number;
  content: string;
}

export interface Tag {
  id: number;
  service_id: number;
  description: string;
  type: string;
}

export interface RoomTag {
  id: number;
  room_id: number;
  tag: Tag;
  tag_id: number;
  tag_value: string;
}

export interface Room {
  id: number;
  name: string;
  display_name: string;
  owner_id: number;
  service_id: number;
  is_tag_room: boolean;
  last_chat_at: string;
  status: RoomStatusEnum;
  roomTags: RoomTag[];
  service: Service;
  messages: Message[];
}

export interface UpdateRoomPayload {
  room_id: number;
  seen_by_staff?: boolean;
  seen_by_customer?: boolean;
}

export interface RoomListPayload {
  user_id: number;
  page?: number;
  limit?: number;
  order?: string;
  sortBy?: string;
  status: RoomStatusEnum;
}

export interface RoomListResponse {
  data: Room[];
  currentPage: number;
  totalPage: number;
}

export interface ServiceListPayload {
  page?: number;
  limit?: number;
  order?: string;
}

export interface ServiceListResponse {
  data: Service[];
  currentPage: number;
  totalPage: number;
}

export interface MessageListPayload {
  room_id: number;
  page?: number;
  limit?: number;
  order?: string;
}

export interface MessageListResponse {
  data: Message[];
  currentPage: number;
  totalPage: number;
}

