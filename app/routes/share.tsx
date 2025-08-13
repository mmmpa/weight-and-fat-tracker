import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import { WeightAbsoluteGraph } from "../components/WeightAbsoluteGraph";
import { WeightGraph } from "../components/WeightGraph";
import { parseShareData } from "../features/share/utils";

export function meta() {
  return [
    { title: "Shared Weight Data" },
    { name: "description", content: "View shared weight and fat percentage data" },
  ];
}

export default function Share() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Get the first query parameter key as the data string
  const dataString = Array.from(searchParams.keys())[0] || "";
  const records = parseShareData(dataString);

  if (!records || records.length === 0) {
    return (
      <div>
        <h2>Shared Weight Data</h2>
        <p>
          <Link to="/">[{t("common.actions.backToHome")}]</Link>
        </p>
        <p>Invalid or missing share data in URL.</p>
        <p>Expected format: ?yyyymmdd-n-aaabbbccc-xxxyyyzzz</p>
        <ul>
          <li>yyyymmdd: Start date (e.g., 20240101)</li>
          <li>n: Digit count for weight (3 or 4)</li>
          <li>aaabbbccc: Weight values</li>
          <li>xxxyyyzzz: Fat percentage values (3 digits each)</li>
        </ul>
      </div>
    );
  }

  // Calculate summary statistics
  const totalWeight = records.reduce((sum, r) => sum + r.weight, 0);
  const totalFat = records.reduce((sum, r) => sum + r.fat_rate, 0);
  const avgWeight = totalWeight / records.length;
  const avgFat = totalFat / records.length;

  const firstRecord = records[0];
  const lastRecord = records[records.length - 1];
  const weightChange = lastRecord.weight - firstRecord.weight;
  const fatChange = lastRecord.fat_rate - firstRecord.fat_rate;

  // Format date range for display
  const startDate = new Date(firstRecord.date);
  const endDate = new Date(lastRecord.date);
  const dateRangeStr = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return (
    <div>
      <h2>Shared Weight Data</h2>
      <p>
        <Link to="/">[{t("common.actions.backToHome")}]</Link>
      </p>

      <h3>{t("share.summary")}</h3>
      <p>
        <strong>Date Range:</strong> {dateRangeStr}
        <br />
        <strong>Records:</strong> {records.length}
        <br />
        <strong>Avg Weight:</strong> {avgWeight.toFixed(1)} kg
        <br />
        <strong>Avg Fat:</strong> {avgFat.toFixed(1)}%
        <br />
        <strong>Weight Change:</strong> {weightChange > 0 ? "+" : ""}
        {weightChange.toFixed(1)} kg
        <br />
        <strong>Fat Change:</strong> {fatChange > 0 ? "+" : ""}
        {fatChange.toFixed(1)}%
      </p>

      <WeightGraph records={records} title="Weight & Fat % Trends" />

      <br />

      <WeightAbsoluteGraph records={records} title="Weight & Fat Weight" />

      <h3>Data Table</h3>
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight (kg)</th>
            <th>Fat %</th>
            <th>Fat Weight (kg)</th>
            <th>Lean Mass (kg)</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const fatWeight = (record.weight * record.fat_rate) / 100;
            const leanMass = record.weight - fatWeight;
            const recordDate = new Date(record.date);
            const dayOfWeek = recordDate.toLocaleDateString("en-US", { weekday: "short" });

            return (
              <tr key={record.id}>
                <td>
                  {recordDate.toLocaleDateString()} ({dayOfWeek})
                </td>
                <td>{record.weight.toFixed(1)}</td>
                <td>{record.fat_rate.toFixed(1)}</td>
                <td>{fatWeight.toFixed(1)}</td>
                <td>{leanMass.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
