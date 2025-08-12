import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "react-router";

// Create a simple mock component that mirrors the Home component structure
// but doesn't rely on loaders or database calls
function MockHome({
  recentRecords = [],
  stats = {
    totalRecords: 0,
    latestWeight: 0,
    latestFat: 0,
    weightChange: 0,
    fatChange: 0,
  },
}: {
  recentRecords?: Array<{
    id: string;
    date: string;
    weight: number;
    fat_rate: number;
  }>;
  stats?: {
    totalRecords: number;
    latestWeight: number;
    latestFat: number;
    weightChange: number;
    fatChange: number;
  };
}) {
  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Quick Links</h3>
      <p>
        <Link to="/monthly">[Monthly Records]</Link>
        <br />
        <Link to="/graph">[View Graph]</Link>
        <br />
        <Link to="/export-import">[Export/Import Data]</Link>
        <br />
        <Link to="/config">[Database Configuration]</Link>
      </p>

      <h3>Summary</h3>
      <p>
        <strong>Total Records:</strong> {stats.totalRecords}
        <br />
        <strong>Latest Weight:</strong> {stats.latestWeight.toFixed(1)} kg
        {stats.weightChange !== 0 && (
          <span>
            {" "}
            ({stats.weightChange > 0 ? "+" : ""}
            {stats.weightChange.toFixed(1)} kg)
          </span>
        )}
        <br />
        <strong>Latest Fat %:</strong> {stats.latestFat.toFixed(1)}%
        {stats.fatChange !== 0 && (
          <span>
            {" "}
            ({stats.fatChange > 0 ? "+" : ""}
            {stats.fatChange.toFixed(1)}%)
          </span>
        )}
      </p>

      {recentRecords.length > 0 && (
        <div>
          <h3>Recent Records</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th>Fat %</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.weight.toFixed(1)}</td>
                  <td>{record.fat_rate.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: "Pages/Home",
  component: MockHome,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MockHome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recentRecords: [
      {
        id: "1",
        date: "2024-01-15",
        weight: 70.5,
        fat_rate: 18.5,
      },
      {
        id: "2",
        date: "2024-01-14",
        weight: 70.8,
        fat_rate: 18.7,
      },
      {
        id: "3",
        date: "2024-01-13",
        weight: 71.0,
        fat_rate: 18.9,
      },
    ],
    stats: {
      totalRecords: 25,
      latestWeight: 70.5,
      latestFat: 18.5,
      weightChange: -0.3,
      fatChange: -0.2,
    },
  },
};

export const WithNoRecords: Story = {
  args: {
    recentRecords: [],
    stats: {
      totalRecords: 0,
      latestWeight: 0,
      latestFat: 0,
      weightChange: 0,
      fatChange: 0,
    },
  },
};

export const WithWeightGain: Story = {
  args: {
    recentRecords: [
      {
        id: "1",
        date: "2024-01-15",
        weight: 72.1,
        fat_rate: 19.2,
      },
      {
        id: "2",
        date: "2024-01-14",
        weight: 71.8,
        fat_rate: 19.0,
      },
    ],
    stats: {
      totalRecords: 25,
      latestWeight: 72.1,
      latestFat: 19.2,
      weightChange: 1.5,
      fatChange: 0.8,
    },
  },
};

export const WithManyRecords: Story = {
  args: {
    recentRecords: [
      { id: "1", date: "2024-01-15", weight: 70.5, fat_rate: 18.5 },
      { id: "2", date: "2024-01-14", weight: 70.8, fat_rate: 18.7 },
      { id: "3", date: "2024-01-13", weight: 71.0, fat_rate: 18.9 },
      { id: "4", date: "2024-01-12", weight: 71.2, fat_rate: 19.1 },
      { id: "5", date: "2024-01-11", weight: 71.4, fat_rate: 19.3 },
    ],
    stats: {
      totalRecords: 150,
      latestWeight: 70.5,
      latestFat: 18.5,
      weightChange: -2.1,
      fatChange: -1.5,
    },
  },
};
