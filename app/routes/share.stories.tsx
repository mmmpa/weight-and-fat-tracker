import type { Meta, StoryObj } from "@storybook/react";
import { WithRouter } from "../test-utils/storybook";
import Share from "./share";

const meta = {
  title: "Pages/Share",
  component: Share,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, { parameters }) => (
      <WithRouter initialEntries={[parameters?.initialRoute || "/?invalid-data"]}>
        <Story />
      </WithRouter>
    ),
  ],
} satisfies Meta<typeof Share>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    initialRoute: "/?20240101-3-700705710-180185190",
  },
};

export const InvalidData: Story = {
  parameters: {
    initialRoute: "/?invalid-data",
  },
};

export const SingleRecord: Story = {
  parameters: {
    initialRoute: "/?20240115-3-705-185",
  },
};

export const MonthlyData: Story = {
  parameters: {
    initialRoute:
      "/?20240101-3-700701702703704705706707708709710711712713714715716717718719720721722723724725726727728729730-180181182183184185186187188189190191192193194195196197198199200201202203204205206207208209210",
  },
};

export const WeightLossJourney: Story = {
  parameters: {
    initialRoute:
      "/?20240101-3-800795790785780775770765760755750745740735730-250245240235230225220215210205200195190185180",
  },
};

export const HighWeightData: Story = {
  parameters: {
    initialRoute: "/?20240101-4-10501048104510421040-300298295292290",
  },
};
