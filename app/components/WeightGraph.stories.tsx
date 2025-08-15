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
  { date: "2024-01-10", weight: 71.2, fat_rate: 19.5 },
  { date: "2024-01-11", weight: 71.0, fat_rate: 19.3 },
  { date: "2024-01-12", weight: 70.8, fat_rate: 19.1 },
  { date: "2024-01-13", weight: 70.6, fat_rate: 18.9 },
  { date: "2024-01-14", weight: 70.5, fat_rate: 18.7 },
];

const longTermRecords: WeightRecord[] = [
  { date: "2024-01-01", weight: 75.0, fat_rate: 22.0 },
  { date: "2024-01-15", weight: 73.5, fat_rate: 21.0 },
  { date: "2024-02-01", weight: 72.0, fat_rate: 20.0 },
  { date: "2024-02-15", weight: 70.5, fat_rate: 19.0 },
  { date: "2024-03-01", weight: 69.0, fat_rate: 18.0 },
  { date: "2024-03-15", weight: 68.0, fat_rate: 17.5 },
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
    records: [{ date: "2024-01-15", weight: 70.5, fat_rate: 18.5 }],
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
    records: [],
    title: "High Variation Data",
  },
};
