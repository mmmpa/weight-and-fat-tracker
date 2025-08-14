import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, redirect, useLoaderData } from "react-router";
import { WeightAbsoluteGraph } from "../components/WeightAbsoluteGraph";
import { WeightGraph } from "../components/WeightGraph";
import { getWeightRecords, getWeightRecordsByDateRange } from "../features/weights/api";
import type { WeightRecord } from "../features/weights/types";
import { DatabaseNotConfiguredError } from "../utils/errors";

export async function clientLoader() {
  try {
    const data = await getWeightRecords();
    // Reverse to show chronologically (old to new)
    const reversedData = data.reverse();
    // Filter out records with 0 values for weight or fat_rate
    const filteredData = reversedData.filter((record) => record.weight > 0 && record.fat_rate > 0);

    return { initialRecords: filteredData };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      throw redirect("/config");
    }
    throw error;
  }
}

export default function Graph() {
  const { t } = useTranslation();
  const { initialRecords } = useLoaderData<typeof clientLoader>();
  const [records, setRecords] = useState<WeightRecord[]>(initialRecords);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Date range state
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [useRangeFilter, setUseRangeFilter] = useState(false);

  const handleFilterChange = async () => {
    try {
      setLoading(true);
      let data: WeightRecord[];

      if (useRangeFilter) {
        data = await getWeightRecordsByDateRange(startDate, endDate);
      } else {
        data = await getWeightRecords();
        // Reverse to show chronologically (old to new)
        data = data.reverse();
      }

      // Filter out records with 0 values for weight or fat_rate
      const filteredData = data.filter((record) => record.weight > 0 && record.fat_rate > 0);
      setRecords(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    if (useRangeFilter) {
      await handleFilterChange();
    }
  };

  const handleRangeFilterToggle = async (checked: boolean) => {
    setUseRangeFilter(checked);
    await handleFilterChange();
  };

  if (loading) return <div>{t("common.status.loading")}</div>;
  if (error)
    return (
      <div>
        {t("common.status.error")} {error}
      </div>
    );

  // Get current month for redirect link
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  return (
    <div>
      <h2>{t("graph.title")}</h2>

      <p>
        <Link to={`/monthly/${currentYear}/${currentMonth}`}>
          {t("monthly.currentMonth")} ({currentYear}/{currentMonth})
        </Link>
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h3>{t("common.dateLabels.dateRange")}</h3>
        <label>
          <input
            type="checkbox"
            checked={useRangeFilter}
            onChange={(e) => handleRangeFilterToggle(e.target.checked)}
          />
          {t("graph.useDateRange")}
        </label>

        {useRangeFilter && (
          <div style={{ marginTop: "10px" }}>
            <label>
              {t("common.dateLabels.startDate")}
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange("start", e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <br />
            <label>
              {t("common.dateLabels.endDate")}
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange("end", e.target.value)}
                style={{ marginLeft: "10px", marginTop: "5px" }}
              />
            </label>
          </div>
        )}
      </div>

      <WeightGraph
        records={records}
        title={
          useRangeFilter ? t("graph.recordsRange", { startDate, endDate }) : t("graph.allRecords")
        }
      />

      <br />

      <WeightAbsoluteGraph
        records={records}
        title={
          useRangeFilter
            ? t("graph.weightFatRange", { startDate, endDate })
            : t("graph.weightFatAll")
        }
      />
    </div>
  );
}
