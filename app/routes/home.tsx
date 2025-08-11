import { Link, redirect, useLoaderData } from "react-router";
import { getWeightRecords, getWeightRecordsStats } from "../features/weights/api";
import { DatabaseNotConfiguredError } from "../utils/errors";

export function meta() {
  return [
    { title: "Weight & Fat Tracker" },
    { name: "description", content: "Track your weight and body fat percentage" },
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

export default function Home() {
  const { recentRecords, stats } = useLoaderData<typeof clientLoader>();

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
