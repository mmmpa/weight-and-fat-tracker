import type { Meta, StoryObj } from "@storybook/react";
import type { WeightRecord } from "../features/weights/types";
import { WeightGraph } from "./WeightGraph";

const meta = {
  title: "Components/WeightGraph",
  component: WeightGraph,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WeightGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleRecords: WeightRecord[] = [
  { id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 },
  { id: "2", date: "2024-01-02", weight: 70.2, fat_rate: 18.2 },
  { id: "3", date: "2024-01-03", weight: 70.5, fat_rate: 18.5 },
  { id: "4", date: "2024-01-04", weight: 70.3, fat_rate: 18.3 },
  { id: "5", date: "2024-01-05", weight: 70.1, fat_rate: 18.1 },
];

const longTermRecords: WeightRecord[] = [
  { id: "1", date: "2024-01-01", weight: 75.0, fat_rate: 22.0 },
  { id: "2", date: "2024-01-15", weight: 74.5, fat_rate: 21.5 },
  { id: "3", date: "2024-02-01", weight: 74.0, fat_rate: 21.0 },
  { id: "4", date: "2024-02-15", weight: 73.5, fat_rate: 20.5 },
  { id: "5", date: "2024-03-01", weight: 73.0, fat_rate: 20.0 },
  { id: "6", date: "2024-03-15", weight: 72.5, fat_rate: 19.5 },
];

export const Default: Story = {
  args: {
    records: sampleRecords,
    title: "Weight & Fat % Trends",
  },
};

export const NoData: Story = {
  args: {
    records: [],
    title: "No Data Available",
  },
};

export const SingleDataPoint: Story = {
  args: {
    records: [{ id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 }],
    title: "Single Data Point",
  },
};

export const LongTermTrend: Story = {
  args: {
    records: longTermRecords,
    title: "3-Month Weight Loss Progress",
  },
};

export const HighVariation: Story = {
  args: {
    records: [
      { id: "1", date: "2024-01-01", weight: 70.0, fat_rate: 18.0 },
      { id: "2", date: "2024-01-02", weight: 72.0, fat_rate: 19.0 },
      { id: "3", date: "2024-01-03", weight: 69.0, fat_rate: 17.0 },
      { id: "4", date: "2024-01-04", weight: 73.0, fat_rate: 20.0 },
      { id: "5", date: "2024-01-05", weight: 68.0, fat_rate: 16.0 },
    ],
    title: "High Variation Data",
  },
};
