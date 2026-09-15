import { ServiceOrderDTO, PartDTO } from "@fluxos/contracts";

export interface DashboardMetrics {
  activeOrders: ServiceOrderDTO[];
  lowStockParts: PartDTO[];
  readyOrders: ServiceOrderDTO[];
  totalRevenue: number;
  orders: ServiceOrderDTO[];
  parts: PartDTO[];
  isLoading: boolean;
}
