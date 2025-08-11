import { Link, redirect, useLoaderData } from "react-router";
import { getAvailableMonths } from "../features/weights/api";
import { DatabaseNotConfiguredError } from "../utils/errors";

export function meta() {
  return [
    { title: "Monthly Records" },
    { name: "description", content: "Browse weight records by month" },
  ];
}

export async function clientLoader() {
  try {
    const availableMonths = await getAvailableMonths();
    return { availableMonths };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      throw redirect("/config");
    }
    throw error;
  }
}

export default function Monthly() {
  const { availableMonths } = useLoaderData<typeof clientLoader>();

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
