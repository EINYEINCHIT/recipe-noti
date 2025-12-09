import { axiosInstance } from "./axios.service";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import {
  Room,
  RoomListPayload,
  RoomListResponse,
  ServiceListPayload,
  ServiceListResponse,
  MessageListPayload,
  MessageListResponse,
  UpdateRoomPayload,
} from "@/types";

export const findAllRoom = async (params: RoomListPayload) => {
  const response = await axiosInstance.get<{ content: RoomListResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.room.findAll}`,
    { params }
  );
  return response.data.content;
};

export const findOneRoom = async (roomId: number) => {
  const response = await axiosInstance.get<{ content: Room }>(
    `${API_BASE_URL}${API_ENDPOINTS.room.findOne(roomId)}`
  );
  return response.data.content;
};

export const findAllService = async (params: ServiceListPayload) => {
  const response = await axiosInstance.get<{ content: ServiceListResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.service.findAll}`,
    { params }
  );
  return response.data.content;
};

export const findAllMessage = async (params: MessageListPayload) => {
  const response = await axiosInstance.get<{ content: MessageListResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.message.findAll}`,
    { params }
  );
  return response.data.content;
};

export const updateRoom = async (data: UpdateRoomPayload) => {
  const response = await axiosInstance.put<{content: any}>(
    `${API_BASE_URL}${API_ENDPOINTS.room.update}`,
    data
  );
  return response.data.content;
};