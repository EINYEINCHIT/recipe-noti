export interface ShopOrderPayload {
  ajax: number;
  order_id: number;
  action: string;
  key: string;
}

export interface ShopOrder {
  submitted_at: string;
  amount: string;
  status: string;
  currency_symbol: string;
  carrier_name: string | null;
  id_customer: number;
  payment_method_name: string;
  delivery_address: string;
  invoice_address: string;
  product_list: ProductItem[];
  order_status_history: OrderStatusHistory[];
  order_detail_link: string;
  invoice_pdf_download_link: string;
  coa_template: string;
  id_order: number;
}

export interface ProductItem {
  product_id: number;
  product_name: string;
  gram: string;
  product_quantity: number;
  unit_price: string;
  total_price: string;
}

export interface OrderStatusHistory {
  delivery: number;
  shipped: number;
  paid: number;
  order_status_name: string;
  date: string;
}
