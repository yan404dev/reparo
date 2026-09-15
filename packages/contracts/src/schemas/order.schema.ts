import { z } from "zod";
import { OrderItemType, OrderStatus } from "../enums";
import { DeviceChecklistSchema } from "./checklist.schema";

export const CreateCustomerSchema = z.object({
  name: z.string().min(2),
  document: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(8),
  notes: z.string().optional().nullable()
});

export const CreateDeviceSchema = z.object({
  customerId: z.string().uuid(),
  brand: z.string().min(2),
  model: z.string().min(2),
  imei: z.string().min(8),
  serialNumber: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  passcode: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const CreateServiceOrderSchema = z.object({
  customerId: z.string().uuid().optional().nullable(),
  deviceId: z.string().uuid().optional().nullable(),
  technicianId: z.string().uuid().optional().nullable(),
  reportedDefect: z.string().min(2, "Informe o defeito relatado"),
  entryChecklist: DeviceChecklistSchema,
  customerName: z.string().optional().nullable(),
  customerDocument: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  customerEmail: z.string().optional().nullable(),
  deviceBrand: z.string().optional().nullable(),
  deviceModel: z.string().optional().nullable(),
  deviceImei: z.string().optional().nullable(),
  deviceColor: z.string().optional().nullable(),
  devicePasscode: z.string().optional().nullable(),
  initialQuote: z.object({
    partId: z.string().uuid().optional().nullable(),
    partDescription: z.string().optional().nullable(),
    partPrice: z.number().min(0).optional().nullable(),
    laborPrice: z.number().min(0).optional().nullable(),
    discount: z.number().min(0).default(0).optional().nullable(),
    warrantyDays: z.number().int().min(0).default(90).optional().nullable(),
  }).optional().nullable(),
});

export const AddOrderItemSchema = z.object({
  type: z.nativeEnum(OrderItemType),
  partId: z.string().uuid().optional().nullable(),
  description: z.string().min(2),
  quantity: z.number().int().positive().default(1),
  unitCost: z.number().min(0).default(0),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  warrantyDays: z.number().int().min(0).default(90)
});

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().optional().nullable(),
  technicalReport: z.string().optional().nullable()
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type CreateDeviceInput = z.infer<typeof CreateDeviceSchema>;
export type CreateServiceOrderInput = z.infer<typeof CreateServiceOrderSchema>;
export type AddOrderItemInput = z.infer<typeof AddOrderItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
