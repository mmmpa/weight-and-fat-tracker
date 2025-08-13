import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { WeightRecord } from "../features/weights/types";

type WeightAbsoluteGraphProps = {
  records: WeightRecord[];
  title?: string;
};

export function WeightAbsoluteGraph({ records, title }: WeightAbsoluteGraphProps) {
  const { t } = useTranslation();
  const [containerWidth, setContainerWidth] = useState(window.innerWidth - 40); // Account for page margins

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth - 40);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (records.length === 0) return <div>{t("weightAbsoluteGraph.noData")}</div>;

  // Calculate fat weight and muscle weight for each record
  const recordsWithCalculations = records.map((record) => {
    const fatWeight = record.weight * (record.fat_rate / 100);
    const muscleWeight = record.weight - fatWeight;
    return {
      ...record,
      fatWeight,
      muscleWeight,
    };
  });

  const maxWeight = Math.max(...recordsWithCalculations.map((r) => r.weight));
  const maxFatWeight = Math.max(...recordsWithCalculations.map((r) => r.fatWeight));
  const maxMuscleWeight = Math.max(...recordsWithCalculations.map((r) => r.muscleWeight));
  const maxValue = Math.max(maxWeight, maxFatWeight, maxMuscleWeight);

  // Start from 0
  const minValue = 0;

  const chartWidth = containerWidth;
  const chartHeight = 450; // Increased height for X-axis labels
  const padding = 60; // Increased padding for labels
  const bottomPadding = 100; // Extra padding for X-axis date labels
  const innerWidth = chartWidth - padding * 2;
  const innerHeight = chartHeight - padding - bottomPadding;

  // Create stepped values from 0 to max
  const steps = 6;
  const stepValues = Array.from({ length: steps }, (_, i) => (maxValue * i) / (steps - 1));

  const xScale = (index: number) => {
    if (records.length === 1) return innerWidth / 2 + padding;
    return (index / (records.length - 1)) * innerWidth + padding;
  };

  const yScale = (value: number) => {
    return chartHeight - bottomPadding - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  };

  const weightPath = recordsWithCalculations
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(r.weight)}`)
    .join(" ");

  const fatWeightPath = recordsWithCalculations
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(r.fatWeight)}`)
    .join(" ");

  const muscleWeightPath = recordsWithCalculations
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(r.muscleWeight)}`)
    .join(" ");

  return (
    <div>
      <h3>{title || t("weightAbsoluteGraph.defaultTitle")}</h3>

      <svg
        width={chartWidth}
        height={chartHeight}
        style={{ border: "1px solid black", display: "block", width: "100%" }}
        aria-label={t("weightAbsoluteGraph.ariaLabel")}
      >
        <title>{t("weightAbsoluteGraph.title")}</title>
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

        {/* Fat weight line */}
        <path d={fatWeightPath} fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Muscle weight line */}
        <path d={muscleWeightPath} fill="none" stroke="#10b981" strokeWidth="2" />

        {/* Y-axis labels */}
        {stepValues.map((value) => {
          const y = yScale(value);
          return (
            <text
              key={`value-${value}`}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#666"
            >
              {value.toFixed(1)}
              {t("common.units.kg")}
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

      <p>{t("weightAbsoluteGraph.legend")}</p>

      <p>
        <strong>{t("weightAbsoluteGraph.dataPoints")}</strong> {records.length}
        <br />
        <strong>{t("weightAbsoluteGraph.dateRange")}</strong>{" "}
        {new Date(records[0].date).toLocaleDateString()} -{" "}
        {new Date(records[records.length - 1].date).toLocaleDateString()}
      </p>
    </div>
  );
}
