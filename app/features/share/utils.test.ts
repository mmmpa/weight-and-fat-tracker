import { describe, expect, it } from "vitest";
import type { WeightRecord } from "../weights/types";
import { generateShareUrl, parseShareData } from "./utils";

describe("generateShareUrl", () => {
  const origin = "http://localhost:5173";

  it("should return null for empty records", () => {
    const result = generateShareUrl([], origin);
    expect(result).toBeNull();
  });

  it("should return null for records with invalid data", () => {
    const records: WeightRecord[] = [
      { id: "1", date: "2024-01-01", weight: 0, fat_rate: 15 },
      { id: "2", date: "2024-01-02", weight: 70, fat_rate: 0 },
    ];
    const result = generateShareUrl(records, origin);
    expect(result).toBeNull();
  });

  it("should generate URL for single record", () => {
    const records: WeightRecord[] = [{ id: "1", date: "2024-01-15", weight: 70.5, fat_rate: 18.5 }];
    const result = generateShareUrl(records, origin);
    expect(result).toBe("http://localhost:5173/share?20240115-3-071-185");
  });

  it("should use 4 digits for weights >= 100kg", () => {
    const records: WeightRecord[] = [
      { id: "1", date: "2024-01-15", weight: 105.3, fat_rate: 25.5 },
    ];
    const result = generateShareUrl(records, origin);
    expect(result).toBe("http://localhost:5173/share?20240115-4-1053-255");
  });

  it("should fill gaps between dates", () => {
    const records: WeightRecord[] = [
      { id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 },
      { id: "2", date: "2024-01-03", weight: 70.5, fat_rate: 18.5 },
      { id: "3", date: "2024-01-05", weight: 71.0, fat_rate: 19.0 },
    ];
    const result = generateShareUrl(records, origin);
    // Should include 5 days: Jan 1, 2 (filled), 3, 4 (filled), 5
    expect(result).toBe("http://localhost:5173/share?20240101-3-070070071071071-180180185185190");
  });

  it("should sort records by date before processing", () => {
    const records: WeightRecord[] = [
      { id: "3", date: "2024-01-03", weight: 71.0, fat_rate: 19.0 },
      { id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 },
      { id: "2", date: "2024-01-02", weight: 70.5, fat_rate: 18.5 },
    ];
    const result = generateShareUrl(records, origin);
    expect(result).toBe("http://localhost:5173/share?20240101-3-070071071-180185190");
  });

  it("should round weight and fat values correctly", () => {
    const records: WeightRecord[] = [
      { id: "1", date: "2024-01-01", weight: 70.44, fat_rate: 18.44 },
      { id: "2", date: "2024-01-02", weight: 70.56, fat_rate: 18.56 },
    ];
    const result = generateShareUrl(records, origin);
    // 70.44 rounds to 70, 70.56 rounds to 71
    // 18.44 * 10 = 184.4 rounds to 184, 18.56 * 10 = 185.6 rounds to 186
    expect(result).toBe("http://localhost:5173/share?20240101-3-070071-184186");
  });
});

