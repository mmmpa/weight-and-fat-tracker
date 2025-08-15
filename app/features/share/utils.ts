import type { WeightRecord } from "../weights/types";

/**
 * Generate a share URL from weight records
 * Format: ?yyyymmdd-n-aaabbbccc-xxxyyyzzz
 * - yyyymmdd: Start date
 * - n: Digit count (3 or 4) for weight
 * - aaabbbccc: Weight values
 * - xxxyyyzzz: Fat percentage values (always 3 digits)
 */
export function generateShareUrl(records: WeightRecord[], origin: string): string | null {
  // Filter records with valid data
  const validRecords = records
    .filter((r) => r.weight > 0 && r.fat_rate > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (validRecords.length === 0) return null;

  // Fill gaps between dates
  const filledRecords: WeightRecord[] = [];
  if (validRecords.length > 0) {
    const firstDate = new Date(`${validRecords[0].date}T00:00:00Z`);
    const lastDate = new Date(`${validRecords[validRecords.length - 1].date}T00:00:00Z`);

    let previousRecord = validRecords[0];

    for (let d = new Date(firstDate); d <= lastDate; d.setUTCDate(d.getUTCDate() + 1)) {
      const currentDateStr = d.toISOString().split("T")[0];

      // Check if we have a record for this date
      const currentRecord = validRecords.find((r) => r.date === currentDateStr);
      if (currentRecord) {
        filledRecords.push(currentRecord);
        previousRecord = currentRecord;
      } else {
        // Fill with previous date's data
        filledRecords.push({
          date: currentDateStr,
          weight: previousRecord.weight,
          fat_rate: previousRecord.fat_rate,
        });
      }
    }
  }

  // Get start date
  const firstRecord = filledRecords[0];
  const startDate = firstRecord.date.replace(/-/g, "");

  // Determine digit count based on max weight
  const maxWeight = Math.max(...filledRecords.map((r) => r.weight));
  const digitCount = maxWeight >= 100 ? 4 : 3;

  // Encode weights
  const weightStrings = filledRecords.map((r) => {
    const weightValue = digitCount === 4 ? Math.round(r.weight * 10) : Math.round(r.weight);
    return weightValue.toString().padStart(digitCount, "0");
  });

  // Encode fat rates (always 3 digits)
  const fatStrings = filledRecords.map((r) => {
    const fatValue = Math.round(r.fat_rate * 10);
    return fatValue.toString().padStart(3, "0");
  });

  // Build query string
  const queryString = `${startDate}-${digitCount}-${weightStrings.join("")}-${fatStrings.join("")}`;

  return `${origin}/share?${queryString}`;
}

/**
 * Parse share data from query string
 * Returns an array of weight records (gaps are already filled during generation)
 */
export function parseShareData(queryString: string): WeightRecord[] | null {
  // Format: yyyymmdd-n-aaabbbccc-xxxyyyzzz
  const match = queryString.match(/^(\d{8})-(\d)-(.+)-(.+)$/);
  if (!match) return null;

  const [, startDateStr, digitCountStr, weightStr, fatStr] = match;
  const digitCount = parseInt(digitCountStr);

  if (digitCount !== 3 && digitCount !== 4) return null;

  // Parse start date
  const year = parseInt(startDateStr.substring(0, 4));
  const month = parseInt(startDateStr.substring(4, 6));
  const day = parseInt(startDateStr.substring(6, 8));

  if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  // Extract individual values
  const weightValues: number[] = [];
  const fatValues: number[] = [];

  // Parse weight values
  for (let i = 0; i < weightStr.length; i += digitCount) {
    const chunk = weightStr.substring(i, i + digitCount);
    if (chunk.length === digitCount) {
      const value = parseInt(chunk);
      if (!Number.isNaN(value)) {
        // Convert based on digit count
        const weight = digitCount === 4 ? value / 10 : value;
        weightValues.push(weight);
      }
    }
  }

  // Parse fat values (always 3 digits)
  for (let i = 0; i < fatStr.length; i += 3) {
    const chunk = fatStr.substring(i, i + 3);
    if (chunk.length === 3) {
      const value = parseInt(chunk);
      if (!Number.isNaN(value)) {
        const fatRate = value / 10;
        fatValues.push(fatRate);
      }
    }
  }

  // Match the shorter array length
  const recordCount = Math.min(weightValues.length, fatValues.length);
  if (recordCount === 0) return null;

  // Generate records
  const records: WeightRecord[] = [];
  // Use UTC to avoid timezone issues
  const startDate = new Date(Date.UTC(year, month - 1, day));

  for (let i = 0; i < recordCount; i++) {
    const currentDate = new Date(startDate);
    currentDate.setUTCDate(startDate.getUTCDate() + i);

    const dateStr = currentDate.toISOString().split("T")[0];

    records.push({
      date: dateStr,
      weight: weightValues[i],
      fat_rate: fatValues[i],
    });
  }

  return records;
}
