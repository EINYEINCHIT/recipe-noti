import { appApi } from "./axios.service";
import { API_ENDPOINTS } from "@/constants";
import { CustomerListPayload, Customer } from "@/types";

export const findAllCustomer = async (params: CustomerListPayload) => {
  const response = await appApi.get<{ content: Customer[] }>(
    `${API_ENDPOINTS.customer.findAll}`,
    { params }
  );
  return response.data.content;
};