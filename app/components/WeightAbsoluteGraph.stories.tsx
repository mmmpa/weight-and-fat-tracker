import type { Meta, StoryObj } from "@storybook/react";
import type { WeightRecord } from "../features/weights/types";
import { WeightAbsoluteGraph } from "./WeightAbsoluteGraph";

const meta = {
  title: "Components/WeightAbsoluteGraph",
  component: WeightAbsoluteGraph,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WeightAbsoluteGraph>;

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

const bodyRecompositionData: WeightRecord[] = [
  { id: "1", date: "2024-01-01", weight: 80.0, fat_rate: 25.0 }, // 20kg fat, 60kg lean
  { id: "2", date: "2024-02-01", weight: 78.0, fat_rate: 22.0 }, // 17.16kg fat, 60.84kg lean
  { id: "3", date: "2024-03-01", weight: 77.0, fat_rate: 19.0 }, // 14.63kg fat, 62.37kg lean
  { id: "4", date: "2024-04-01", weight: 76.5, fat_rate: 17.0 }, // 13.01kg fat, 63.49kg lean
  { id: "5", date: "2024-05-01", weight: 77.0, fat_rate: 15.0 }, // 11.55kg fat, 65.45kg lean
];

export const Default: Story = {
  args: {
    records: sampleRecords,
    title: "Weight & Body Composition",
  },
};

export const NoData: Story = {
  args: {
    records: [],
    title: "No Data Available",
  },
};

export const BodyRecomposition: Story = {
  args: {
    records: bodyRecompositionData,
    title: "Body Recomposition Progress",
  },
};

export const HighWeightRange: Story = {
  args: {
    records: [
      { id: "1", date: "2024-01-01", weight: 100.0, fat_rate: 30.0 },
      { id: "2", date: "2024-01-02", weight: 99.5, fat_rate: 29.5 },
      { id: "3", date: "2024-01-03", weight: 99.0, fat_rate: 29.0 },
      { id: "4", date: "2024-01-04", weight: 98.5, fat_rate: 28.5 },
      { id: "5", date: "2024-01-05", weight: 98.0, fat_rate: 28.0 },
    ],
    title: "High Weight Range",
  },
};

export const LowFatPercentage: Story = {
  args: {
    records: [
      { id: "1", date: "2024-01-01", weight: 65.0, fat_rate: 10.0 },
      { id: "2", date: "2024-01-02", weight: 65.2, fat_rate: 10.2 },
      { id: "3", date: "2024-01-03", weight: 65.1, fat_rate: 10.1 },
      { id: "4", date: "2024-01-04", weight: 65.3, fat_rate: 10.3 },
      { id: "5", date: "2024-01-05", weight: 65.0, fat_rate: 10.0 },
    ],
    title: "Athletic Body Composition",
  },
};
