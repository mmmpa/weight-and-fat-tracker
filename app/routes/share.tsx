import { Link, useSearchParams } from "react-router";
import { WeightAbsoluteGraph } from "../components/WeightAbsoluteGraph";
import { WeightGraph } from "../components/WeightGraph";
import { parseShareData } from "../features/share/utils";

export function meta() {
  return [
    { title: "共有データ - 1kg.app" },
    { name: "description", content: "共有された体重データ" },
  ];
}

export default function Share() {
  const [searchParams] = useSearchParams();

  // Get the first query parameter key as the data string
  const dataString = Array.from(searchParams.keys())[0] || "";
  const records = parseShareData(dataString);

  if (!records || records.length === 0) {
    return (
      <div>
        <h2>共有データ</h2>
        <p>
          <Link to="/">[ホームに戻る]</Link>
        </p>
        <p>URLに無効データ。</p>
        <p>形式: ?yyyymmdd-n-aaabbbccc-xxxyyyzzz</p>
        <ul>
          <li>yyyymmdd: 開始日</li>
          <li>n: 体重桁数</li>
          <li>aaabbbccc: 体重</li>
          <li>xxxyyyzzz: 体脂肪率</li>
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
      <h2>共有データ</h2>
      <p>
        <Link to="/">[ホームに戻る]</Link>
      </p>
      <h3>統計</h3>
      <p>
        <strong>期間:</strong> {dateRangeStr}
        <br />
        <strong>記録:</strong> {records.length}件
        <br />
        <strong>平均体重:</strong> {avgWeight.toFixed(1)}kg
        <br />
        <strong>平均体脂肪:</strong> {avgFat.toFixed(1)}%
        <br />
        <strong>体重変化:</strong> {weightChange > 0 ? "+" : ""}
        {weightChange.toFixed(1)}kg
        <br />
        <strong>体脂肪変化:</strong> {fatChange > 0 ? "+" : ""}
        {fatChange.toFixed(1)}%
      </p>
      <WeightGraph records={records} title="推移" />
      <WeightAbsoluteGraph records={records} title="体重・脂肪量" />
      <h3>データ</h3>
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>日付</th>
            <th>体重</th>
            <th>体脂肪%</th>
            <th>体脂肪量</th>
            <th>除脂肪</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const fatWeight = (record.weight * record.fat_rate) / 100;
            const leanMass = record.weight - fatWeight;
            const recordDate = new Date(record.date);
            const dayOfWeek = recordDate.toLocaleDateString("en-US", { weekday: "short" });

            return (
              <tr key={record.date}>
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
