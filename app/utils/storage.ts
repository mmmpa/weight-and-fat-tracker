import type { WeightRecord } from "./types";

const STORAGE_KEY = "weight-tracker-records";

export function getWeightRecords(): WeightRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveWeightRecords(records: WeightRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createWeightRecord(
  data: Omit<WeightRecord, "id" | "createdAt" | "updatedAt">
): WeightRecord {
  const now = new Date().toISOString();
  const record: WeightRecord = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  const records = getWeightRecords();
  records.push(record);
  saveWeightRecords(records);

  return record;
}

export function updateWeightRecord(
  id: string,
  data: Partial<Omit<WeightRecord, "id" | "createdAt">>
): WeightRecord | null {
  const records = getWeightRecords();
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  saveWeightRecords(records);
  return records[index];
}

export function deleteWeightRecord(id: string): boolean {
  const records = getWeightRecords();
  const filtered = records.filter((r) => r.id !== id);

  if (filtered.length === records.length) return false;

  saveWeightRecords(filtered);
  return true;
}

export function getWeightRecordById(id: string): WeightRecord | null {
  const records = getWeightRecords();
  return records.find((r) => r.id === id) || null;
}

export function getWeightRecordByDate(date: string): WeightRecord | null {
  const records = getWeightRecords();
  return records.find((r) => r.date.startsWith(date.split("T")[0])) || null;
}
