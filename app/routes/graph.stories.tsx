import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { WeightAbsoluteGraph } from "../components/WeightAbsoluteGraph";
import { WeightGraph } from "../components/WeightGraph";
import type { WeightRecord } from "../features/weights/types";

// Sample weight record data for the stories
const sampleRecords: WeightRecord[] = [
  {
    id: "1",
    date: "2024-01-01",
    weight: 75.0,
    fat_rate: 20.0,
  },
  {
    id: "2",
    date: "2024-01-08",
    weight: 74.5,
    fat_rate: 19.8,
  },
  {
    id: "3",
    date: "2024-01-15",
    weight: 74.0,
    fat_rate: 19.5,
  },
  {
    id: "4",
    date: "2024-01-22",
    weight: 73.5,
    fat_rate: 19.2,
  },
  {
    id: "5",
    date: "2024-01-29",
    weight: 73.0,
    fat_rate: 19.0,
  },
];

// Create a mock component that mirrors the Graph component structure
function MockGraph({ initialRecords = sampleRecords }: { initialRecords?: WeightRecord[] }) {
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredData = initialRecords;
      if (useRangeFilter) {
        filteredData = initialRecords.filter(
          (record) => record.date >= startDate && record.date <= endDate
        );
      }

      setRecords(filteredData.filter((record) => record.weight > 0 && record.fat_rate > 0));
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Weight & Fat Percentage Graph</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Date Range</h3>
        <label>
          <input
            type="checkbox"
            checked={useRangeFilter}
            onChange={(e) => handleRangeFilterToggle(e.target.checked)}
          />
          Use date range filter
        </label>

        {useRangeFilter && (
          <div style={{ marginTop: "10px" }}>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange("start", e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <br />
            <label>
              End Date:
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
        title={useRangeFilter ? `Records from ${startDate} to ${endDate}` : "All Records"}
      />

      <br />

      <WeightAbsoluteGraph
        records={records}
        title={
          useRangeFilter
            ? `Weight & Fat Weight from ${startDate} to ${endDate}`
            : "Weight & Fat Weight - All Records"
        }
      />
    </div>
  );
}

const meta = {
  title: "Pages/Graph",
  component: MockGraph,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MockGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialRecords: sampleRecords,
  },
};

export const WithNoRecords: Story = {
  args: {
    initialRecords: [],
  },
};

export const WeightLossJourney: Story = {
  args: {
    initialRecords: [
      { id: "1", date: "2024-01-01", weight: 80.0, fat_rate: 25.0 },
      { id: "2", date: "2024-02-01", weight: 78.5, fat_rate: 24.2 },
      { id: "3", date: "2024-03-01", weight: 77.0, fat_rate: 23.5 },
      { id: "4", date: "2024-04-01", weight: 75.5, fat_rate: 22.8 },
      { id: "5", date: "2024-05-01", weight: 74.0, fat_rate: 22.0 },
      { id: "6", date: "2024-06-01", weight: 72.5, fat_rate: 21.2 },
      { id: "7", date: "2024-07-01", weight: 71.0, fat_rate: 20.5 },
      { id: "8", date: "2024-08-01", weight: 70.0, fat_rate: 19.8 },
    ],
  },
};

export const WeightGainJourney: Story = {
  args: {
    initialRecords: [
      { id: "1", date: "2024-01-01", weight: 65.0, fat_rate: 15.0 },
      { id: "2", date: "2024-02-01", weight: 66.5, fat_rate: 15.5 },
      { id: "3", date: "2024-03-01", weight: 68.0, fat_rate: 16.0 },
      { id: "4", date: "2024-04-01", weight: 69.5, fat_rate: 16.5 },
      { id: "5", date: "2024-05-01", weight: 71.0, fat_rate: 17.0 },
    ],
  },
};

export const HighVariationData: Story = {
  args: {
    initialRecords: [
      { id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 },
      { id: "2", date: "2024-01-02", weight: 72.5, fat_rate: 19.5 },
      { id: "3", date: "2024-01-03", weight: 69.5, fat_rate: 17.8 },
      { id: "4", date: "2024-01-04", weight: 71.8, fat_rate: 18.9 },
      { id: "5", date: "2024-01-05", weight: 70.2, fat_rate: 18.2 },
      { id: "6", date: "2024-01-06", weight: 73.0, fat_rate: 20.0 },
      { id: "7", date: "2024-01-07", weight: 69.0, fat_rate: 17.5 },
    ],
  },
};
