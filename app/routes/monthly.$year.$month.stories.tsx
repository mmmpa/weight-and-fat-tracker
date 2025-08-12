import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Link } from "react-router";
import { WeightAbsoluteGraph } from "../components/WeightAbsoluteGraph";
import { WeightGraph } from "../components/WeightGraph";
import type { WeightRecord } from "../features/weights/types";

// Sample weight record data for the stories
const sampleJanuaryRecords: WeightRecord[] = [
  {
    id: "1",
    date: "2024-01-01",
    weight: 75.0,
    fat_rate: 20.0,
  },
  {
    id: "2",
    date: "2024-01-15",
    weight: 74.5,
    fat_rate: 19.8,
  },
  {
    id: "3",
    date: "2024-01-31",
    weight: 74.0,
    fat_rate: 19.5,
  },
];

// Create a simplified mock component for the monthly detail view
function MockMonthlyDetail({
  year = 2024,
  month = 1,
  records = sampleJanuaryRecords,
}: {
  year?: number;
  month?: number;
  records?: WeightRecord[];
}) {
  const [weightRecords] = useState<WeightRecord[]>(records);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [weight, setWeight] = useState("");
  const [fat, setFat] = useState("");

  // Generate all dates in the month
  const generateAllDatesInMonth = (year: number, month: number): string[] => {
    const dates: string[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      dates.push(dateStr);
    }

    return dates;
  };

  const allDates = generateAllDatesInMonth(year, month);
  const recordsMap = new Map(weightRecords.map((r) => [r.date, r]));

  const handleEdit = (index: number, record?: WeightRecord) => {
    setEditingIndex(index);
    if (record) {
      setWeight(record.weight.toString());
      setFat(record.fat_rate.toString());
    } else {
      setWeight("");
      setFat("");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setWeight("");
    setFat("");
  };

  const handleSave = () => {
    // Mock save for Storybook
    alert(`Saved: Weight ${weight}kg, Fat ${fat}%`);
    handleCancel();
  };

  const handleDelete = (recordId: string) => {
    // Mock delete for Storybook
    alert(`Deleted record ${recordId}`);
  };

  return (
    <div>
      <h1>
        Monthly Records - {year}/{month.toString().padStart(2, "0")}
      </h1>

      <p>
        <Link to="/monthly">← Back to Monthly Overview</Link>
      </p>

      <h2>Records</h2>
      <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "5px" }}>Date</th>
            <th style={{ padding: "5px" }}>Weight (kg)</th>
            <th style={{ padding: "5px" }}>Fat %</th>
            <th style={{ padding: "5px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allDates.map((date, index) => {
            const record = recordsMap.get(date);
            const isEditing = editingIndex === index;

            return (
              <tr key={date}>
                <td style={{ padding: "5px" }}>{date}</td>
                <td style={{ padding: "5px" }}>
                  {isEditing ? (
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      step="0.1"
                      style={{ width: "80px" }}
                    />
                  ) : (
                    record?.weight.toFixed(1) || "-"
                  )}
                </td>
                <td style={{ padding: "5px" }}>
                  {isEditing ? (
                    <input
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      step="0.1"
                      style={{ width: "80px" }}
                    />
                  ) : (
                    record?.fat_rate.toFixed(1) || "-"
                  )}
                </td>
                <td style={{ padding: "5px" }}>
                  {isEditing ? (
                    <>
                      <button type="button" onClick={handleSave}>
                        Save
                      </button>{" "}
                      <button type="button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleEdit(index, record)}>
                        {record ? "Edit" : "Add"}
                      </button>
                      {record && (
                        <>
                          {" "}
                          <button type="button" onClick={() => handleDelete(record.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {weightRecords.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Graphs</h2>

          <WeightGraph
            records={weightRecords}
            title={`Weight & Fat Percentage - ${year}/${month.toString().padStart(2, "0")}`}
          />

          <br />

          <WeightAbsoluteGraph
            records={weightRecords}
            title={`Weight & Fat Weight - ${year}/${month.toString().padStart(2, "0")}`}
          />
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2>Share Data</h2>
        <p>Mock share URL: /?2024-01-01-3-750745740-200198195</p>
        <button type="button" onClick={() => alert("Share URL copied to clipboard (mock)")}>
          Copy Share URL
        </button>
      </div>
    </div>
  );
}

const meta = {
  title: "Pages/MonthlyDetail",
  component: MockMonthlyDetail,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MockMonthlyDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const January2024: Story = {
  args: {
    year: 2024,
    month: 1,
    records: sampleJanuaryRecords,
  },
};

export const EmptyMonth: Story = {
  args: {
    year: 2024,
    month: 2,
    records: [],
  },
};

export const FullMonth: Story = {
  args: {
    year: 2024,
    month: 3,
    records: [
      { id: "1", date: "2024-03-01", weight: 75.0, fat_rate: 20.0 },
      { id: "2", date: "2024-03-05", weight: 74.8, fat_rate: 19.9 },
      { id: "3", date: "2024-03-10", weight: 74.5, fat_rate: 19.7 },
      { id: "4", date: "2024-03-15", weight: 74.2, fat_rate: 19.5 },
      { id: "5", date: "2024-03-20", weight: 74.0, fat_rate: 19.3 },
      { id: "6", date: "2024-03-25", weight: 73.8, fat_rate: 19.1 },
      { id: "7", date: "2024-03-31", weight: 73.5, fat_rate: 19.0 },
    ],
  },
};

export const February2024LeapYear: Story = {
  args: {
    year: 2024,
    month: 2, // February 2024 has 29 days (leap year)
    records: [
      { id: "1", date: "2024-02-01", weight: 76.0, fat_rate: 20.5 },
      { id: "2", date: "2024-02-14", weight: 75.5, fat_rate: 20.2 },
      { id: "3", date: "2024-02-29", weight: 75.0, fat_rate: 20.0 },
    ],
  },
};
