import { useTranslation } from "react-i18next";
import { Link, redirect, useLoaderData } from "react-router";
import { getWeightRecords, getWeightRecordsStats } from "../features/weights/api";
import { DatabaseNotConfiguredError } from "../utils/errors";
import { getCurrentMonthPath } from "../utils/navigation";

export function meta() {
  return [
    { title: "Dashboard - Weight & Fat Tracker" },
    { name: "description", content: "View your weight tracking statistics and recent records" },
  ];
}

export async function clientLoader() {
  try {
    const [records, statsData] = await Promise.all([getWeightRecords(), getWeightRecordsStats()]);

    return {
      recentRecords: records.slice(0, 5),
      stats: {
        totalRecords: statsData.totalRecords,
        latestWeight: statsData.latestWeight,
        latestFat: statsData.latestFat,
        weightChange: statsData.weightChange,
        fatChange: statsData.fatChange,
      },
    };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      throw redirect("/config");
    }
    throw error;
  }
}

export default function Dashboard() {
  const { recentRecords, stats } = useLoaderData<typeof clientLoader>();
  const { t } = useTranslation();

  // Get current month for display
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  return (
    <div>
      <h2>{t("dashboard.title")}</h2>

      <p>
        <Link to={getCurrentMonthPath()}>
          {t("monthly.currentMonth")} ({currentYear}/{currentMonth})
        </Link>
      </p>

      <h3>{t("dashboard.summary.title")}</h3>
      <p>
        <strong>{t("dashboard.summary.totalRecords")}</strong> {stats.totalRecords}
        <br />
        <strong>{t("dashboard.summary.latestWeight")}</strong> {stats.latestWeight.toFixed(1)}{" "}
        {t("common.units.kg")}
        {stats.weightChange !== 0 && (
          <span>
            {" "}
            ({stats.weightChange > 0 ? "+" : ""}
            {stats.weightChange.toFixed(1)} kg)
          </span>
        )}
        <br />
        <strong>{t("dashboard.summary.latestFat")}</strong> {stats.latestFat.toFixed(1)}
        {t("common.units.percent")}
        {stats.fatChange !== 0 && (
          <span>
            {" "}
            ({stats.fatChange > 0 ? "+" : ""}
            {stats.fatChange.toFixed(1)}
            {t("common.units.percent")})
          </span>
        )}
      </p>

      {recentRecords.length > 0 && (
        <div>
          <h3>{t("dashboard.recentRecords")}</h3>
          <table>
            <thead>
              <tr>
                <th>{t("common.table.date")}</th>
                <th>{t("common.table.weight")}</th>
                <th>{t("common.table.fatPercent")}</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.date}>
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
