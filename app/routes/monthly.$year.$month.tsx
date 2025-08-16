import { useState } from "react";
import { Link, redirect, useLoaderData } from "react-router";
import { WeightAbsoluteGraph } from "../components/WeightAbsoluteGraph";
import { WeightGraph } from "../components/WeightGraph";
import { generateShareUrl } from "../features/share/utils";
import {
  deleteWeightRecord,
  getMonthlyStats,
  getWeightRecordsByMonth,
  saveWeightRecord,
} from "../features/weights/api";
import type { WeightRecord } from "../features/weights/types";
import { DatabaseNotConfiguredError } from "../utils/errors";
import type { Route } from "./+types/monthly.$year.$month";

interface RecordState {
  date: string;
  weight: string;
  fat: string;
  hasChanges: boolean;
  isNew: boolean;
}

export function meta() {
  return [
    { title: "Monthly Records" },
    { name: "description", content: "View weight records for specific month" },
  ];
}

function generateAllDatesInMonth(year: number, month: number): string[] {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    dates.push(dateStr);
  }

  return dates;
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { year, month } = params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (!yearNum || !monthNum || monthNum < 1 || monthNum > 12) {
    throw new Error("Invalid year or month");
  }

  try {
    const [monthRecords, monthStats] = await Promise.all([
      getWeightRecordsByMonth(yearNum, monthNum),
      getMonthlyStats(yearNum, monthNum),
    ]);

    // Generate all dates in the month
    const allDates = generateAllDatesInMonth(yearNum, monthNum);

    // Create record states for all dates
    const initialStates: Record<string, RecordState> = {};

    allDates.forEach((date) => {
      const existingRecord = monthRecords.find((r) => r.date.startsWith(date));

      if (existingRecord) {
        // Existing record
        initialStates[date] = {
          date: date,
          weight: existingRecord.weight.toString(),
          fat: existingRecord.fat_rate.toString(),
          hasChanges: false,
          isNew: false,
        };
      } else {
        // New empty record
        initialStates[date] = {
          date: date,
          weight: "",
          fat: "",
          hasChanges: false,
          isNew: true,
        };
      }
    });

    return {
      records: monthRecords,
      stats: monthStats,
      initialRecordStates: initialStates,
      yearNum,
      monthNum,
    };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      throw redirect("/config");
    }
    throw error;
  }
}

