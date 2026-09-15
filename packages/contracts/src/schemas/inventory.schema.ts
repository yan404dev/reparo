import { z } from "zod";

export const CreatePartSchema = z.object({
  sku: z.string().min(3).toUpperCase(),
  barcode: z.string().optional().nullable(),
  name: z.string().min(3),
  brand: z.string().min(2),
  categoryId: z.string().uuid().optional().nullable(),
  category: z.string().optional().nullable(),
  supplier: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  costPrice: z.number().positive(),
  suggestedMarkupPercent: z.number().min(0).default(50),
  sellingPrice: z.number().positive(),
  initialStock: z.number().int().min(0).default(0),
  minStockThreshold: z.number().int().min(0).default(3)
});

export const UpdatePartSchema = CreatePartSchema.partial();

export const CreateCompatibilitySchema = z.object({
  partId: z.string().uuid(),
  deviceBrand: z.string().min(2),
  deviceModel: z.string().min(2),
  notes: z.string().optional().nullable()
});

export const StockEntrySchema = z.object({
  partId: z.string().uuid(),
  quantity: z.number().int().positive(),
  costPrice: z.number().positive().optional(),
  reason: z.string().min(3)
});

export const StockScrapSchema = z.object({
  partId: z.string().uuid(),
  quantity: z.number().int().positive(),
  serviceOrderId: z.string().uuid().optional().nullable(),
  reason: z.string().min(5)
});

export type CreatePartInput = z.infer<typeof CreatePartSchema>;
export type UpdatePartInput = z.infer<typeof UpdatePartSchema>;
export type CreateCompatibilityInput = z.infer<typeof CreateCompatibilitySchema>;
export type StockEntryInput = z.infer<typeof StockEntrySchema>;
export type StockScrapInput = z.infer<typeof StockScrapSchema>;
