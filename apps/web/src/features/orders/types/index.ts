import { OrderStatus, ServiceOrderDTO, ServiceOrderItemDTO, DeviceChecklist } from "@fluxos/contracts";

export interface OrdersListFilter {
  status: string;
  search: string;
}

export type OrderStatusType = OrderStatus;

export interface OrderItemFormData {
  type: "PECA" | "SERVICO_MAO_DE_OBRA";
  partId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  warrantyDays: number;
}