describe("parseShareData", () => {
  it("should return null for invalid format", () => {
    expect(parseShareData("invalid")).toBeNull();
    expect(parseShareData("20240101")).toBeNull();
    expect(parseShareData("20240101-")).toBeNull();
    expect(parseShareData("20240101-3")).toBeNull();
    expect(parseShareData("20240101-3-")).toBeNull();
  });

  it("should return null for invalid digit count", () => {
    expect(parseShareData("20240101-2-070-180")).toBeNull();
    expect(parseShareData("20240101-5-07000-180")).toBeNull();
  });

  it("should return null for invalid date", () => {
    expect(parseShareData("20240001-3-070-180")).toBeNull(); // Invalid month
    expect(parseShareData("20241301-3-070-180")).toBeNull(); // Month > 12
    expect(parseShareData("20240132-3-070-180")).toBeNull(); // Day > 31
  });

  it("should parse single record with 3-digit weight", () => {
    const result = parseShareData("20240115-3-071-185");
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      id: "shared-0",
      date: "2024-01-15",
      weight: 71,
      fat_rate: 18.5,
    });
  });

  it("should parse single record with 4-digit weight", () => {
    const result = parseShareData("20240115-4-1053-255");
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      id: "shared-0",
      date: "2024-01-15",
      weight: 105.3,
      fat_rate: 25.5,
    });
  });

  it("should parse multiple records", () => {
    const result = parseShareData("20240101-3-070071072-180185190");
    expect(result).toHaveLength(3);
    expect(result![0]).toEqual({
      id: "shared-0",
      date: "2024-01-01",
      weight: 70,
      fat_rate: 18.0,
    });
    expect(result![1]).toEqual({
      id: "shared-1",
      date: "2024-01-02",
      weight: 71,
      fat_rate: 18.5,
    });
    expect(result![2]).toEqual({
      id: "shared-2",
      date: "2024-01-03",
      weight: 72,
      fat_rate: 19.0,
    });
  });

  it("should match shorter array length", () => {
    // 3 weights but only 2 fat rates
    const result = parseShareData("20240101-3-070071072-180185");
    expect(result).toHaveLength(2);

    // 2 weights but 3 fat rates
    const result2 = parseShareData("20240101-3-070071-180185190");
    expect(result2).toHaveLength(2);
  });

  it("should handle dates across months", () => {
    const result = parseShareData("20240131-3-070071-180185");
    expect(result).toHaveLength(2);
    expect(result![0].date).toBe("2024-01-31");
    expect(result![1].date).toBe("2024-02-01");
  });

  it("should handle leap year dates", () => {
    const result = parseShareData("20240228-3-070071072-180185190");
    expect(result).toHaveLength(3);
    expect(result![0].date).toBe("2024-02-28");
    expect(result![1].date).toBe("2024-02-29"); // 2024 is a leap year
    expect(result![2].date).toBe("2024-03-01");
  });
});

describe("generateShareUrl and parseShareData integration", () => {
  const origin = "http://localhost:5173";

  it("should round-trip data correctly", () => {
    const originalRecords: WeightRecord[] = [
      { id: "1", date: "2024-01-15", weight: 70.5, fat_rate: 18.5 },
      { id: "2", date: "2024-01-16", weight: 71.0, fat_rate: 19.0 },
      { id: "3", date: "2024-01-17", weight: 71.5, fat_rate: 19.5 },
    ];

    const url = generateShareUrl(originalRecords, origin);
    expect(url).not.toBeNull();

    // Extract query string from URL
    const queryString = url!.split("?")[1];
    const parsedRecords = parseShareData(queryString);

    expect(parsedRecords).toHaveLength(3);
    expect(parsedRecords![0].weight).toBe(71); // 70.5 rounds to 71
    expect(parsedRecords![0].fat_rate).toBe(18.5);
    expect(parsedRecords![1].weight).toBe(71);
    expect(parsedRecords![1].fat_rate).toBe(19.0);
    expect(parsedRecords![2].weight).toBe(72); // 71.5 rounds to 72
    expect(parsedRecords![2].fat_rate).toBe(19.5);
  });

  it("should handle gaps correctly in round-trip", () => {
    const originalRecords: WeightRecord[] = [
      { id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 },
      { id: "3", date: "2024-01-05", weight: 71.0, fat_rate: 19.0 },
    ];

    const url = generateShareUrl(originalRecords, origin);
    const queryString = url!.split("?")[1];
    const parsedRecords = parseShareData(queryString);

    // Should have 5 records (Jan 1-5) with gaps filled
    expect(parsedRecords).toHaveLength(5);
    expect(parsedRecords![0].date).toBe("2024-01-01");
    expect(parsedRecords![1].date).toBe("2024-01-02");
    expect(parsedRecords![2].date).toBe("2024-01-03");
    expect(parsedRecords![3].date).toBe("2024-01-04");
    expect(parsedRecords![4].date).toBe("2024-01-05");

    // Filled records should have same data as previous
    expect(parsedRecords![1].weight).toBe(70.0);
    expect(parsedRecords![1].fat_rate).toBe(18.0);
    expect(parsedRecords![2].weight).toBe(70.0);
    expect(parsedRecords![2].fat_rate).toBe(18.0);
    expect(parsedRecords![3].weight).toBe(70.0);
    expect(parsedRecords![3].fat_rate).toBe(18.0);
  });
});
