import { useTranslation } from "react-i18next";
import { Link, redirect, useLoaderData } from "react-router";
import { getAvailableMonths } from "../features/weights/api";
import { DatabaseNotConfiguredError } from "../utils/errors";
import { redirectToCurrentMonth } from "../utils/navigation";

export function meta() {
  return [
    { title: "Monthly Records" },
    { name: "description", content: "Browse weight records by month" },
  ];
}

export async function clientLoader() {
  try {
    const availableMonths = await getAvailableMonths();

    // Redirect to current month if no records exist
    if (availableMonths.length === 0) {
      throw redirectToCurrentMonth();
    }

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
  const { t } = useTranslation();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (
    <div>
      <h2>{t("monthly.title")}</h2>

      <p>
        <Link to={`/monthly/${currentYear}/${currentMonth.toString().padStart(2, "0")}`}>
          {t("monthly.currentMonth")} ({currentYear}/{currentMonth.toString().padStart(2, "0")})
        </Link>
      </p>

      {availableMonths.length === 0 ? (
        <p>{t("monthly.noRecords")}</p>
      ) : (
        <div>
          <h3>{t("monthly.availableMonths")}</h3>
          <ul>
            {availableMonths.map(
              ({ year, month, count }: { year: number; month: number; count: number }) => (
                <li key={`${year}-${month}`}>
                  <Link to={`/monthly/${year}/${month}`}>
                    {year}/{month.toString().padStart(2, "0")}
                  </Link>{" "}
                  ({count} {count !== 1 ? t("monthly.records") : t("monthly.record")})
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