export default function MonthlyDetails() {
  const {
    records: initialRecords,
    stats: initialStats,
    initialRecordStates,
    yearNum,
    monthNum,
  } = useLoaderData<typeof clientLoader>();
  const [records, setRecords] = useState<WeightRecord[]>(initialRecords);
  const [recordStates, setRecordStates] =
    useState<Record<string, RecordState>>(initialRecordStates);
  const [stats, setStats] = useState(initialStats);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<string | null>(null);

  async function handleDelete(dateKey: string) {
    const state = recordStates[dateKey];
    if (!state || state.isNew) return;

    if (!confirm("記録を削除？")) return;

    try {
      setDeleteLoading(dateKey);
      const success = await deleteWeightRecord(state.date);
      if (success) {
        setRecords(records.filter((r) => r.date !== state.date));

        // Reset to empty state
        setRecordStates({
          ...recordStates,
          [dateKey]: {
            date: state.date,
            weight: "",
            fat: "",
            hasChanges: false,
            isNew: true,
          },
        });

        // Refresh stats
        const newStats = await getMonthlyStats(yearNum, monthNum);
        setStats(newStats);
      } else {
        alert("削除失敗");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete record");
    } finally {
      setDeleteLoading(null);
    }
  }

  async function handleSave(dateKey: string) {
    const state = recordStates[dateKey];
    if (!state || !state.hasChanges) return;

    const weight = parseFloat(state.weight);
    const fat = parseFloat(state.fat);

    // Validate both values and rollback if either is invalid
    if (Number.isNaN(weight) || weight <= 0 || Number.isNaN(fat) || fat <= 0) {
      const originalRecord = state.isNew ? null : records.find((r) => r.date === state.date);
      const originalWeight = originalRecord ? originalRecord.weight.toString() : "";
      const originalFat = originalRecord ? originalRecord.fat_rate.toString() : "";

      setRecordStates({
        ...recordStates,
        [dateKey]: {
          ...state,
          weight: originalWeight,
          fat: originalFat,
          hasChanges: false,
        },
      });

      const invalidField = Number.isNaN(weight) || weight <= 0 ? "weight" : "fat";
      const invalidFieldMessage = invalidField === "weight" ? "体重無効" : "体脂肪率無効";
      alert(invalidFieldMessage);
      return;
    }

    try {
      setSaveLoading(dateKey);

      // Save (create or update) record
      const savedRecord = await saveWeightRecord({
        date: state.date,
        weight: weight,
        fat_rate: fat,
      });

      if (state.isNew) {
        // Add new record to the list
        setRecords([...records, savedRecord]);
      } else {
        // Update existing record in the list
        setRecords(records.map((r) => (r.date === state.date ? savedRecord : r)));
      }

      // Update state
      setRecordStates({
        ...recordStates,
        [dateKey]: {
          date: state.date,
          weight: weight.toString(),
          fat: fat.toString(),
          hasChanges: false,
          isNew: false,
        },
      });

      // Refresh stats
      const newStats = await getMonthlyStats(yearNum, monthNum);
      setStats(newStats);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save record");
    } finally {
      setSaveLoading(null);
    }
  }

  function handleInputChange(dateKey: string, field: "weight" | "fat", value: string) {
    const currentState = recordStates[dateKey];
    if (!currentState) return;

    const newState = { ...currentState, [field]: value };

    // Check if there are changes
    let hasChanges = false;

    if (currentState.isNew) {
      // For new records, check if both fields have values
      hasChanges = newState.weight !== "" && newState.fat !== "";
    } else {
      // For existing records, compare with original values
      const originalRecord = records.find((r) => r.date === currentState.date);
      if (originalRecord) {
        hasChanges =
          newState.weight !== originalRecord.weight.toString() ||
          newState.fat !== originalRecord.fat_rate.toString();
      }
    }

    setRecordStates({
      ...recordStates,
      [dateKey]: {
        ...newState,
        hasChanges,
      },
    });
  }

  function handleInputBlur(dateKey: string, field: "weight" | "fat", value: string) {
    const currentState = recordStates[dateKey];
    if (!currentState) return;

    // Skip validation for empty values
    if (value.trim() === "") return;

    const numValue = parseFloat(value);

    // Validate the number
    if (Number.isNaN(numValue) || numValue <= 0) {
      // Restore original value
      let originalValue = "";

      if (currentState.isNew) {
        originalValue = "";
      } else {
        const originalRecord = records.find((r) => r.date === currentState.date);
        if (originalRecord) {
          originalValue =
            field === "weight"
              ? originalRecord.weight.toString()
              : originalRecord.fat_rate.toString();
        }
      }

      // Update state with original value
      const restoredState = { ...currentState, [field]: originalValue };

      // Recalculate hasChanges
      let hasChanges = false;
      if (currentState.isNew) {
        hasChanges = restoredState.weight !== "" && restoredState.fat !== "";
      } else {
        const originalRecord = records.find((r) => r.date === currentState.date);
        if (originalRecord) {
          hasChanges =
            restoredState.weight !== originalRecord.weight.toString() ||
            restoredState.fat !== originalRecord.fat_rate.toString();
        }
      }

      setRecordStates({
        ...recordStates,
        [dateKey]: {
          ...restoredState,
          hasChanges,
        },
      });

      const fieldMessage = field === "weight" ? "体重無効" : "体脂肪率無効";
      alert(fieldMessage);
    }
  }

  const currentDate = new Date();
  const _isCurrentMonth =
    yearNum === currentDate.getFullYear() && monthNum === currentDate.getMonth() + 1;

  const prevMonth = monthNum === 1 ? 12 : monthNum - 1;
  const prevYear = monthNum === 1 ? yearNum - 1 : yearNum;
  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? yearNum + 1 : yearNum;

  // Sort dates for display
  const sortedDateKeys = Object.keys(recordStates).sort();

  // Generate share URL using the extracted utility
  const shareUrl = generateShareUrl(records, window.location.origin);

  return (
    <div>
      <h2>
        {yearNum}/{monthNum.toString().padStart(2, "0")} 記録
      </h2>
      <p>
        <Link to="/monthly">[月別]</Link>
      </p>
      <p>
        <Link to={`/monthly/${prevYear}/${prevMonth}`}>
          ← {prevYear}/{prevMonth.toString().padStart(2, "0")}
        </Link>{" "}
        |
        <Link to={`/monthly/${nextYear}/${nextMonth}`}>
          {nextYear}/{nextMonth.toString().padStart(2, "0")} →
        </Link>
      </p>
      {stats && (
        <div>
          <h3>統計</h3>
          <p>
            <strong>記録:</strong> {stats.totalRecords}件
            <br />
            <strong>平均体重:</strong>{" "}
            {stats.totalRecords > 0 ? `${stats.averageWeight.toFixed(1)}kg` : "N/A"}
            <br />
            <strong>平均体脂肪:</strong>{" "}
            {stats.totalRecords > 0 ? `${stats.averageFat.toFixed(1)}%` : "N/A"}
            <br />
            <strong>体重変化:</strong>{" "}
            {stats.totalRecords > 1
              ? `${stats.weightChange > 0 ? "+" : ""}${stats.weightChange.toFixed(1)}kg`
              : "N/A"}
            <br />
            <strong>体脂肪変化:</strong>{" "}
            {stats.totalRecords > 1
              ? `${stats.fatChange > 0 ? "+" : ""}${stats.fatChange.toFixed(1)}%`
              : "N/A"}
          </p>
          {shareUrl && (
            <p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl).then(
                    () => alert("コピー完了"),
                    () => alert(`コピー失敗:\n${shareUrl}`)
                  );
                }}
              >
                URLコピー
              </button>
            </p>
          )}
        </div>
      )}
      {records.length > 0 && (
        <div>
          <WeightGraph
            records={records.filter((r) => r.weight > 0 && r.fat_rate > 0)}
            title={`${yearNum}/${monthNum.toString().padStart(2, "0")}`}
          />
          <WeightAbsoluteGraph
            records={records.filter((r) => r.weight > 0 && r.fat_rate > 0)}
            title={`${yearNum}/${monthNum.toString().padStart(2, "0")} 体重・脂肪量`}
          />
        </div>
      )}
      <div>
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>体重</th>
              <th>体脂肪%</th>
              <th>除脂肪</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedDateKeys.map((dateKey) => {
              const state = recordStates[dateKey];
              if (!state) return null;

              const recordDate = new Date(state.date);
              const dayOfWeek = recordDate.toLocaleDateString("en-US", { weekday: "short" });
              const isToday = state.date === new Date().toISOString().split("T")[0];

              // Calculate fat mass and lean mass if both weight and fat values are valid
              const weight = parseFloat(state.weight);
              const fatPercentage = parseFloat(state.fat);
              const hasValidValues =
                !Number.isNaN(weight) &&
                !Number.isNaN(fatPercentage) &&
                weight > 0 &&
                fatPercentage > 0;
              const fatMass = hasValidValues ? weight * (fatPercentage / 100) : 0;
              const leanMass = hasValidValues ? weight - fatMass : 0;

              return (
                <tr key={dateKey}>
                  <td>
                    {recordDate.toLocaleDateString("ja-JP")} ({dayOfWeek}){isToday && ` 今日`}
                  </td>
                  <td>
                    <input
                      type="text"
                      value={state.weight}
                      onChange={(e) => handleInputChange(dateKey, "weight", e.target.value)}
                      onBlur={(e) => handleInputBlur(dateKey, "weight", e.target.value)}
                      placeholder={state.isNew ? "kg" : ""}
                      size={8}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={state.fat}
                      onChange={(e) => handleInputChange(dateKey, "fat", e.target.value)}
                      onBlur={(e) => handleInputBlur(dateKey, "fat", e.target.value)}
                      placeholder={state.isNew ? "%" : ""}
                      size={8}
                    />
                  </td>
                  <td>{hasValidValues ? leanMass.toFixed(1) : "-"}</td>
                  <td>
                    {state.hasChanges && (
                      <button
                        type="button"
                        onClick={() => handleSave(dateKey)}
                        disabled={saveLoading === dateKey}
                      >
                        {saveLoading === dateKey ? "保存中" : "保存"}
                      </button>
                    )}{" "}
                    {!state.isNew && (
                      <button
                        type="button"
                        onClick={() => handleDelete(dateKey)}
                        disabled={deleteLoading === dateKey}
                      >
                        {deleteLoading === dateKey ? "削除中" : "削除"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
