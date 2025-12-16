import { shopApi } from "./axios.service";
import { API_ENDPOINTS } from "@/constants";
import { ShopOrderPayload, ShopOrder } from "@/types";

export const getShopOrder = async (params: ShopOrderPayload) => {
  const response = await shopApi.get<{data: ShopOrder}>(
    `${API_ENDPOINTS.shop.getOrder}`,
    { params }
  );
  return response.data.data;
};
