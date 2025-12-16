import { appApi } from "./axios.service";
import { API_ENDPOINTS } from "@/constants";
import {
  Room,
  RoomListPayload,
  RoomListResponse,
  ServiceListPayload,
  ServiceListResponse,
  MessageListPayload,
  MessageListResponse,
  UpdateRoomPayload,
  JoinRoomPayload,
} from "@/types";

export const findAllRoom = async (params: RoomListPayload) => {
  const response = await appApi.get<{ content: RoomListResponse }>(
    `${API_ENDPOINTS.room.findAll}`,
    { params }
  );
  return response.data.content;
};

export const findOneRoom = async (roomId: number) => {
  const response = await appApi.get<{ content: Room }>(
    `${API_ENDPOINTS.room.findOne(roomId)}`
  );
  return response.data.content;
};

export const findAllService = async (params: ServiceListPayload) => {
  const response = await appApi.get<{ content: ServiceListResponse }>(
    `${API_ENDPOINTS.service.findAll}`,
    { params }
  );
  return response.data.content;
};

export const findAllMessage = async (params: MessageListPayload) => {
  const response = await appApi.get<{ content: MessageListResponse }>(
    `${API_ENDPOINTS.message.findAll}`,
    { params }
  );
  return response.data.content;
};

export const updateRoom = async (data: UpdateRoomPayload) => {
  const response = await appApi.put<{content: any}>(
    `${API_ENDPOINTS.room.update}`,
    data
  );
  return response.data.content;
};

export const joinRoom = async (data: JoinRoomPayload) => {
  const response = await appApi.post<{ content: any }>(
    `${API_ENDPOINTS.room.join}`,
    data
  );
  return response.data.content;
};