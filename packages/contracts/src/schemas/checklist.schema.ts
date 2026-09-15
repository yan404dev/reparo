import { z } from "zod";

export const CasingConditionEnum = z.enum([
  "PERFEITO",
  "BOM",
  "MARCAS_DE_USO",
  "TRINCADO",
  "AMASSADO",
  "EXCELENTE",
  "DESGASTADO",
  "DANIFICADO"
]);

export type CasingCondition = z.infer<typeof CasingConditionEnum>;

export const DeviceChecklistSchema = z.object({
  screenBroken: z.boolean().default(false),
  touchWorks: z.boolean().default(true),
  batteryHealth: z.number().min(0).max(100).optional().nullable(),
  faceIdWorking: z.boolean().default(true),
  camerasOk: z.boolean().default(true),
  audioOk: z.boolean().default(true),
  chargePortWorking: z.boolean().default(true),
  casingCondition: CasingConditionEnum.default("BOM"),
  photoUrls: z.array(z.string()).default([]),
  cosmeticPhotos: z.array(z.string()).default([]),
  observation: z.string().optional().nullable()
});

export type DeviceChecklist = z.infer<typeof DeviceChecklistSchema>;
