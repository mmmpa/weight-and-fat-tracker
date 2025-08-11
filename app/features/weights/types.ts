import { z } from "zod";

export const WeightRecordSchema = z.object({
  id: z.string(),
  date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  weight: z.number().positive("Weight must be positive"),
  fat_rate: z
    .number()
    .min(0, "Fat rate cannot be negative")
    .max(100, "Fat rate cannot exceed 100%"),
});

export const CreateWeightRecordInputSchema = z.object({
  date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  weight: z.number().positive("Weight must be positive"),
  fat_rate: z
    .number()
    .min(0, "Fat rate cannot be negative")
    .max(100, "Fat rate cannot exceed 100%"),
});

export const UpdateWeightRecordInputSchema = z.object({
  date: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  fat_rate: z
    .number()
    .min(0, "Fat rate cannot be negative")
    .max(100, "Fat rate cannot exceed 100%")
    .optional(),
});

export type WeightRecord = z.infer<typeof WeightRecordSchema>;
export type CreateWeightRecordInput = z.infer<typeof CreateWeightRecordInputSchema>;
export type UpdateWeightRecordInput = z.infer<typeof UpdateWeightRecordInputSchema>;
