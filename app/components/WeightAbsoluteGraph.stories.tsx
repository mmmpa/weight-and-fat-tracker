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
  { date: "2024-01-10", weight: 71.2, fat_rate: 19.5 },
  { date: "2024-01-11", weight: 71.0, fat_rate: 19.3 },
  { date: "2024-01-12", weight: 70.8, fat_rate: 19.1 },
  { date: "2024-01-13", weight: 70.6, fat_rate: 18.9 },
  { date: "2024-01-14", weight: 70.5, fat_rate: 18.7 },
];

const bodyRecompositionData: WeightRecord[] = [
  { date: "2024-01-01", weight: 70.0, fat_rate: 25.0 },
  { date: "2024-02-01", weight: 70.5, fat_rate: 23.0 },
  { date: "2024-03-01", weight: 71.0, fat_rate: 21.0 },
  { date: "2024-04-01", weight: 71.5, fat_rate: 19.0 },
  { date: "2024-05-01", weight: 72.0, fat_rate: 17.0 },
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
    records: [],
    title: "High Weight Range",
  },
};

export const LowFatPercentage: Story = {
  args: {
    records: [],
    title: "Athletic Body Composition",
  },
};
