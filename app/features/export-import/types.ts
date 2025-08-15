import { z } from "zod";
import { WeightRecordSchema } from "../weights/types";

export const ExportDataSchema = z.object({
  version: z.number(),
  records: z.array(WeightRecordSchema),
});

export const ImportDataSchema = z.union([
  z.array(WeightRecordSchema), // Old format: plain array
  ExportDataSchema, // New format: object with version and records
]);

export const ImportResultSchema = z.object({
  successful: z.number(),
  failed: z.number(),
  message: z.string(),
});

export type ExportData = z.infer<typeof ExportDataSchema>;
export type ImportData = z.infer<typeof ImportDataSchema>;
export type ImportResult = z.infer<typeof ImportResultSchema>;
