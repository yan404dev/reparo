import { z } from "zod";

export const ApprovePublicOrderSchema = z.object({
  customerSignature: z.string().optional()
});

export const RejectPublicOrderSchema = z.object({
  rejectionReason: z.string().optional()
});

export type ApprovePublicOrderInput = z.infer<typeof ApprovePublicOrderSchema>;
export type RejectPublicOrderInput = z.infer<typeof RejectPublicOrderSchema>;
