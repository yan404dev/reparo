import { OrderStatus, UserRole, OrderItemType, StockMovementType } from "../enums";
import { DeviceChecklist } from "../schemas/checklist.schema";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface CustomerTimelineEventDTO {
  id: string;
  type: "ORDER_CREATED" | "STATUS_CHANGE" | "ITEM_APPLIED";
  timestamp: number;
  date: string;
  orderId: string;
  orderNumber: number;
  title: string;
  subtitle: string;
  description?: string;
  status?: string;
  total?: number;
  author: string;
  iconType: "smartphone" | "wrench" | "clock" | "check" | "alert";
  badgeColor: string;
}

export interface CustomerDTO {
  id: string;
  name: string;
  document?: string | null;
  displayDocument?: string | null;
  email?: string | null;
  phone: string;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  devices?: DeviceDTO[];
  orders?: any[];
  totalSpent?: number;
  displayTotalSpent?: string;
  activeOrdersCount?: number;
  isRecurrent?: boolean;
  hasActiveOrders?: boolean;
  whatsappUrl?: string | null;
  timelineEvents?: CustomerTimelineEventDTO[];
  _count?: {
    orders: number;
  };
}

export interface DeviceDTO {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  imei: string;
  serialNumber?: string | null;
  color?: string | null;
  passcode?: string | null;
  notes?: string | null;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  _count?: { parts: number };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOrderItemDTO {
  id: string;
  serviceOrderId: string;
  type: OrderItemType;
  partId?: string | null;
  description: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  discount: number;
  total: number;
  warrantyDays: number;
  warrantyEndsAt?: string | null;
  part?: PartDTO | null;
}

export interface ChecklistDisplayItem {
  label: string;
  isOk: boolean;
  displayValue: string;
}

export interface ServiceOrderDTO {
  id: string;
  orderNumber: number;
  publicToken: string;
  customerId: string;
  customer?: CustomerDTO;
  deviceId: string;
  device?: DeviceDTO;
  technicianId?: string | null;
  technician?: UserDTO | null;
  attendantId: string;
  attendant?: UserDTO;
  status: OrderStatus;
  statusGroup: "pending" | "approved" | "cancelled";
  entryChecklist: DeviceChecklist;
  checklistDisplay: ChecklistDisplayItem[];
  reportedDefect: string;
  technicalReport?: string | null;
  finalObservations?: string | null;
  totalPartsPrice: number;
  totalLaborPrice: number;
  totalDiscount: number;
  grandTotal: number;
  displayTotalPrice: string;
  profitMarginPercentage?: number;
  isLateDelivery: boolean;
  daysLate: number;
  hoursLate: number;
  whatsappUrl?: string | null;
  readyAt?: string | null;
  approvedAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  items?: ServiceOrderItemDTO[];
}

export interface PartDTO {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  brand: string;
  categoryId: string;
  category?: CategoryDTO | any;
  supplier?: string | null;
  description?: string | null;
  costPrice: number;
  suggestedMarkupPercent: number;
  sellingPrice: number;
  displayCostPrice?: string;
  displaySellingPrice?: string;
  stockPhysical: number;
  stockReserved: number;
  stockAvailable: number;
  minStockThreshold: number;
  isLowStock?: boolean;
}

export interface StockMovementDTO {
  id: string;
  partId: string;
  serviceOrderId?: string | null;
  userId: string;
  type: StockMovementType;
  quantity: number;
  previousPhysical: number;
  newPhysical: number;
  previousReserved: number;
  newReserved: number;
  reason?: string | null;
  createdAt: string;
}

export interface DashboardMetricsDTO {
  activeOrdersCount: number;
  readyOrdersCount: number;
  lowStockPartsCount: number;
  totalRevenue: number;
  displayTotalRevenue: string;
  recentOrders: ServiceOrderDTO[];
  lowStockParts: PartDTO[];
}
