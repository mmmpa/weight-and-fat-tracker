import { getTursoClient, resetDatabase } from "../../utils/turso";
import {
  type CreateWeightRecordInput,
  CreateWeightRecordInputSchema,
  type UpdateWeightRecordInput,
  UpdateWeightRecordInputSchema,
  type WeightRecord,
  WeightRecordSchema,
} from "./types";

export async function getWeightRecords(): Promise<WeightRecord[]> {
  const turso = await getTursoClient();
  const result = await turso.execute("SELECT * FROM weight_records ORDER BY date DESC");

  return result.rows.map((row) => WeightRecordSchema.parse(row));
}

export async function getWeightRecordByDate(date: string): Promise<WeightRecord | null> {
  const turso = await getTursoClient();
  const result = await turso.execute({
    sql: "SELECT * FROM weight_records WHERE date = ?",
    args: [date],
  });

  if (!result.rows[0]) return null;
  return WeightRecordSchema.parse(result.rows[0]);
}

/**
 * @deprecated Use saveWeightRecord instead
 */
export async function createWeightRecord(input: CreateWeightRecordInput): Promise<WeightRecord> {
  // Validate input with Zod
  const validatedInput = CreateWeightRecordInputSchema.parse(input);

  const turso = await getTursoClient();
  const result = await turso.execute({
    sql: "INSERT INTO weight_records (date, weight, fat_rate) VALUES (?, ?, ?) RETURNING *",
    args: [validatedInput.date, validatedInput.weight, validatedInput.fat_rate],
  });

  return WeightRecordSchema.parse(result.rows[0]);
}

/**
 * @deprecated Use saveWeightRecord instead
 */
export async function updateWeightRecord(
  date: string,
  input: UpdateWeightRecordInput
): Promise<WeightRecord | null> {
  // Validate input with Zod
  const validatedInput = UpdateWeightRecordInputSchema.parse(input);

  const setClauses = [];
  const args = [];

  if (validatedInput.weight !== undefined) {
    setClauses.push("weight = ?");
    args.push(validatedInput.weight);
  }
  if (validatedInput.fat_rate !== undefined) {
    setClauses.push("fat_rate = ?");
    args.push(validatedInput.fat_rate);
  }

  if (setClauses.length === 0) {
    return getWeightRecordByDate(date);
  }

  args.push(date);

  const turso = await getTursoClient();
  const result = await turso.execute({
    sql: `UPDATE weight_records SET ${setClauses.join(", ")} WHERE date = ? RETURNING *`,
    args,
  });

  if (!result.rows[0]) return null;
  return WeightRecordSchema.parse(result.rows[0]);
}

export async function deleteWeightRecord(date: string): Promise<boolean> {
  const turso = await getTursoClient();
  const result = await turso.execute({
    sql: "DELETE FROM weight_records WHERE date = ?",
    args: [date],
  });

  return result.rowsAffected > 0;
}

export async function getWeightRecordsByDateRange(
  startDate: string,
  endDate: string
): Promise<WeightRecord[]> {
  const turso = await getTursoClient();
  const result = await turso.execute({
    sql: "SELECT * FROM weight_records WHERE date >= ? AND date <= ? ORDER BY date ASC",
    args: [startDate, endDate],
  });

  return result.rows.map((row) => WeightRecordSchema.parse(row));
}

export async function getLatestWeightRecord(): Promise<WeightRecord | null> {
  const turso = await getTursoClient();
  const result = await turso.execute("SELECT * FROM weight_records ORDER BY date DESC LIMIT 1");

  if (!result.rows[0]) return null;
  return WeightRecordSchema.parse(result.rows[0]);
}

export async function getWeightRecordsStats() {
  const records = await getWeightRecords();

  if (records.length === 0) {
    return {
      totalRecords: 0,
      latestWeight: 0,
      latestFat: 0,
      averageWeight: 0,
      averageFat: 0,
      minWeight: 0,
      maxWeight: 0,
      weightChange: 0,
      fatChange: 0,
    };
  }

  const weights = records.map((r) => r.weight);
  const fats = records.map((r) => r.fat_rate);

  const latest = records[0];
  const previous = records[1];

  return {
    totalRecords: records.length,
    latestWeight: latest.weight,
    latestFat: latest.fat_rate,
    averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
    averageFat: fats.reduce((a, b) => a + b, 0) / fats.length,
    minWeight: Math.min(...weights),
    maxWeight: Math.max(...weights),
    weightChange: previous ? latest.weight - previous.weight : 0,
    fatChange: previous ? latest.fat_rate - previous.fat_rate : 0,
  };
}

export async function getWeightRecordsByMonth(
  year: number,
  month: number
): Promise<WeightRecord[]> {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;

  return getWeightRecordsByDateRange(startDate, endDate);
}

export async function getMonthlyStats(year: number, month: number) {
  const records = await getWeightRecordsByMonth(year, month);

  if (records.length === 0) {
    return {
      totalRecords: 0,
      averageWeight: 0,
      averageFat: 0,
      minWeight: 0,
      maxWeight: 0,
      minFat: 0,
      maxFat: 0,
      weightChange: 0,
      fatChange: 0,
      firstRecord: null,
      lastRecord: null,
    };
  }

  const weights = records.map((r) => r.weight);
  const fats = records.map((r) => r.fat_rate);

  const sortedByDate = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const firstRecord = sortedByDate[0];
  const lastRecord = sortedByDate[sortedByDate.length - 1];

  return {
    totalRecords: records.length,
    averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
    averageFat: fats.reduce((a, b) => a + b, 0) / fats.length,
    minWeight: Math.min(...weights),
    maxWeight: Math.max(...weights),
    minFat: Math.min(...fats),
    maxFat: Math.max(...fats),
    weightChange: lastRecord && firstRecord ? lastRecord.weight - firstRecord.weight : 0,
    fatChange: lastRecord && firstRecord ? lastRecord.fat_rate - firstRecord.fat_rate : 0,
    firstRecord,
    lastRecord,
  };
}

export async function getAvailableMonths(): Promise<
  { year: number; month: number; count: number }[]
> {
  const records = await getWeightRecords();
  const monthMap = new Map<string, number>();

  records.forEach((record) => {
    const date = new Date(record.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  });

  const result = Array.from(monthMap.entries()).map(([key, count]) => {
    const [year, month] = key.split("-").map(Number);
    return { year, month, count };
  });

  return result.sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function resetWeightDatabase(): Promise<void> {
  await resetDatabase();
}

export async function saveWeightRecord(input: CreateWeightRecordInput): Promise<WeightRecord> {
  // Validate input with Zod
  const validatedInput = CreateWeightRecordInputSchema.parse(input);

  const turso = await getTursoClient();
  const result = await turso.execute({
    sql: `INSERT INTO weight_records (date, weight, fat_rate) 
          VALUES (?, ?, ?) 
          ON CONFLICT(date) DO UPDATE SET 
            weight = excluded.weight,
            fat_rate = excluded.fat_rate
          RETURNING *`,
    args: [validatedInput.date, validatedInput.weight, validatedInput.fat_rate],
  });

  return WeightRecordSchema.parse(result.rows[0]);
}
