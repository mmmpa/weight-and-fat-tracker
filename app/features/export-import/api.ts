import { getTursoClient } from "../../utils/turso";
import { getWeightRecords, saveWeightRecord } from "../weights/api";
import {
  type CreateWeightRecordInput,
  CreateWeightRecordInputSchema,
  type WeightRecord,
} from "../weights/types";
import { type ExportData, ExportDataSchema, ImportDataSchema, type ImportResult } from "./types";

async function bulkSaveWeightRecordsForImport(
  inputs: CreateWeightRecordInput[]
): Promise<{ successful: number; failed: number }> {
  if (inputs.length === 0) {
    return { successful: 0, failed: 0 };
  }

  // Validate all inputs first
  const validatedInputs = inputs.map((input) => CreateWeightRecordInputSchema.parse(input));

  const turso = await getTursoClient();

  // Build the bulk INSERT statement with ON CONFLICT
  const placeholders = validatedInputs.map(() => "(?, ?, ?)").join(", ");
  const sql = `INSERT INTO weight_records (date, weight, fat_rate) 
               VALUES ${placeholders}
               ON CONFLICT(date) DO UPDATE SET 
                 weight = excluded.weight,
                 fat_rate = excluded.fat_rate`;

  // Flatten the arguments array
  const args = validatedInputs.flatMap((input) => [input.date, input.weight, input.fat_rate]);

  try {
    await turso.execute({ sql, args });
    return { successful: validatedInputs.length, failed: 0 };
  } catch (error) {
    console.error("Bulk insert failed:", error);
    // Fallback to individual inserts if bulk fails
    let successful = 0;
    let failed = 0;

    for (const input of validatedInputs) {
      try {
        await saveWeightRecord(input);
        successful++;
      } catch (error) {
        failed++;
        console.error(`Failed to save record for date ${input.date}:`, error);
      }
    }

    return { successful, failed };
  }
}

export async function exportWeightRecords(): Promise<ExportData> {
  const records = await getWeightRecords();

  const exportData = {
    version: 1,
    records: records,
  };

  return ExportDataSchema.parse(exportData);
}

export function downloadExportFile(exportData: ExportData): void {
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `weight-records-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importWeightRecords(fileContent: string): Promise<ImportResult> {
  const data = JSON.parse(fileContent);
  const validatedData = ImportDataSchema.parse(data);

  let records: WeightRecord[];

  // Handle both old format (array) and new format (object with version and records)
  if (Array.isArray(validatedData)) {
    records = validatedData;
  } else {
    records = validatedData.records;
  }

  // Convert records to CreateWeightRecordInput format and validate
  const validatedInputs = records.map((record) =>
    CreateWeightRecordInputSchema.parse({
      date: record.date,
      weight: record.weight,
      fat_rate: record.fat_rate,
    })
  );

  // Use bulk upsert for much better performance
  const result = await bulkSaveWeightRecordsForImport(validatedInputs);

  return {
    successful: result.successful,
    failed: result.failed,
    message: `Import complete: ${result.successful} records processed, ${result.failed} failed`,
  };
}
