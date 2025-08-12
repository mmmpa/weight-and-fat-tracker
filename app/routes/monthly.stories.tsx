import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "react-router";

// Create a simple mock component that mirrors the Monthly component structure
function MockMonthly({
  availableMonths = [],
}: {
  availableMonths?: Array<{
    year: number;
    month: number;
    count: number;
  }>;
}) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (
    <div>
      <h2>Monthly Records</h2>

      {availableMonths.length === 0 ? (
        <p>No records found. Use the monthly view to add your first record.</p>
      ) : (
        <div>
          <p>
            <strong>Quick link:</strong>{" "}
            <Link to={`/monthly/${currentYear}/${currentMonth}`}>
              Current Month ({currentYear}/{currentMonth.toString().padStart(2, "0")})
            </Link>
          </p>

          <h3>Available Months</h3>
          <ul>
            {availableMonths.map(
              ({ year, month, count }: { year: number; month: number; count: number }) => (
                <li key={`${year}-${month}`}>
                  <Link to={`/monthly/${year}/${month}`}>
                    {year}/{month.toString().padStart(2, "0")}
                  </Link>{" "}
                  ({count} record{count !== 1 ? "s" : ""})
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

const meta = {
  title: "Pages/Monthly",
  component: MockMonthly,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MockMonthly>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    availableMonths: [
      { year: 2024, month: 1, count: 15 },
      { year: 2023, month: 12, count: 20 },
      { year: 2023, month: 11, count: 18 },
      { year: 2023, month: 10, count: 22 },
    ],
  },
};

export const WithNoRecords: Story = {
  args: {
    availableMonths: [],
  },
};

export const WithSingleMonth: Story = {
  args: {
    availableMonths: [{ year: 2024, month: 1, count: 5 }],
  },
};

export const WithManyMonths: Story = {
  args: {
    availableMonths: [
      { year: 2024, month: 8, count: 25 },
      { year: 2024, month: 7, count: 31 },
      { year: 2024, month: 6, count: 30 },
      { year: 2024, month: 5, count: 31 },
      { year: 2024, month: 4, count: 30 },
      { year: 2024, month: 3, count: 31 },
      { year: 2024, month: 2, count: 29 },
      { year: 2024, month: 1, count: 31 },
      { year: 2023, month: 12, count: 31 },
      { year: 2023, month: 11, count: 30 },
      { year: 2023, month: 10, count: 25 },
      { year: 2023, month: 9, count: 20 },
    ],
  },
};

export const WithSingleRecordMonths: Story = {
  args: {
    availableMonths: [
      { year: 2024, month: 3, count: 1 },
      { year: 2024, month: 2, count: 1 },
      { year: 2024, month: 1, count: 1 },
    ],
  },
};
