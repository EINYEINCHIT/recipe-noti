import { axiosInstance } from "./axios.service";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import { CustomerListPayload, CustomerListResponse } from "@/types";

export const findAllCustomer = async (params: CustomerListPayload) => {
  const response = await axiosInstance.get<{ content: CustomerListResponse }>(
    `${API_BASE_URL}${API_ENDPOINTS.customer.findAll}`,
    { params }
  );
  return response.data.content;
};