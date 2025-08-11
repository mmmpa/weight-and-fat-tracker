import { useEffect, useState } from "react";
import type { WeightRecord } from "../features/weights/types";

type WeightGraphProps = {
  records: WeightRecord[];
  title?: string;
};

export function WeightGraph({
  records,
  title = "Weight & Fat Percentage Graph",
}: WeightGraphProps) {
  const [containerWidth, setContainerWidth] = useState(window.innerWidth - 40); // Account for page margins

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth - 40);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (records.length === 0) return <div>No data available for graph</div>;

  const maxWeight = Math.max(...records.map((r) => r.weight));
  const minWeight = Math.min(...records.map((r) => r.weight));
  const maxFat = Math.max(...records.map((r) => r.fat_rate));
  const minFat = Math.min(...records.map((r) => r.fat_rate));

  const chartWidth = containerWidth;
  const chartHeight = 450; // Increased height for X-axis labels
  const padding = 60; // Increased padding for labels
  const bottomPadding = 100; // Extra padding for X-axis date labels
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding - bottomPadding;

  // Calculate step values for better grid lines
  const weightRange = maxWeight - minWeight;
  const fatRange = maxFat - minFat;

  // Create stepped values (5 steps)
  const weightSteps =
    weightRange === 0
      ? [minWeight - 2, minWeight - 1, minWeight, minWeight + 1, minWeight + 2]
      : Array.from({ length: 6 }, (_, i) => minWeight + (weightRange * i) / 5);
  const fatSteps =
    fatRange === 0
      ? [minFat - 2, minFat - 1, minFat, minFat + 1, minFat + 2]
      : Array.from({ length: 6 }, (_, i) => minFat + (fatRange * i) / 5);

  const xScale = (index: number) => {
    if (records.length === 1) return innerWidth / 2 + padding;
    return (index / (records.length - 1)) * innerWidth + padding;
  };
  const yScaleWeight = (weight: number) => {
    if (maxWeight === minWeight) return chartHeight - bottomPadding - innerHeight / 2;
    return (
      chartHeight - bottomPadding - ((weight - minWeight) / (maxWeight - minWeight)) * innerHeight
    );
  };
  const yScaleFat = (fat: number) => {
    if (maxFat === minFat) return chartHeight - bottomPadding - innerHeight / 2;
    return chartHeight - bottomPadding - ((fat - minFat) / (maxFat - minFat)) * innerHeight;
  };

  const weightPath = records
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScaleWeight(r.weight)}`)
    .join(" ");

  const fatPath = records
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScaleFat(r.fat_rate)}`)
    .join(" ");

  return (
    <div>
      <h3>{title}</h3>

      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ border: "1px solid black", display: "block", width: "100%" }}
        aria-label="Weight and fat percentage graph"
      >
        <title>Weight and fat percentage trends over time</title>
        {/* Horizontal grid lines */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio) => (
          <line
            key={`h-${ratio}`}
            x1={padding}
            y1={chartHeight - bottomPadding - innerHeight * ratio}
            x2={chartWidth - padding}
            y2={chartHeight - bottomPadding - innerHeight * ratio}
            stroke="#f0f0f0"
            strokeWidth="1"
          />
        ))}

        {/* Vertical grid lines */}
        {records.map((record, index) => {
          const recordDate = new Date(record.date);
          const isFirstDay = recordDate.getDate() === 1;
          const isFirstRecord = index === 0;
          const isLastRecord = index === records.length - 1;

          // Show vertical line for: first record, last record, or 1st day of any month
          const shouldShowLine = isFirstRecord || isLastRecord || isFirstDay;

          if (!shouldShowLine) return null;

          return (
            <line
              key={`v-${record.id}`}
              x1={xScale(index)}
              y1={chartHeight - bottomPadding}
              x2={xScale(index)}
              y2={padding}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Weight line */}
        <path d={weightPath} fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Fat line */}
        <path d={fatPath} fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Y-axis labels for weight (left side) */}
        {weightSteps.map((weight, index) => {
          const y = chartHeight - bottomPadding - (index / 5) * innerHeight;
          return (
            <text
              key={`weight-${weight}`}
              x={padding - 10}
              y={y + 4} // Offset for better alignment
              textAnchor="end"
              fontSize="12"
              fill="#3b82f6"
            >
              {weight.toFixed(1)}kg
            </text>
          );
        })}

        {/* Y-axis labels for fat (right side) */}
        {fatSteps.map((fat, index) => {
          const y = chartHeight - bottomPadding - (index / 5) * innerHeight;
          return (
            <text
              key={`fat-${fat}`}
              x={chartWidth - padding + 10}
              y={y + 4} // Offset for better alignment
              textAnchor="start"
              fontSize="12"
              fill="#ef4444"
            >
              {fat.toFixed(1)}%
            </text>
          );
        })}

        {/* X-axis date labels */}
        {records.map((record, index) => {
          const recordDate = new Date(record.date);
          const isFirstDay = recordDate.getDate() === 1;
          const isFirstRecord = index === 0;
          const isLastRecord = index === records.length - 1;

          // Show label for: first record, last record, or 1st day of any month
          const shouldShowLabel = isFirstRecord || isLastRecord || isFirstDay;

          if (!shouldShowLabel) return null;

          return (
            <text
              key={`date-${record.id}`}
              x={xScale(index)}
              y={chartHeight - bottomPadding + 15}
              textAnchor="start"
              fontSize="10"
              fill="#666"
              transform={`rotate(90, ${xScale(index)}, ${chartHeight - bottomPadding + 15})`}
            >
              {recordDate.toISOString().split("T")[0].replace(/-/g, "/")}
            </text>
          );
        })}
      </svg>

      <p>Legend: Blue line = Weight (kg), Red line = Fat %</p>

      <p>
        <strong>Data Points:</strong> {records.length}
        <br />
        <strong>Date Range:</strong> {new Date(records[0].date).toLocaleDateString()} -{" "}
        {new Date(records[records.length - 1].date).toLocaleDateString()}
      </p>
    </div>
  );
}
